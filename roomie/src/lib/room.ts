// lib/room.ts
import { z } from 'zod';
import { query, action } from "@solidjs/router";
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

const roomSchema = z.object({
  ownerId: z.string().min(1),
  name: z.string().min(1),
  config: z.string().transform(val => JSON.parse(val || '{}')),
  posterItems: z.string().transform(val => JSON.parse(val || '[]')),
  musicLinks: z.string().transform(val => JSON.parse(val || '[]')),
  library: z.string().transform(val => JSON.parse(val || '[]')),
});

export const addRoom = async (form: FormData) => {
  'use server';

  const parsed = roomSchema.parse(Object.fromEntries(form.entries()));

  return await db.room.create({
    data: {
      ownerId: parsed.ownerId,
      name: parsed.name,
      config: parsed.config,
      posterItems: parsed.posterItems,
      musicLinks: parsed.musicLinks,
      library: parsed.library,
    },
  });
};
export const addRoomAction = action(addRoom);

export const getRooms = query(async () => {
  'use server';
  return await db.room.findMany();
}, 'getRooms');


export const getRoomByUsername = query(async (username: string) => {
  'use server';

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) throw new Error(`User not found: ${username}`);

  const room = await db.room.findFirst({
    where: { ownerId: user.id },
  });

  if (!room) throw new Error(`No personal room found for user: ${username}`);

  return room;
}, 'getRoomByUsername');


