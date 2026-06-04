import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DUMMY_PRODUCTS = [
  {
    title: "Ocean Breeze Resin Coaster Set",
    description: "A set of 4 handcrafted resin coasters featuring a stunning ocean wave design. Made with premium heat-resistant epoxy and real sand.",
    price: 35.00,
    category: "RESIN_COASTERS",
    imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  },
  {
    title: "Gold Flake Geode Coasters",
    description: "Luxurious geode-style coasters embedded with authentic 24k gold flakes. Perfect for adding a touch of elegance to your coffee table.",
    price: 45.00,
    category: "RESIN_COASTERS",
    imageUrl: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  },
  {
    title: "Floral Preservation Pendant",
    description: "A delicate dried rose petal preserved forever in crystal clear UV resin. Comes with a 925 sterling silver chain.",
    price: 55.00,
    category: "RESIN_JEWELRY",
    imageUrl: "https://images.unsplash.com/photo-1599643478524-fb524b21559e?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  },
  {
    title: "Galaxy Swirl Resin Ring",
    description: "Handcrafted resin ring featuring deep space colors and holographic glitters. Each piece is entirely unique.",
    price: 25.00,
    category: "RESIN_JEWELRY",
    imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  },
  {
    title: "Luxury Spa Gift Hamper",
    description: "The ultimate relaxation package. Includes artisan soaps, bath bombs, a custom resin soap dish, and a plush face towel.",
    price: 85.00,
    category: "GIFT_HAMPERS",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  },
  {
    title: "Artisan Coffee Lover Hamper",
    description: "Curated for the coffee enthusiast. Features premium roasted beans, a custom resin coaster, and a ceramic mug.",
    price: 65.00,
    category: "GIFT_HAMPERS",
    imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  },
  {
    title: "Wedding Bouquet Preservation Block",
    description: "Custom service to preserve your wedding flowers in a large, crystal clear resin block. A timeless keepsake.",
    price: 150.00,
    category: "CUSTOM_KEEPSAKES",
    imageUrl: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  },
  {
    title: "Pet Memorial Resin Heart",
    description: "A beautiful custom heart-shaped resin piece preserving your pet's ashes or fur, mixed with subtle colors of your choice.",
    price: 75.00,
    category: "CUSTOM_KEEPSAKES",
    imageUrl: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80&w=1000",
    inStock: true
  }
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data to avoid duplicates
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.product.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // Create Default Admin and User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.admin.create({
    data: {
      username: 'admin',
      password: adminPassword,
    }
  });
  console.log('Created default admin: admin / admin123');

  await prisma.user.create({
    data: {
      name: 'Customer',
      email: 'user@example.com',
      password: userPassword,
    }
  });
  console.log('Created default user: user@example.com / user123');
  
  const createdProducts = [];
  
  for (const product of DUMMY_PRODUCTS) {
    const p = await prisma.product.create({
      data: product as any
    });
    createdProducts.push(p);
    console.log(`Created product with id: ${p.id}`);
  }

  // Create Dummy Orders
  const dummyOrders = [
    {
      customerName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1234567890",
      address: "123 Maple Street, Dreamville",
      totalAmount: createdProducts[0].price * 2,
      status: "PENDING" as any,
      items: [
        { productId: createdProducts[0].id, quantity: 2, price: createdProducts[0].price }
      ]
    },
    {
      customerName: "John Smith",
      email: "john.smith@example.com",
      phone: "+0987654321",
      address: "456 Oak Avenue, Metropolis",
      totalAmount: createdProducts[4].price + createdProducts[5].price,
      status: "IN_PRODUCTION" as any,
      items: [
        { productId: createdProducts[4].id, quantity: 1, price: createdProducts[4].price },
        { productId: createdProducts[5].id, quantity: 1, price: createdProducts[5].price }
      ]
    },
    {
      customerName: "Alice Wonderland",
      email: "alice@example.com",
      phone: "+1122334455",
      address: "789 Rabbit Hole, Fantasy",
      totalAmount: createdProducts[6].price,
      status: "SHIPPED" as any,
      items: [
        { productId: createdProducts[6].id, quantity: 1, price: createdProducts[6].price }
      ]
    }
  ];

  for (const order of dummyOrders) {
    const { items, ...orderData } = order;
    const o = await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items
        }
      }
    });
    console.log(`Created order for ${o.customerName}`);
  }

  // Create Dummy Inquiries
  const dummyInquiries = [
    {
      name: "Michael Scott",
      email: "michael@paper.com",
      subject: "Custom Order Inquiry",
      message: "Can I order a custom resin paperweight that looks like a stapler inside jello?"
    },
    {
      name: "Pam Beesly",
      email: "pam@art.com",
      subject: "Wholesale Pricing",
      message: "Do you offer wholesale pricing for bulk resin coasters for a wedding?"
    }
  ];

  for (const inquiry of dummyInquiries) {
    const i = await prisma.inquiry.create({
      data: inquiry
    });
    console.log(`Created inquiry from ${i.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
