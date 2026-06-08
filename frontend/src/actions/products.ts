"use server";

import prisma from "@/lib/prisma";
import { Category } from '@prisma/client';
import { revalidatePath } from "next/cache";

export async function getProducts(category?: string) {
  try {
    if (category && category !== 'ALL') {
      return await prisma.product.findMany({
        where: { category: category as Category },
        orderBy: { createdAt: 'desc' }
      });
    }
    return await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch (error) {
    console.error("Failed to fetch product", error);
    return null;
  }
}

export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category as Category,
        imageUrl: data.imageUrl,
        inStock: data.inStock,
      }
    });
    revalidatePath('/admin/dashboard');
    revalidatePath('/shop');
    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to create product", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
}) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category as Category,
        imageUrl: data.imageUrl,
        inStock: data.inStock,
      }
    });
    revalidatePath('/admin/dashboard');
    revalidatePath('/shop');
    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to update product", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Delete related OrderItems first to avoid FK constraint
    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/dashboard');
    revalidatePath('/shop');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product", error);
    return { success: false, error: "Failed to delete product" };
  }
}
