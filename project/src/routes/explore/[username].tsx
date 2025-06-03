import { Title, useParams, useRouteData } from "solid-start";
import { createResource, For, Show, Suspense } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { PostCard } from "~/components/PostCard";
import { getUserByUsername, getPostsByUser } from "~/lib/mockData";
import { PostWithAuthor } from "~/lib/types";

export function routeData() {
  const params = useParams();
  
  const user = createServerData$(
    async (username) => getUserByUsername(username),
    { key: () => params.username }
  );
  
  const posts = createServerData$(
    async (username) => {
      const user = await getUserByUsername(username);
      if (!user) return [];
      return getPostsByUser(user.id);
    },
    { key: () => params.username }
  );
  
  return { user, posts };
}

export default function Explore() {
  const params = useParams();
  const { user, posts } = useRouteData<typeof routeData>();
  
  return (
    <>
      <Title>{user()?.displayName || 'User'} | Profile</Title>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div class="animate-pulse pt-8 pb-6">
            <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        }>
          <Show
            when={user()}
            fallback={
              <div class="py-12 text-center">
                <h1 class="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
                <p class="text-gray-600">The user "{params.username}" does not exist.</p>
              </div>
            }
          >
            <div class="pt-8 pb-6">
              <div class="flex items-center">
                <img
                  src={user()?.avatarUrl}
                  alt={user()?.displayName}
                  class="h-16 w-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">{user()?.displayName}</h1>
                  <p class="text-gray-600">@{user()?.username}</p>
                </div>
              </div>
              
              <p class="mt-4 text-gray-700">{user()?.bio}</p>
              
              <p class="mt-2 text-sm text-gray-500">
                Joined on {new Date(user()?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </Show>
        </Suspense>
        
        <div class="pb-12">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            {user()?.displayName}'s Posts
          </h2>
          
          <Suspense fallback={
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map(() => (
                <div class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div class="p-5">
                    <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div class="flex items-center mb-4">
                      <div class="h-6 w-6 rounded-full bg-gray-200 mr-2"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div class="space-y-2">
                      <div class="h-4 bg-gray-200 rounded w-full"></div>
                      <div class="h-4 bg-gray-200 rounded w-full"></div>
                      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Show
                when={posts()?.length > 0}
                fallback={
                  <div class="col-span-full text-center py-12">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      No posts yet
                    </h3>
                    <p class="text-gray-500">
                      {user()?.displayName} hasn't created any posts yet.
                    </p>
                  </div>
                }
              >
                <For each={posts()}>
                  {(post: PostWithAuthor) => (
                    <PostCard post={post} showAuthor={false} />
                  )}
                </For>
              </Show>
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}