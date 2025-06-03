import { Title, useSearchParams, useRouteData } from "solid-start";
import { createResource, For, Show, Suspense } from "solid-js";
import { PostCard } from "~/components/PostCard";
import { getAllPosts, searchPosts } from "~/lib/mockData";
import { PostWithAuthor } from "~/lib/types";
import { createServerData$ } from "solid-start/server";

export function routeData() {
  const [searchParams] = useSearchParams();
  
  return createServerData$(
    async (query) => {
      if (query) {
        return searchPosts(query);
      }
      return getAllPosts();
    },
    { key: () => searchParams.search }
  );
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const posts = useRouteData<typeof routeData>();

  return (
    <>
      <Title>SolidStart Blog Platform</Title>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="pt-6 pb-8">
          <Show
            when={searchParams.search}
            fallback={<h1 class="text-3xl font-bold text-gray-900">Recent Posts</h1>}
          >
            <h1 class="text-3xl font-bold text-gray-900">
              Search Results for "{searchParams.search}"
            </h1>
          </Show>
        </div>
        
        <Suspense fallback={
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map(() => (
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
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-12">
            <Show
              when={posts()?.length > 0}
              fallback={
                <div class="col-span-full text-center py-12">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    No posts found
                  </h3>
                  <p class="text-gray-500">
                    {searchParams.search 
                      ? `No results for "${searchParams.search}". Try a different search term.` 
                      : "There are no posts yet. Be the first to create one!"}
                  </p>
                </div>
              }
            >
              <For each={posts()}>
                {(post: PostWithAuthor) => (
                  <PostCard post={post} preview={true} />
                )}
              </For>
            </Show>
          </div>
        </Suspense>
      </div>
    </>
  );
}