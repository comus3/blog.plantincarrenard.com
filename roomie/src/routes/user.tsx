import {
  createAsyncStore,
  useSubmissions,
  type RouteDefinition,
} from '@solidjs/router';
import { For, Show } from 'solid-js';
import { addUserAction, getUsers } from '~/lib/user';

export const route = {
  preload() {
    getUsers();
  },
} satisfies RouteDefinition;

export default function Users() {
  const users = createAsyncStore(() => getUsers(), { initialValue: [] });
  const submissions = useSubmissions(addUserAction);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-white font-thin uppercase my-16">Register User</h1>

      <form
        action={addUserAction}
        method="post"
        class="space-y-4 max-w-xl mx-auto text-left bg-white p-4 rounded shadow"
      >
        <input name="email" placeholder="Email" type="email" class="w-full p-2 border rounded" />
        <input name="username" placeholder="Username" class="w-full p-2 border rounded" />
        <input name="password" placeholder="Password" type="password" class="w-full p-2 border rounded" />
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>

      <section class="mt-12">
  <h2 class="text-2xl font-semibold mb-4">User List</h2>
  <ul class="space-y-2">
    <For each={users()}>
      {(user) => (
        <li class="bg-gray-100 p-3 rounded shadow">
          <strong>{user.username}</strong> <span class="text-sm">({user.email})</span> — <em class="text-xs text-gray-500">ID: {user.id}</em>
        </li>
      )}
    </For>

    <For each={submissions}>
      {(sub) => (
        <Show when={sub.pending}>
          <li class="bg-yellow-100 p-3 rounded shadow italic">
            Registering: {String(sub.input[0].get('username'))} (pending)
          </li>
        </Show>
      )}
    </For>
  </ul>
</section>

    </main>
  );
}
