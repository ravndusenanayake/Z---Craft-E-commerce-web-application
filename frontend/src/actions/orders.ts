"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
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
