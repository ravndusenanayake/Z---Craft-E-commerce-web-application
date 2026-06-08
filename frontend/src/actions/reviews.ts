"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(data: {
  productId: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
}) {
  // Validate rating
  if (data.rating < 1 || data.rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5." };
  }
  if (!data.comment.trim()) {
    return { success: false, error: "Comment cannot be empty." };
  }
  if (!data.name.trim()) {
    return { success: false, error: "Name is required." };
  }

  try {
    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        rating: data.rating,
        comment: data.comment.trim(),
      }
    });
    revalidatePath(`/product/${data.productId}`);
    return { success: true, review };
  } catch (error) {
    console.error("Failed to submit review", error);
    return { success: false, error: "Failed to submit review. Please try again." };
  }
}

export async function getReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    const count = reviews.length;
    const avgRating = count > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0;

    // Rating distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { distribution[r.rating] = (distribution[r.rating] || 0) + 1; });

    return { reviews, count, avgRating, distribution };
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return { reviews: [], count: 0, avgRating: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
}
