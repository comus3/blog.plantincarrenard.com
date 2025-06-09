// src/routes/explore.tsx
import { createSignal, For, Show, Suspense, createResource } from 'solid-js'
import { useSearchParams } from '@solidjs/router'
import { getPosts, getPostsByType } from '~/lib/posts'
import type { PostType, PostWithAuthor } from '~/lib/types'

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = createSignal('')
  
  // Helper function to get single string value from search params
  const getParamString = (value: string | string[] | undefined): string | undefined => {
    if (Array.isArray(value)) return value[0]
    return value
  }
  
  // Get posts based on current filters
  const [posts] = createResource(() => {
    const type = getParamString(searchParams.type) as PostType | undefined
    const search = getParamString(searchParams.search)
    const limitParam = getParamString(searchParams.limit)
    const limit = limitParam ? parseInt(limitParam) : undefined
    
    if (type) {
      return getPostsByType(type, limit)
    }
    
    return getPosts(search, limit)
  })

  const handleSearch = (e: Event) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const search = formData.get('search') as string
    
    if (search.trim()) {
      setSearchParams({ search: search.trim(), type: undefined })
    } else {
      setSearchParams({ search: undefined, type: undefined })
    }
  }

  const filterByType = (type: PostType | 'all') => {
    if (type === 'all') {
      setSearchParams({ type: undefined, search: undefined })
    } else {
      setSearchParams({ type, search: undefined })
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getContentTypeIcon = (type: PostType) => {
    switch (type) {
      case 'markdown': return '📝'
      case 'audio': return '🎵'
      case 'video': return '🎬'
      case 'gif': return '🎭'
      default: return '📄'
    }
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Explore Posts</h1>
          <p class="text-gray-600">Discover the latest content from our community</p>
        </div>

        {/* Search and Filters */}
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Form */}
          <form onSubmit={handleSearch} class="mb-6">
            <div class="flex gap-4">
              <div class="flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="Search posts..."
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.target.value)}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Content Type Filters */}
          <div class="flex flex-wrap gap-2">
            <button
              onClick={() => filterByType('all')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !searchParams.type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => filterByType('markdown')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                getParamString(searchParams.type) === 'markdown'
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 Articles
            </button>
            <button
              onClick={() => filterByType('audio')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                getParamString(searchParams.type) === 'audio'
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎵 Audio
            </button>
            <button
              onClick={() => filterByType('video')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                getParamString(searchParams.type) === 'video'
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎬 Video
            </button>
            <button
              onClick={() => filterByType('gif')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                getParamString(searchParams.type) === 'gif'
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎭 GIFs
            </button>
          </div>

          {/* Active Filters Display */}
          <Show when={getParamString(searchParams.search) || getParamString(searchParams.type)}>
            <div class="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              <Show when={getParamString(searchParams.search)}>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Search: "{getParamString(searchParams.search)}"
                </span>
              </Show>
              <Show when={getParamString(searchParams.type)}>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Type: {getContentTypeIcon(getParamString(searchParams.type) as PostType)} {getParamString(searchParams.type)}
                </span>
              </Show>
              <button
                onClick={() => setSearchParams({})}
                class="px-2 py-1 text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
          </Show>
        </div>

        {/* Posts Grid */}
        <Suspense fallback={
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loading skeletons */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div class="space-y-2">
                  <div class="h-3 bg-gray-200 rounded"></div>
                  <div class="h-3 bg-gray-200 rounded"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div class="flex items-center mt-4">
                  <div class="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <Show 
            when={posts() && posts()!.length > 0} 
            fallback={
              <div class="text-center py-12">
                <div class="text-6xl mb-4">📭</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p class="text-gray-600">
                  {getParamString(searchParams.search) || getParamString(searchParams.type)
                    ? "Try adjusting your search or filters" 
                    : "Be the first to create a post!"
                  }
                </p>
              </div>
            }
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={posts()}>
                {(post: PostWithAuthor) => (
                  <article class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    {/* Post Header */}
                    <div class="p-6">
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-2">
                          <span class="text-lg">{getContentTypeIcon(post.contentType)}</span>
                          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {post.contentType}
                          </span>
                        </div>
                        <time class="text-xs text-gray-500" dateTime={post.createdAt.toISOString()}>
                          {formatDate(post.createdAt)}
                        </time>
                      </div>

                      {/* Post Title */}
                      <h2 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        <a 
                          href={`/post/${post.id}`}
                          class="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </a>
                      </h2>

                      {/* Post Content Preview */}
                      <div class="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.contentType === 'markdown' ? (
                          <p>{truncateContent(post.content)}</p>
                        ) : (
                          <div class="italic text-gray-500">
                            {post.contentType === 'audio' && '🎵 Audio content'}
                            {post.contentType === 'video' && '🎬 Video content'}
                            {post.contentType === 'gif' && '🎭 GIF content'}
                          </div>
                        )}
                      </div>

                      {/* Author Info */}
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {post.author.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <a 
                              href={`/profile/${post.author.username}`}
                              class="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {post.author.displayName}
                            </a>
                            <p class="text-xs text-gray-500">@{post.author.username}</p>
                          </div>
                        </div>
                        
                        <a 
                          href={`/post/${post.id}`}
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          Read more →
                        </a>
                      </div>
                    </div>
                  </article>
                )}
              </For>
            </div>
          </Show>
        </Suspense>

        {/* Load More Section */}
        <Show when={posts() && posts()!.length >= 20}>
          <div class="text-center mt-8">
            <button
              onClick={() => setSearchParams({ 
                ...searchParams, 
                limit: String((parseInt(getParamString(searchParams.limit) || '20') + 20)) 
              })}
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Load More Posts
            </button>
          </div>
        </Show>
      </div>
    </div>
  )
}