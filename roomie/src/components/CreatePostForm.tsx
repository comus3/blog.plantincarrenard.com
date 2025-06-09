// src/components/CreatePostForm.tsx

import { Component, createSignal, Show, For, createResource, Suspense } from "solid-js";
import { useAction, useSubmission } from "@solidjs/router";
import { MarkdownEditor } from "./MarkdownEditor";
import { FileUploader } from "./FileUploader";
import { PostType } from "~/lib/types";
import { createPostAction } from "~/lib/posts";
import { getCurrentUser } from "~/lib/auth";

export const CreatePostForm: Component = () => {
  const [selectedType, setSelectedType] = createSignal<PostType>('markdown');
  const [content, setContent] = createSignal('');
  
  // Fetch current user using the same pattern as NavBar
  const [user] = createResource(() => getCurrentUser());
  
  // Use the modern useSubmission hook instead of useSubmissions
  const createPost = useAction(createPostAction);
  const submission = useSubmission(createPostAction);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const currentUser = user();
    if (!currentUser) {
      return; // Don't submit if no user
    }
    
    // Ensure content is added to form data
    formData.set('content', content());
    formData.set('authorId', currentUser.id);
    
    await createPost(formData);
  };

  return (
    <Suspense 
      fallback={
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="border-b border-gray-200">
            <div class="px-4 sm:px-6 py-4">
              <h2 class="text-lg font-medium text-gray-900">Create a New Post</h2>
            </div>
          </div>
          <div class="p-4 sm:p-6">
            <div class="animate-pulse space-y-4">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="grid grid-cols-4 gap-3">
                <div class="h-12 bg-gray-200 rounded"></div>
                <div class="h-12 bg-gray-200 rounded"></div>
                <div class="h-12 bg-gray-200 rounded"></div>
                <div class="h-12 bg-gray-200 rounded"></div>
              </div>
              <div class="h-32 bg-gray-200 rounded"></div>
              <div class="h-10 bg-gray-200 rounded w-24 ml-auto"></div>
            </div>
          </div>
        </div>
      }
    >
      <Show 
        when={user()} 
        fallback={
          <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div class="border-b border-gray-200">
              <div class="px-4 sm:px-6 py-4">
                <h2 class="text-lg font-medium text-gray-900">Create a New Post</h2>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <div class="text-center py-8">
                <p class="text-gray-500 mb-4">You need to be logged in to create a post.</p>
                <a 
                  href="/login"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Login to Continue
                </a>
              </div>
            </div>
          </div>
        }
      >
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">Create a New Post</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} class="p-4 sm:p-6">
        <div class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Post Title
            </label>
            <div class="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter post title..."
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <For each={['markdown', 'audio', 'video', 'gif'] as PostType[]}>
                {(type) => (
                  <label
                    class={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedType() === type
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="contentType"
                      value={type}
                      checked={selectedType() === type}
                      onChange={() => setSelectedType(type)}
                      class="sr-only"
                    />
                    <span class="capitalize">{type}</span>
                  </label>
                )}
              </For>
            </div>
          </div>

          <div>
            <Show when={selectedType() === 'markdown'}>
              <MarkdownEditor onChange={setContent} />
            </Show>

            <Show when={selectedType() !== 'markdown'}>
              <FileUploader 
                type={selectedType()} 
                onFileSelect={(file) => {
                  if (typeof file === 'string') {
                    setContent(file);
                  }
                }} 
              />
            </Show>
          </div>

          {/* Show error from submission */}
          <Show when={submission.result && submission.result.error}>
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{submission.result?.error}</p>
                </div>
              </div>
            </div>
          </Show>

          {/* Show success message */}
          <Show when={submission.result && submission.result.success}>
            <div class="bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">
                    Post created successfully! It will appear in your profile.
                  </p>
                </div>
              </div>
            </div>
          </Show>

          {/* Show pending state */}
          <Show when={submission.pending}>
            <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">Creating post...</p>
                </div>
              </div>
            </div>
          </Show>

          <div class="flex justify-end">
            <button
              type="submit"
              disabled={submission.pending}
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submission.pending ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
      </Show>
    </Suspense>
  );
};