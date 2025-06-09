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
  const [title, setTitle] = createSignal('');
  
  // Fetch current user using the same pattern as NavBar
  const [user] = createResource(() => getCurrentUser());
  
  // Use the modern useSubmission hook instead of useSubmissions
  const createPost = useAction(createPostAction);
  const submission = useSubmission(createPostAction);

  // Add this debug function
  const debugFormState = () => {
    const titleValue = title();
    const contentValue = content();
    const titleTrimmed = titleValue.trim();
    const contentTrimmed = contentValue.trim();
    const isPending = submission.pending;
    const isDisabled = isPending || !titleTrimmed || !contentTrimmed;
    
    console.log('🐛 Form State Debug:', {
      title: `"${titleValue}"`,
      content: `"${contentValue}"`,
      titleTrimmed: `"${titleTrimmed}"`,
      contentTrimmed: `"${contentTrimmed}"`,
      titleLength: titleValue.length,
      contentLength: contentValue.length,
      titleTrimmedLength: titleTrimmed.length,
      contentTrimmedLength: contentTrimmed.length,
      isPending,
      isDisabled,
      selectedType: selectedType(),
      user: user()?.username || 'not loaded'
    });
    
    return isDisabled;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    console.log('🚀 Form submitted');
    debugFormState();
    
    const currentUser = user();
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    // Validate required fields
    if (!title().trim()) {
      console.error('Title is required');
      return;
    }

    if (!content().trim()) {
      console.error('Content is required');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.set('title', title().trim());
    formData.set('content', content().trim());
    formData.set('contentType', selectedType());
    formData.set('authorId', currentUser.id);

    console.log('Submitting form data:', {
      title: title().trim(),
      content: content().trim(),
      contentType: selectedType(),
      authorId: currentUser.id
    });

    try {
      const result = await createPost(formData);
      console.log('Create post result:', result);
      
      // Reset form on success
      if (result && !result.error) {
        setTitle('');
        setContent('');
        setSelectedType('markdown');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFileSelect = (file: File | string) => {
    console.log('File selected:', file);
    if (typeof file === 'string') {
      setContent(file);
    } else if (file instanceof File) {
      // Convert file to base64 or handle file upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setContent(result);
        }
      };
      
      // For images/gifs, read as data URL
      if (selectedType() === 'gif' || selectedType() === 'video') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  // Add this right before your return statement to debug on every render:
  const isButtonDisabled = debugFormState();

  return (
    <Suspense 
      fallback={<div>Loading...</div>}
    >
      <Show 
        when={user()} 
        fallback={<div>error...?</div>}
      >
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="border-b border-gray-200">
            <div class="px-4 sm:px-6 py-4">
              <h2 class="text-lg font-medium text-gray-900">Create a New Post</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} class="p-4 sm:p-6">
            <div class="space-y-6">
              {/* Title input */}
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
                      console.log('Title updated:', newTitle);
                    }}
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter post title..."
                  />
                </div>
              </div>

              {/* Content type selection */}
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
                            setContent(''); // Reset content when switching types
                            console.log('Content type changed to:', type);
                          }}
                          class="sr-only"
                        />
                        <span class="capitalize">{type}</span>
                      </label>
                    )}
                  </For>
                </div>
              </div>

              {/* Content editor */}
              <div>
                <Show when={selectedType() === 'markdown'}>
                  <MarkdownEditor 
                    initialValue={content()}
                    onChange={(newContent) => {
                      setContent(newContent);
                      console.log('Content updated from MarkdownEditor:', newContent);
                    }} 
                  />
                </Show>

                <Show when={selectedType() !== 'markdown'}>
                  <FileUploader 
                    type={selectedType()} 
                    onFileSelect={handleFileSelect}
                  />
                  <Show when={content()}>
                    <div class="mt-4 p-4 bg-gray-50 rounded-md">
                      <p class="text-sm text-gray-600">
                        File content loaded ({content().length} characters)
                      </p>
                      <Show when={selectedType() === 'gif' && content().startsWith('data:image')}>
                        <img 
                          src={content()} 
                          alt="Preview" 
                          class="mt-2 max-w-xs max-h-32 object-contain rounded"
                        />
                      </Show>
                    </div>
                  </Show>
                </Show>
              </div>

              {/* Debug info - remove this in production */}
              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p class="text-sm text-yellow-800">
                  Debug: Button disabled = {isButtonDisabled.toString()}
                </p>
                <p class="text-sm text-yellow-800">
                  Title: "{title()}" (length: {title().length})
                </p>
                <p class="text-sm text-yellow-800">
                  Content: "{content()}" (length: {content().length})
                </p>
              </div>

              {/* Error/Success/Pending states */}
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
                  disabled={isButtonDisabled}
                  class={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    isButtonDisabled 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                  onClick={() => console.log('Button clicked! Disabled:', isButtonDisabled)}
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