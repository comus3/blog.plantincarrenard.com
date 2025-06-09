// src/routes/profile/[username].tsx

import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createAsync, cache } from "@solidjs/router";
import { For, Show, Suspense, createMemo, createEffect } from "solid-js";
import { PostCard } from "~/components/PostCard";
import { CreatePostForm } from "~/components/CreatePostForm";
import { User, PostWithAuthor } from "~/lib/types";
import { getCurrentUser } from "~/lib/auth"; 

// Cache functions for server-side data fetching
const getUser = cache(async (username: string): Promise<User | null> => {
  "use server";
  
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/users/username/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}, "user");

const getUserPosts = cache(async (authorId: string): Promise<PostWithAuthor[]> => {
  "use server";
  
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/posts/author/${authorId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch user posts: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}, "user-posts");

export default function Profile() {
  const params = useParams();
  
  // Create reactive username signal that properly tracks param changes
  const username = createMemo(() => params.username);
  
  // Fetch current user first (this doesn't depend on params)
  const currentUser = createAsync(() => getCurrentUser());
  
  // Reactive data fetching with proper dependency tracking
  const user = createAsync(() => {
    const currentUsername = username();
    if (!currentUsername) return Promise.resolve(null);
    
    console.log('Fetching user for:', currentUsername);
    return getUser(currentUsername);
  });
  
  const posts = createAsync(() => {
    const userData = user();
    if (!userData?.id) return Promise.resolve([]);
    
    console.log('Fetching posts for user ID:', userData.id);
    return getUserPosts(userData.id);
  });
  
  // Check if this profile belongs to the current user
  const isCurrentUser = createMemo(() => {
    const current = currentUser();
    const profileUser = user();
    return !!(current && profileUser && current.username === profileUser.username);
  });

  // Debug effect to track state changes
  createEffect(() => {
    console.log('Profile state update:', {
      username: username(),
      userLoaded: !!user(),
      postsCount: posts()?.length || 0,
      isCurrentUser: isCurrentUser()
    });
  });

  // Format date helper
  const formatJoinDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };
  
  return (
    <>
      <Title>{user()?.displayName || username() || 'User'} | Profile</Title>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        <Suspense fallback={
          <div class="animate-pulse pt-8 pb-6">
            <div class="flex items-center">
              <div class="h-16 w-16 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <div class="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div class="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        }>
          <Show
            when={user()}
            fallback={
              <div class="py-12 text-center">
                <h1 class="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
                <p class="text-gray-600">The user "{username()}" does not exist.</p>
              </div>
            }
          >
            {(userData) => (
              <div class="pt-8 pb-6">
                <div class="flex items-center">
                  <img
                    src={userData().avatarUrl || '/default-avatar.svg'}
                    alt={userData().displayName}
                    class="h-16 w-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.svg';
                    }}
                  />
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900">{userData().displayName}</h1>
                    <p class="text-gray-600">@{userData().username}</p>
                  </div>
                </div>
                
                <Show when={userData().bio}>
                  <p class="mt-4 text-gray-700 whitespace-pre-line">{userData().bio}</p>
                </Show>
                
                <p class="mt-2 text-sm text-gray-500">
                  Joined on {formatJoinDate(new Date(userData().createdAt).toISOString())}
                </p>
              </div>
            )}
          </Show>
        </Suspense>
        
        {/* Create Post Form - only show for current user */}
        <Show when={isCurrentUser()}>
          <div class="my-8 border-t border-gray-200 pt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Create New Post</h2>
            <CreatePostForm />
          </div>
        </Show>
        
        {/* Posts Section */}
        <div class="pb-12">
          <div class="border-t border-gray-200 pt-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6">
              {isCurrentUser() ? 'Your Posts' : `${user()?.displayName || username()}'s Posts`}
            </h2>
            
            <Suspense fallback={
              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <For each={Array(6).fill(0)}>
                  {(_, i) => (
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div class="p-5">
                        <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div class="flex items-center mb-4">
                          <div class="h-6 w-6 rounded-full bg-gray-200 mr-2"></div>
                          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div class="space-y-2 mb-4">
                          <div class="h-4 bg-gray-200 rounded w-full"></div>
                          <div class="h-4 bg-gray-200 rounded w-full"></div>
                          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div class="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            }>
              <Show
                when={posts() && posts()!.length > 0}
                fallback={
                  <div class="text-center py-16 bg-gray-50 rounded-lg">
                    <div class="max-w-sm mx-auto">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <h3 class="text-lg font-medium text-gray-900 mb-2">
                        No posts yet
                      </h3>
                      <p class="text-gray-500">
                        {isCurrentUser() 
                          ? "You haven't created any posts yet. Use the form above to share your first post!" 
                          : `${user()?.displayName || username()} hasn't shared any posts yet.`}
                      </p>
                    </div>
                  </div>
                }
              >
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <For each={posts()}>
                    {(post: PostWithAuthor) => (
                      <PostCard post={post} showAuthor={false} preview={true} />
                    )}
                  </For>
                </div>
              </Show>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}