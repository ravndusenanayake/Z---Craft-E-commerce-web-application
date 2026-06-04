"use server";

import prisma from "@/lib/prisma";

import { Category } from '@prisma/client';

export async function getProducts(category?: string) {
  try {
    if (category && category !== 'ALL') {
      return await prisma.product.findMany({
        where: { category: category as Category }
      });
    }
    return await prisma.product.findMany();
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Failed to fetch product", error);
    return null;
  }
}
