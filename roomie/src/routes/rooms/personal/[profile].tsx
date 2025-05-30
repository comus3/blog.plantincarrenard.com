// routes/rooms/personal/[profile].tsx
import { createAsyncStore, type RouteDefinition } from '@solidjs/router';
import { useParams } from '@solidjs/router';
import { getRoomByUsername } from '~/lib/room';
import RoomViewer from '~/components/RoomViewer';

export const route = {
  preload({ params }) {
    return getRoomByUsername(params.profile);
  },
} satisfies RouteDefinition;

export default function PersonalRoom() {
  const params = useParams();
  const roomStore = createAsyncStore(() => getRoomByUsername(params.profile));

  return (
    <main class="min-h-screen bg-neutral-900 text-white p-4">
      <RoomViewer room={roomStore()} />
    </main>
  );
}
