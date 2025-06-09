// src/routes/explore/[username].tsx

import {  useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createResource, For, Show, Suspense } from "solid-js";
import { cache, createAsync } from "@solidjs/router";
import { PostCard } from "~/components/PostCard";
import type { User, PostWithAuthor } from "~/lib/types";

// Cache functions for server-side data fetching
const getUserByUsername = cache(async (username: string): Promise<User | null> => {
  "use server";
  try {
    const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/users/username/${username}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}, "user-by-username");

const getPostsByAuthor = cache(async (authorId: string): Promise<PostWithAuthor[]> => {
  "use server";
  try {
    const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/posts/author/${authorId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}, "posts-by-author");

export default function ExplorePage() {
  const params = useParams();
  
  // Fetch user data
  const user = createAsync(() => getUserByUsername(params.username));
  
  // Fetch posts data - only when we have a user
  const posts = createAsync(async () => {
    const userData = await getUserByUsername(params.username);
    if (!userData) return [];
    return getPostsByAuthor(userData.id);
  });
  
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
                <p class="text-gray-600">The user "@{params.username}" does not exist.</p>
              </div>
            }
          >
            {(userData) => (
              <div class="pt-8 pb-6">
                <div class="flex items-center">
                  <Show
                    when={userData().avatarUrl}
                    fallback={
                      <div class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                        <span class="text-gray-600 font-medium text-xl">
                          {userData().displayName[0]?.toUpperCase()}
                        </span>
                      </div>
                    }
                  >
                    <img
                      src={userData().avatarUrl}
                      alt={userData().displayName}
                      class="h-16 w-16 rounded-full object-cover mr-4"
                    />
                  </Show>
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900">{userData().displayName}</h1>
                    <p class="text-gray-600">@{userData().username}</p>
                  </div>
                </div>
                
                <Show when={userData().bio}>
                  <p class="mt-4 text-gray-700">{userData().bio}</p>
                </Show>
                
                <p class="mt-2 text-sm text-gray-500">
                  Joined on {new Date(userData().createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </Show>
        </Suspense>
        
        <div class="pb-12">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            <Show when={user()} fallback="Posts">
              {user()?.displayName}'s Posts
            </Show>
          </h2>
          
          <Suspense fallback={
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
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
                when={posts() && posts()!.length > 0}
                fallback={
                  <div class="col-span-full text-center py-12">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      No posts yet
                    </h3>
                    <p class="text-gray-500">
                      <Show when={user()} fallback="This user">
                        {user()?.displayName}
                      </Show> hasn't created any posts yet.
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