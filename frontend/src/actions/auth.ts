"use server";

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { setSession, clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return { error: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return { error: 'Invalid credentials' };
  }

  await setSession({ id: admin.id, username: admin.username, role: 'ADMIN' });
  
  redirect('/admin/dashboard');
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: 'Invalid credentials' };
  }

  await setSession({ id: user.id, email: user.email, name: user.name, role: 'USER' });
  
  redirect('/shop');
}

export async function logout() {
  await clearSession();
  redirect('/');
}

export async function getSessionAction() {
  return await getSession();
}
