// src/components/CreatePostForm.tsx

import { Component, createSignal, Show, For, createEffect, onMount } from "solid-js";
import { useAction, useSubmission } from "@solidjs/router";
import { PostType } from "~/lib/types";
import { createPostAction } from "~/lib/posts";
import { useAuth } from "./AuthProvider";
import { isServer } from "solid-js/web";

// SSR-safe imports - these components handle client/server rendering gracefully
import { SimpleMarkdownEditor } from "./MarkdownEditor";
import { SimpleFileUploader } from "./FileUploader";

export const CreatePostForm: Component = () => {
  // SSR hydration logging - helps track server vs client rendering phases
  console.log(`🎨 [${isServer ? 'SERVER' : 'CLIENT'}] CreatePostForm rendering`);
  
  const [selectedType, setSelectedType] = createSignal<PostType>('markdown');
  const [content, setContent] = createSignal('');
  const [title, setTitle] = createSignal('');
  const [isMounted, setIsMounted] = createSignal(false);
  
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const createPost = useAction(createPostAction);
  const submission = useSubmission(createPostAction);

  onMount(() => {
    // Client-side only lifecycle - critical for SPA functionality after SSR hydration
    console.log(`🎯 CreatePostForm mounted on CLIENT`);
    setIsMounted(true);
  });

  const isFormValid = () => {
    const titleTrimmed = title().trim();
    const contentTrimmed = content().trim();
    const userExists = !!user();
    const notPending = !submission.pending;
    const notLoading = !authLoading();
    
    const isValid = titleTrimmed && contentTrimmed && userExists && notPending && notLoading;
    
    console.log(`📝 Form validation:`, {
      titleTrimmed: !!titleTrimmed,
      contentTrimmed: !!contentTrimmed,
      userExists,
      notPending,
      notLoading,
      isValid
    });
    
    return isValid;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    console.log('🚀 CreatePostForm submitted');
    
    if (!isFormValid()) {
      console.warn('⚠️ Form validation failed');
      return;
    }
    
    const currentUser = user();
    if (!currentUser) {
      console.error('❌ No user logged in');
      return;
    }

    const formData = new FormData();
    formData.set('title', title().trim());
    formData.set('content', content().trim());
    formData.set('contentType', selectedType());
    formData.set('authorId', currentUser.id);

    console.log('📤 Submitting form data');

    try {
      // Server action call - handles both SSR and SPA contexts seamlessly
      const result = await createPost(formData);
      console.log('✅ Create post result:', result);
      
      if (result && !result.error) {
        setTitle('');
        setContent('');
        setSelectedType('markdown');
        console.log('🔄 Form reset after successful submission');
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error);
    }
  };

  return (
    <Show 
      when={!authLoading() && isLoggedIn() && user()} 
      fallback={
        <div class="bg-gray-50 rounded p-4">
          <p class="text-gray-500">Please log in to create posts.</p>
        </div>
      }
    >
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        
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
                  id="title"
                  required
                  value={title()}
                  onInput={(e) => {
                    const newTitle = e.currentTarget.value;
                    setTitle(newTitle);
                    console.log('📝 Title updated:', newTitle);
                  }}
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
                        onChange={() => {
                          setSelectedType(type);
                          setContent('');
                          console.log('📝 Content type changed to:', type);
                        }}
                        class="sr-only"
                      />
                      <span class="capitalize">{type}</span>
                    </label>
                  )}
                </For>
              </div>
            </div>

            {/* Dynamic content editor - switches between components based on type */}
            <div>
              <Show when={selectedType() === 'markdown'}>
                <SimpleMarkdownEditor 
                  initialValue={content()}
                  onChange={(newContent) => {
                    setContent(newContent);
                    console.log('📝 Content updated:', newContent.length, 'characters');
                  }} 
                />
              </Show>

              <Show when={selectedType() !== 'markdown'}>
                <SimpleFileUploader 
                  type={selectedType()} 
                  onFileSelect={(file) => {
                    if (typeof file === 'string') {
                      setContent(file);
                    }
                  }}
                />
              </Show>
            </div>

            {/* Progressive enhancement - submission states work in both SSR and SPA modes */}
            <Show when={submission.result && submission.result.error}>
              <div class="bg-red-50 border border-red-200 rounded-md p-4">
                <p class="text-sm text-red-700">{submission.result?.error}</p>
              </div>
            </Show>

            <Show when={submission.result && submission.result.success}>
              <div class="bg-green-50 border border-green-200 rounded-md p-4">
                <p class="text-sm text-green-700">Post created successfully!</p>
              </div>
            </Show>

            <Show when={submission.pending}>
              <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p class="text-sm text-blue-700">Creating post...</p>
              </div>
            </Show>

            <div class="flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid()}
                class={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isFormValid()
                    ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={() => console.log('🖱️ Button clicked! Valid:', isFormValid())}
              >
                {submission.pending ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Show>
  );
};