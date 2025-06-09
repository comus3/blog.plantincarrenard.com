// src/routes/profile/[username].tsx - CLEAN VERSION WITHOUT DEBUG

import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createAsync, cache } from "@solidjs/router";
import { Show, Suspense, createMemo, onMount, createSignal } from "solid-js";
import { User } from "~/lib/types";
import { useAuth } from "~/components/AuthProvider";
import { isServer } from "solid-js/web";
import { CreatePostForm } from "~/components/CreatePostForm";

// Cache function for server-side data fetching
const getUser = cache(async (username: string): Promise<User | null> => {
  "use server";
  
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/users/username/${username}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}, "user");

export default function Profile() {
  const params = useParams();
  const { user: currentUser, isLoggedIn, isLoading: authLoading } = useAuth();
  
  const [isMounted, setIsMounted] = createSignal(false);
  
  onMount(() => {
    setIsMounted(true);
  });
  
  const username = createMemo(() => params.username);
  
  const user = createAsync(() => {
    const currentUsername = username();
    if (!currentUsername) return Promise.resolve(null);
    return getUser(currentUsername);
  });
  
  const isCurrentUser = createMemo(() => {
    const current = currentUser();
    const profileUser = user();
    return !!(current && profileUser && current.username === profileUser.username);
  });

  const shouldShowCreateForm = createMemo(() => {
    return isMounted() && !authLoading() && isLoggedIn() && isCurrentUser();
  });
  
  return (
    <div>
      <Title>{user()?.displayName || username() || 'Profile'}</Title>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Section */}
        <Suspense fallback={
          <div class="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p class="text-blue-700">Loading user profile...</p>
          </div>
        }>
          <Show
            when={user()}
            fallback={
              <div class="bg-red-50 border border-red-200 rounded p-4 mb-6">
                <h2 class="text-red-800 font-bold">User not found</h2>
                <p class="text-red-700">The user "{username()}" does not exist.</p>
              </div>
            }
          >
            {(userData) => (
              <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                    <h1 class="text-3xl font-bold text-gray-900">{userData().displayName}</h1>
                    <p class="text-gray-600">@{userData().username}</p>
                  </div>
                </div>
                
                <Show when={userData().bio}>
                  <p class="mt-4 text-gray-700 whitespace-pre-line">{userData().bio}</p>
                </Show>
                
                <p class="mt-2 text-sm text-gray-500">
                  Joined on {new Date(userData().createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </Show>
        </Suspense>
        
        {/* Create Post Form for Current User */}
        <Show when={shouldShowCreateForm()}>
          <div class="mb-6">
            <CreatePostForm />
          </div>
        </Show>
        
        <Show when={!shouldShowCreateForm() && isMounted()}>
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <div class="bg-blue-50 border border-blue-200 rounded p-3">
              <p class="text-blue-700">
                {authLoading() ? 'Loading...' :
                 !isLoggedIn() ? 'Log in to create posts' :
                 !isCurrentUser() ? 'Visit your own profile to create posts' : 
                 'Unable to show create form'}
              </p>
            </div>
          </div>
        </Show>
        
      </div>
    </div>
  );
}