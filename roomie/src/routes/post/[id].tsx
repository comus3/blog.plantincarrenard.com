// src/routes/post/[id].tsx

import { Title } from "@solidjs/meta";
import { Show, Suspense, Switch, Match } from "solid-js";
import { A, useParams, cache, createAsync } from "@solidjs/router";
import { MarkdownPreview } from "~/components/MarkdownPreview";
import { formatDate } from "~/lib/utils";
import type { PostWithAuthor } from "~/lib/types";

// Cache function for server-side data fetching
const getPostById = cache(async (id: string): Promise<PostWithAuthor | null> => {
  "use server";
  try {
    const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/posts/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}, "post-by-id");

export default function PostDetail() {
  const params = useParams();
  const post = createAsync(() => getPostById(params.id));

  return (
    <>
      <Suspense fallback={
        <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      }>
        <Show
          when={post()}
          fallback={
            <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
              <h1 class="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
              <p class="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
              <A 
                href="/" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Home
              </A>
            </div>
          }
        >
          {(postData) => (
            <>
              <Title>{postData().title} | SolidStart Blog</Title>
              
              <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div class="mb-6">
                  <A 
                    href="/" 
                    class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <svg class="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    Back to Posts
                  </A>
                </div>
                
                <article class="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div class="p-5 sm:p-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-3">{postData().title}</h1>
                    
                    <div class="flex items-center mb-6">
                      <A href={`/explore/${postData().author.username}`} class="flex items-center group">
                        <Show
                          when={postData().author.avatarUrl}
                          fallback={
                            <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                              <span class="text-gray-600 font-medium text-sm">
                                {postData().author.displayName[0]?.toUpperCase()}
                              </span>
                            </div>
                          }
                        >
                          <img 
                            src={postData().author.avatarUrl} 
                            alt={postData().author.displayName}
                            class="h-8 w-8 rounded-full mr-3 object-cover"
                          />
                        </Show>
                        <div>
                          <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {postData().author.displayName}
                          </p>
                          <p class="text-xs text-gray-500">
                            {formatDate(postData().createdAt)}
                          </p>
                        </div>
                      </A>
                    </div>
                    
                    <div class="prose prose-lg max-w-none">
                      <Switch>
                        <Match when={postData().contentType === 'markdown'}>
                          <MarkdownPreview markdown={postData().content} />
                        </Match>
                        
                        <Match when={postData().contentType === 'audio'}>
                          <div class="py-4">
                            <div class="bg-gray-50 rounded-lg p-4">
                              <p class="text-sm text-gray-600 mb-2">Audio Content:</p>
                              <audio
                                controls
                                src={postData().content}
                                class="w-full"
                                preload="metadata"
                              >
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          </div>
                        </Match>
                        
                        <Match when={postData().contentType === 'video'}>
                          <div class="py-4">
                            <div class="bg-gray-50 rounded-lg p-4">
                              <p class="text-sm text-gray-600 mb-2">Video Content:</p>
                              <video
                                controls
                                src={postData().content}
                                class="w-full rounded-md"
                                preload="metadata"
                              >
                                Your browser does not support the video element.
                              </video>
                            </div>
                          </div>
                        </Match>
                        
                        <Match when={postData().contentType === 'gif'}>
                          <div class="py-4">
                            <div class="bg-gray-50 rounded-lg p-4">
                              <p class="text-sm text-gray-600 mb-2">GIF Content:</p>
                              <img
                                src={postData().content}
                                alt={postData().title}
                                class="max-w-full h-auto rounded-md mx-auto"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </Match>
                      </Switch>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-gray-200">
                      <div class="flex items-center justify-between text-sm text-gray-500">
                        <span>Published {formatDate(postData().createdAt)}</span>
                        <Show when={postData().updatedAt !== postData().createdAt}>
                          <span>Updated {formatDate(postData().updatedAt)}</span>
                        </Show>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </>
  );
}