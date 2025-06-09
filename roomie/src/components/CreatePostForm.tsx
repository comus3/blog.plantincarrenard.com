import { Component, createSignal, Show } from "solid-js";
import { createServerAction$ } from "solid-start/server";
import { z } from "zod";
import { MarkdownEditor } from "./MarkdownEditor";
import { FileUploader } from "./FileUploader";
import { PostType } from "~/lib/types";
import { createPost, currentUser } from "~/lib/mockData";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  contentType: z.enum(["markdown", "audio", "video", "gif"]),
  content: z.string().min(1, "Content cannot be empty")
});

export const CreatePostForm: Component = () => {
  const [selectedType, setSelectedType] = createSignal<PostType>('markdown');
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal('');

  const [creating, { Form }] = createServerAction$(async (form: FormData) => {
    const title = form.get("title")?.toString() || "";
    const contentType = form.get("contentType")?.toString() as PostType;
    const content = form.get("content")?.toString() || "";

    const result = postSchema.safeParse({ title, contentType, content });

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    // Create the post
    const newPost = await createPost({
      title,
      contentType,
      content,
      authorId: currentUser.id,
    });

    return { success: true, post: newPost };
  });

  return (
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">Create a New Post</h2>
        </div>
      </div>

      <Form class="p-4 sm:p-6">
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
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
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
              <label
                class={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${selectedType() === 'markdown'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name="contentType"
                  value="markdown"
                  checked={selectedType() === 'markdown'}
                  onChange={() => setSelectedType('markdown')}
                  class="sr-only"
                />
                <span>Markdown</span>
              </label>

              <label
                class={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${selectedType() === 'audio'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name="contentType"
                  value="audio"
                  checked={selectedType() === 'audio'}
                  onChange={() => setSelectedType('audio')}
                  class="sr-only"
                />
                <span>Audio</span>
              </label>

              <label
                class={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${selectedType() === 'video'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name="contentType"
                  value="video"
                  checked={selectedType() === 'video'}
                  onChange={() => setSelectedType('video')}
                  class="sr-only"
                />
                <span>Video</span>
              </label>

              <label
                class={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${selectedType() === 'gif'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name="contentType"
                  value="gif"
                  checked={selectedType() === 'gif'}
                  onChange={() => setSelectedType('gif')}
                  class="sr-only"
                />
                <span>GIF</span>
              </label>
            </div>
          </div>

          <div>
            <input type="hidden" name="content" value={content()} />

            <Show when={selectedType() === 'markdown'}>
              <MarkdownEditor onChange={setContent} />
            </Show>

            <Show when={selectedType() === 'audio'}>
              <FileUploader type="audio" onFileSelect={(file) => {
                if (typeof file === 'string') {
                  setContent(file);
                }
              }} />
            </Show>

            <Show when={selectedType() === 'video'}>
              <FileUploader type="video" onFileSelect={(file) => {
                if (typeof file === 'string') {
                  setContent(file);
                }
              }} />
            </Show>

            <Show when={selectedType() === 'gif'}>
              <FileUploader type="gif" onFileSelect={(file) => {
                if (typeof file === 'string') {
                  setContent(file);
                }
              }} />
            </Show>
          </div>

          <Show when={creating.error}>
            <p class="text-sm text-red-600">{creating.error}</p>
          </Show>

          <Show when={creating.result?.success}>
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

          <div class="flex justify-end">
            <button
              type="submit"
              disabled={creating.pending}
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating.pending ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};