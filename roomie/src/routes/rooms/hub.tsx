// routes/rooms.tsx
import {
  createAsyncStore,
  useSubmissions,
  type RouteDefinition,
} from '@solidjs/router';
import { For, Show } from 'solid-js';
import { addRoomAction, getRooms } from '~/lib/room';

export const route = {
  preload() {
    getRooms();
  },
} satisfies RouteDefinition;

export default function Rooms() {
  const rooms = createAsyncStore(() => getRooms(), { initialValue: [] });
  const submissions = useSubmissions(addRoomAction);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-white font-thin uppercase my-16">All Rooms</h1>

      <form
        action={addRoomAction}
        method="post"
        class="space-y-4 max-w-xl mx-auto text-left bg-white p-4 rounded shadow"
      >
        <input name="ownerId" placeholder="Owner ID" class="w-full p-2 border rounded" />
        <input name="name" placeholder="Room Name" class="w-full p-2 border rounded" />
        <textarea name="config" placeholder="Config JSON" class="w-full p-2 border rounded" />
        <textarea name="posterItems" placeholder="Poster Items JSON" class="w-full p-2 border rounded" />
        <textarea name="musicLinks" placeholder="Music Links JSON" class="w-full p-2 border rounded" />
        <textarea name="library" placeholder="Library JSON" class="w-full p-2 border rounded" />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Add Room</button>
      </form>

      <section class="mt-12">
        <h2 class="text-2xl font-semibold mb-4">Room List</h2>
        <ul class="space-y-2">
          <For each={rooms()}>
            {(room) => (
              <li class="bg-gray-100 p-3 rounded shadow">
                <strong>{room.name}</strong> <span class="text-sm">(Owner: {room.ownerId})</span>
              </li>
            )}
          </For>

          <For each={submissions}>
            {(sub) => (
              <Show when={sub.pending}>
                <li class="bg-yellow-100 p-3 rounded shadow italic">
                  Adding: {String(sub.input[0].get('name'))} (pending)
                </li>
              </Show>
            )}
          </For>
        </ul>
      </section>
    </main>
  );
}
