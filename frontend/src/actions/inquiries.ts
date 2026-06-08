"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }
    });
    revalidatePath('/admin/inquiries');
    return { success: true, id: inquiry.id };
  } catch (error) {
    console.error("Failed to submit inquiry", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function getInquiries() {
  try {
    return await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch inquiries", error);
    return [];
  }
}
