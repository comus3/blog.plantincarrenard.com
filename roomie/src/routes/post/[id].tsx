import { Title, useParams, useRouteData } from "solid-start";
import { A } from "solid-start";
import { Show, Suspense, createResource, createSignal, Switch, Match } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { MarkdownPreview } from "~/components/MarkdownPreview";
import { formatDate } from "~/lib/utils";
import { getAllPosts } from "~/lib/mockData";
import { PostWithAuthor } from "~/lib/types";

export function routeData() {
  const params = useParams();
  
  return createServerData$(
    async (postId) => {
      const allPosts = await getAllPosts();
      return allPosts.find(post => post.id === postId) || null;
    },
    { key: () => params.id }
  );
}

export default function PostDetail() {
  const params = useParams();
  const post = useRouteData<typeof routeData>();
  
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
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
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
                    class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
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
                        <img 
                          src={postData().author.avatarUrl} 
                          alt={postData().author.displayName}
                          class="h-8 w-8 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <p class="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
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
                            <audio
                              controls
                              src={postData().content}
                              class="w-full rounded-md"
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        </Match>
                        
                        <Match when={postData().contentType === 'video'}>
                          <div class="py-4">
                            <video
                              controls
                              src={postData().content}
                              class="w-full rounded-md"
                            >
                              Your browser does not support the video element.
                            </video>
                          </div>
                        </Match>
                        
                        <Match when={postData().contentType === 'gif'}>
                          <div class="py-4">
                            <img
                              src={postData().content}
                              alt={postData().title}
                              class="w-full rounded-md"
                            />
                          </div>
                        </Match>
                      </Switch>
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