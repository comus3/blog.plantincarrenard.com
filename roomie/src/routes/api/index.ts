// routes/api/rooms/index.ts
import type { APIEvent } from "@solidjs/start/server";
import { getRooms } from "~/lib/room";

export async function GET(event: APIEvent) {
  'use server';
  return await getRooms();
}
