import { A, useLocation, useNavigate } from "solid-start";
import { createSignal, Show } from "solid-js";
import { createServerAction$ } from "solid-start/server";
import { currentUser } from "~/lib/mockData";
import { searchPosts } from "~/lib/mockData";
import { z } from "zod";

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = createSignal("");
  const [isSearchFocused, setIsSearchFocused] = createSignal(false);

  const searchSchema = z.object({
    query: z.string().min(1, "Search query cannot be empty")
  });

  const [searching, search] = createServerAction$(async (form: FormData) => {
    const query = form.get("query")?.toString() || "";
    const result = searchSchema.safeParse({ query });
    
    if (!result.success) {
      return { error: result.error.errors[0].message };
    }
    
    // Server-side search handled by redirecting to the search results page
    return { success: true, query };
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (searchQuery().trim() !== "") {
      navigate(`/?search=${encodeURIComponent(searchQuery())}`);
    }
  };

  return (
    <header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <A href="/" class="text-xl font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              SolidBlog
            </A>
          </div>
          
          <div class={`relative mx-auto max-w-md w-full ${isSearchFocused() ? 'flex-grow' : ''}`}>
            <form 
              action="/"
              method="get"
              onSubmit={handleSubmit}
              class="relative"
            >
              <input
                type="text"
                name="query"
                placeholder="Search posts or authors..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                class="w-full py-2 pl-10 pr-4 text-sm text-gray-900 bg-gray-100 rounded-full border border-transparent focus:bg-white focus:border-primary-300 focus:ring-1 focus:ring-primary-300 transition-all duration-200"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <Show when={searching.error}>
                <p class="text-red-500 text-xs mt-1">{searching.error}</p>
              </Show>
            </form>
          </div>
          
          <div class="flex items-center">
            <A 
              href={`/profile/${currentUser.username}`}
              class={`flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors ${
                location.pathname.startsWith('/profile') ? 'bg-gray-100' : ''
              }`}
            >
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.displayName}
                class="h-8 w-8 rounded-full object-cover"
              />
              <span class="ml-2 text-sm font-medium hidden sm:block">
                {currentUser.displayName}
              </span>
            </A>
          </div>
        </div>
      </div>
    </header>
  );
}