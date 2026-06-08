import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
export const apiRouter = Router();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Memory-based Rate Limiter (Prevent Brute-force & Denial of Service)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
export const rateLimiter = (req: Request, res: Response, next: any) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const rateLimit = rateLimitMap.get(ip as string);
  
  if (!rateLimit) {
    rateLimitMap.set(ip as string, { count: 1, resetTime: now + 60000 });
    return next();
  }
  
  if (now > rateLimit.resetTime) {
    rateLimit.count = 1;
    rateLimit.resetTime = now + 60000;
    return next();
  }
  
  rateLimit.count++;
  if (rateLimit.count > 150) { // Limit: 150 requests per minute
    return res.status(429).json({ 
      success: false, 
      message: 'Too many requests from this IP. Please try again after a minute.' 
    });
  }
  next();
};

// Security Headers (CSP, Frame options, XSS protection, HSTS)
export const securityHeaders = (req: Request, res: Response, next: any) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

// ==========================================
// 1. AUTHENTICATION & RBAC ENDPOINTS
// ==========================================

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // Check admin first
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (admin) {
    const isValid = await bcrypt.compare(password, admin.password);
    if (isValid) {
      await prisma.auditLog.create({
        data: { username, action: 'ADMIN_LOGIN', details: 'Successful admin login', ipAddress: req.ip }
      });
      return res.json({
        success: true,
        message: 'Admin login successful',
        data: { id: admin.id, username: admin.username, role: 'ADMIN' }
      });
    }
  }

  // Check regular user
  const user = await prisma.user.findUnique({ where: { username } });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      await prisma.auditLog.create({
        data: { userId: user.id, username: user.username, action: 'USER_LOGIN', details: 'Successful customer login', ipAddress: req.ip }
      });
      return res.json({
        success: true,
        message: 'User login successful',
        data: { id: user.id, username: user.username, name: user.name, email: user.email, role: 'USER' }
      });
    }
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// ==========================================
// 2. PRODUCTS MODULE (CONTENT MANAGEMENT)
// ==========================================

apiRouter.get('/products', async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: products });
});

apiRouter.post('/products', async (req: Request, res: Response) => {
  const { title, description, price, category, imageUrl, inStock } = req.body;
  try {
    const product = await prisma.product.create({
      data: { title, description, price: parseFloat(price), category, imageUrl, inStock: inStock !== false }
    });
    await prisma.auditLog.create({
      data: { action: 'PRODUCT_CREATE', details: `Created product: ${title} (${product.id})`, ipAddress: req.ip }
    });
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

apiRouter.put('/products/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, description, price, category, imageUrl, inStock } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { title, description, price: parseFloat(price), category, imageUrl, inStock }
    });
    await prisma.auditLog.create({
      data: { action: 'PRODUCT_UPDATE', details: `Updated product: ${title} (${id})`, ipAddress: req.ip }
    });
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

apiRouter.delete('/products/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const product = await prisma.product.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { action: 'PRODUCT_DELETE', details: `Deleted product: ${product.title} (${id})`, ipAddress: req.ip }
    });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. TRANSACTIONS MODULE (ORDERS)
// ==========================================

apiRouter.get('/orders', async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: orders });
});

apiRouter.patch('/orders/:id/status', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    await prisma.auditLog.create({
      data: { action: 'ORDER_STATUS_UPDATE', details: `Updated order ${id} status to ${status}`, ipAddress: req.ip }
    });
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. ANALYTICS EVENT LOGGING SYSTEM
// ==========================================

apiRouter.post('/analytics/event', async (req: Request, res: Response) => {
  const { eventType, page, sessionId, userId, metadata } = req.body;
  try {
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        page,
        sessionId,
        userId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
    res.status(201).json({ success: true, data: event });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

apiRouter.get('/analytics/dashboard', async (req: Request, res: Response) => {
  // Aggregate data for dashboard analytics report
  try {
    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany();
    const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    
    // Page views analytics grouping
    const events = await prisma.analyticsEvent.findMany({
      where: { eventType: 'PAGE_VIEW' }
    });
    
    const pageViewCounts: Record<string, number> = {};
    events.forEach(e => {
      pageViewCounts[e.page] = (pageViewCounts[e.page] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        revenue,
        pendingOrders,
        avgOrderValue: totalOrders > 0 ? revenue / totalOrders : 0,
        pageViews: pageViewCounts
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. AUDIT LOGGING VIEWER
// ==========================================

apiRouter.get('/audit-logs', async (req: Request, res: Response) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200
  });
  res.json({ success: true, data: logs });
});

// ==========================================
// 6. MEDIA MANAGER MODULE (LOCAL UPLOADS)
// ==========================================

apiRouter.get('/media', async (req: Request, res: Response) => {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: assets });
});

apiRouter.post('/media/upload', async (req: Request, res: Response) => {
  const { filename, content, category } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ success: false, message: 'Filename and base64 content are required' });
  }

  try {
    const base64Data = content.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const cleanFilename = `${Date.now()}-${filename.replace(/\s+/g, '_')}`;
    const uploadsDir = path.join(__dirname, '../public/uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, cleanFilename);
    fs.writeFileSync(filePath, buffer);

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: cleanFilename,
        url: `/uploads/${cleanFilename}`,
        category: category || 'PRODUCTS',
        sizeBytes: buffer.length,
        mimeType: content.match(/[^:]\w+\/[\w-+\d.]+(?=\;|)/)?.[0] || 'image/png'
      }
    });

    await prisma.auditLog.create({
      data: { action: 'MEDIA_UPLOAD', details: `Uploaded file: ${cleanFilename}`, ipAddress: req.ip }
    });

    res.status(201).json({ success: true, data: asset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
