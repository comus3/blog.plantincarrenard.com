// src/routes/post/[id].tsx (fixed)

import { Title } from "@solidjs/meta";
import { Show, Suspense, Switch, Match, createResource, createEffect } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { MarkdownPreview } from "~/components/MarkdownPreview";
import { getPost } from "~/lib/posts";
import type { PostWithAuthor } from "~/lib/types";

// Helper function to format dates
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function PostDetail() {
  const params = useParams();
  
  // Use createResource with proper typing - handle null case
  const [post] = createResource<PostWithAuthor | null, string>(
    () => params.id,
    async (id) => {
      try {
        const result = await getPost(id);
        console.log('getPost result:', result);
        return result;
      } catch (error) {
        console.error('Error fetching post:', error);
        return null;
      }
    }
  );

  // Debug the post resource - same debugging pattern as NavBar
  createEffect(() => {
    console.log('PostDetail - Post resource state:', {
      loading: post.loading,
      error: post.error,
      data: post(),
      state: post.state,
      postId: params.id,
      latest: post.latest
    });
  });

  return (
    <>
      <Suspense fallback={
        <div class="min-h-screen bg-gray-50">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
            {/* Back button skeleton */}
            <div class="h-4 bg-gray-200 rounded w-24 mb-6"></div>
            
            {/* Article skeleton */}
            <div class="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              {/* Title skeleton */}
              <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              
              {/* Author info skeleton */}
              <div class="flex items-center mb-6">
                <div class="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div class="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div class="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              
              {/* Content skeleton */}
              <div class="space-y-3">
                <div class="h-4 bg-gray-200 rounded w-full"></div>
                <div class="h-4 bg-gray-200 rounded w-full"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 rounded w-full"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              
              {/* Footer skeleton */}
              <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      }>
        <Show
          when={post() && !post.error && post() !== null}
          fallback={
            <div class="min-h-screen bg-gray-50 flex items-center justify-center">
              <div class="max-w-md mx-auto px-4 text-center">
                {/* Debug info */}
                <div class="text-xs text-red-500 mb-4">
                  Debug: {post.error ? `Error: ${post.error}` : post.loading ? 'Loading' : 'No post'} | 
                  Post ID: {params.id} | Post: {JSON.stringify(post())}
                </div>
                
                <div class="text-6xl mb-4">📄</div>
                <h1 class="text-2xl font-bold text-gray-900 mb-4">
                  {post.error ? 'Error loading post' : 'Post not found'}
                </h1>
                <p class="text-gray-600 mb-6">
                  {post.error 
                    ? 'There was an error loading this post. Please try again.' 
                    : "The post you're looking for doesn't exist or may have been removed."
                  }
                </p>
                <A 
                  href="/explore" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <svg class="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  Back to Explore
                </A>
              </div>
            </div>
          }
        >
          {/* Access the post data directly from post() instead of using a parameter */}
          {(() => {
            const postData = post();
            
            // Add safety check at the top of the render function
            if (!postData || !postData.author) {
              return (
                <div class="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-6xl mb-4">⏳</div>
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">Loading post data...</h2>
                    <p class="text-gray-600">Please wait while we fetch the post details.</p>
                  </div>
                </div>
              );
            }

            return (
            <>
              <Title>{postData.title} | SolidStart Blog</Title>
              
              <div class="min-h-screen bg-gray-50">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                  {/* Debug info for when post exists */}
                  <div class="text-xs text-green-500 mb-4">
                    Post loaded: {postData?.title || 'No title'} | ID: {params.id}
                  </div>
                  
                  {/* Navigation */}
                  <div class="mb-6">
                    <A 
                      href="/explore" 
                      class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg class="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                      </svg>
                      Back to Explore
                    </A>
                  </div>
                  
                  {/* Main Article */}
                  <article class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div class="p-6 sm:p-8">
                      {/* Post Header */}
                      <header class="mb-8">
                        {/* Content Type Badge */}
                        <div class="flex items-center gap-2 mb-4">
                          <span class="text-lg">
                            {postData.contentType === 'markdown' && '📝'}
                            {postData.contentType === 'audio' && '🎵'}
                            {postData.contentType === 'video' && '🎬'}
                            {postData.contentType === 'gif' && '🎭'}
                          </span>
                          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {postData.contentType}
                          </span>
                        </div>

                        {/* Title */}
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                          {postData.title}
                        </h1>
                        
                        {/* Author Info */}
                        <div class="flex items-center justify-between">
                          <Show
                            when={postData.author?.username}
                            fallback={
                              <div class="flex items-center">
                                <div class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                                  <span class="text-gray-600 font-medium text-lg">?</span>
                                </div>
                                <div>
                                  <p class="text-base font-semibold text-gray-900">Unknown Author</p>
                                  <p class="text-sm text-gray-500">@unknown</p>
                                </div>
                              </div>
                            }
                          >
                            <A 
                              href={`/profile/${postData.author.username}`} 
                              class="flex items-center group"
                            >
                              <Show
                                when={postData.author.avatarUrl}
                                fallback={
                                  <div class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                                    <span class="text-white font-medium text-lg">
                                      {postData.author.displayName?.charAt(0)?.toUpperCase() || postData.author.username?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                  </div>
                                }
                              >
                                <img 
                                  src={postData.author.avatarUrl} 
                                  alt={postData.author.displayName}
                                  class="h-12 w-12 rounded-full mr-4 object-cover border-2 border-gray-100"
                                />
                              </Show>
                              <div>
                                <p class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {postData.author.displayName}
                                </p>
                                <p class="text-sm text-gray-500">
                                  @{postData.author.username}
                                </p>
                              </div>
                            </A>
                          </Show>
                          
                          <div class="text-right">
                            <p class="text-sm text-gray-500">
                              Published {formatDate(postData.createdAt)}
                            </p>
                            <Show when={postData.updatedAt.getTime() !== postData.createdAt.getTime()}>
                              <p class="text-xs text-gray-400">
                                Updated {formatDate(postData.updatedAt)}
                              </p>
                            </Show>
                          </div>
                        </div>
                      </header>
                      
                      {/* Post Content */}
                      <div class="prose prose-lg max-w-none">
                        <Switch>
                          <Match when={postData.contentType === 'markdown'}>
                            <div class="markdown-content">
                              <MarkdownPreview markdown={postData.content} />
                            </div>
                          </Match>
                          
                          <Match when={postData.contentType === 'audio'}>
                            <div class="py-6">
                              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                <div class="flex items-center mb-4">
                                  <span class="text-2xl mr-3">🎵</span>
                                  <h3 class="text-lg font-semibold text-gray-900">Audio Content</h3>
                                </div>
                                <audio
                                  controls
                                  src={postData.content}
                                  class="w-full h-12 rounded-lg"
                                  preload="metadata"
                                  controlslist="nodownload"
                                >
                                  <p class="text-sm text-gray-600">
                                    Your browser does not support the audio element. 
                                    <a href={postData.content} class="text-blue-600 hover:underline">
                                      Download audio file
                                    </a>
                                  </p>
                                </audio>
                              </div>
                            </div>
                          </Match>
                          
                          <Match when={postData.contentType === 'video'}>
                            <div class="py-6">
                              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                                <div class="flex items-center mb-4">
                                  <span class="text-2xl mr-3">🎬</span>
                                  <h3 class="text-lg font-semibold text-gray-900">Video Content</h3>
                                </div>
                                <video
                                  controls
                                  src={postData.content}
                                  class="w-full rounded-lg shadow-sm"
                                  preload="metadata"
                                  controlslist="nodownload"
                                >
                                  <p class="text-sm text-gray-600">
                                    Your browser does not support the video element. 
                                    <a href={postData.content} class="text-blue-600 hover:underline">
                                      Download video file
                                    </a>
                                  </p>
                                </video>
                              </div>
                            </div>
                          </Match>
                          
                          <Match when={postData.contentType === 'gif'}>
                            <div class="py-6">
                              <div class="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
                                <div class="flex items-center mb-4">
                                  <span class="text-2xl mr-3">🎭</span>
                                  <h3 class="text-lg font-semibold text-gray-900">GIF Content</h3>
                                </div>
                                <div class="text-center">
                                  <img
                                    src={postData.content}
                                    alt={postData.title}
                                    class="max-w-full h-auto rounded-lg shadow-sm mx-auto"
                                    loading="lazy"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const errorDiv = document.createElement('div');
                                      errorDiv.className = 'text-center py-8 text-gray-500';
                                      errorDiv.innerHTML = `
                                        <p class="mb-2">⚠️ Unable to load GIF</p>
                                        <a href="${postData.content}" class="text-blue-600 hover:underline text-sm">
                                          View original file
                                        </a>
                                      `;
                                      target.parentNode?.appendChild(errorDiv);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Match>
                        </Switch>
                      </div>
                      
                      {/* Post Footer */}
                      <footer class="mt-12 pt-8 border-t border-gray-200">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4">
                            <span class="text-sm text-gray-500">
                              Published on {formatDate(postData.createdAt)}
                            </span>
                            <Show when={postData.updatedAt.getTime() !== postData.createdAt.getTime()}>
                              <span class="text-sm text-gray-400">
                                • Last updated {formatDate(postData.updatedAt)}
                              </span>
                            </Show>
                          </div>
                          
                          {/* Share or additional actions could go here */}
                          <div class="flex items-center space-x-2">
                            <Show when={postData.author?.username}>
                              <A 
                                href={`/profile/${postData.author.username}`}
                                class="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                More from {postData.author.displayName}
                              </A>
                            </Show>
                          </div>
                        </div>
                      </footer>
                    </div>
                  </article>

                  {/* Related or Navigation could go here */}
                  <div class="mt-8 text-center">
                    <A 
                      href="/explore"
                      class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      ← Explore More Posts
                    </A>
                  </div>
                </div>
              </div>
            </>
            );
          })()}
        </Show>
      </Suspense>
    </>
  );
}