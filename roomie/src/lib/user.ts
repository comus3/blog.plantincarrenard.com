import { z } from 'zod';
import { query, action } from '@solidjs/router';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';



export const db = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

export const addUser = async (form: FormData) => {
  'use server';

  const parsed = userSchema.parse(Object.fromEntries(form.entries()));
  const hashedPass = await bcrypt.hash(parsed.password, 10);


  return await db.user.create({
    data: {
      email: parsed.email,
      username: parsed.username,
      hashedPass,
    },
  });
};

export const addUserAction = action(addUser);

export const getUsers = query(async () => {
  'use server';
  return await db.user.findMany({
    select: { id: true, email: true, username: true, createdAt: true },
  });
}, 'getUsers');
