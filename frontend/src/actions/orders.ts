"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function createOrder(data: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  instructions: string;
  totalAmount: number;
  items: { productId: string; quantity: number; price: number }[];
}) {
  try {
    // Validate that all products exist in the database
    const productIds = data.items.map(item => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      select: { id: true, title: true }
    });

    const existingProductIds = new Set(existingProducts.map(p => p.id));
    const missingProductIds = productIds.filter(id => !existingProductIds.has(id));

    if (missingProductIds.length > 0) {
      return { 
        success: false, 
        error: "One or more products in your cart are no longer available. Please clear your cart and add the items again." 
      };
    }

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        instructions: data.instructions,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });
    
    revalidatePath('/admin/dashboard');
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order", error);
    return { success: false, error: "An unexpected error occurred while placing your order. Please try again." };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus }
    });
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status", error);
    return { success: false };
  }
}

export async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return [];
  }
}
