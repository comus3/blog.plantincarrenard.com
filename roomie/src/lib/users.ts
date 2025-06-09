// src/lib/users.ts
import { db } from './db';
import { z } from 'zod';
import type { User } from './types';

// Validation schemas
export const createUserSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(50),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  email: z.string().email().optional(), 
});

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

// Transform Prisma user to app User type
function transformUser(prismaUser: any): User {
  return {
    id: prismaUser.id,
    username: prismaUser.username,
    displayName: prismaUser.displayName,
    bio: prismaUser.bio,
    avatarUrl: prismaUser.avatarUrl,
    createdAt: prismaUser.createdAt.toISOString(),
  };
}

export async function createUser(data: z.infer<typeof createUserSchema>): Promise<User> {
  const validatedData = createUserSchema.parse(data);
  
  const user = await db.user.create({
    data: {
      username: validatedData.username,
      displayName: validatedData.displayName,
      bio: validatedData.bio || '',
      avatarUrl: validatedData.avatarUrl || '',
      email: validatedData.email || '', 
    },
  });
  
  return transformUser(user);
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { id },
  });
  
  return user ? transformUser(user) : null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const user = await db.user.findUnique({
    where: { username },
  });
  
  return user ? transformUser(user) : null;
}



export async function updateUser(id: string, data: z.infer<typeof updateUserSchema>): Promise<User> {
  const validatedData = updateUserSchema.parse(data);
  
  const user = await db.user.update({
    where: { id },
    data: validatedData,
  });
  
  return transformUser(user);
}

export async function deleteUser(id: string): Promise<void> {
  await db.user.delete({
    where: { id },
  });
}

export async function getAllUsers(): Promise<User[]> {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  return users.map(transformUser);
}

