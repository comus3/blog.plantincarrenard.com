// routes/api/rooms.ts
import type { APIEvent } from '@solidjs/start/server';
import { getRooms, addRoom } from '~/lib/room';

export async function GET(event: APIEvent) {
  'use server';
  const rooms = await getRooms();
  return new Response(JSON.stringify(rooms), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(event: APIEvent) {
  'use server';
  const form = await event.request.formData();
  const room = await addRoom(form);
  return new Response(JSON.stringify(room), {
    headers: { 'Content-Type': 'application/json' },
  });
}
