// src/components/PostCard.tsx

import { A } from "@solidjs/router";
import { Show, Switch, Match } from "solid-js";
import { PostWithAuthor } from "~/lib/types";
import { MarkdownPreview } from "./MarkdownPreview";

type PostCardProps = {
  post: PostWithAuthor;
  showAuthor?: boolean;
  preview?: boolean;
};

export function PostCard(props: PostCardProps) {
  const { post } = props;
  
  // SSR-friendly date formatting - ensures consistent output between server and client
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      console.warn('Date formatting error:', error);
      return 'Invalid date';
    }
  };
  
  // Pre-process markdown content for preview - improves SPA performance by avoiding heavy parsing
  const getMarkdownPreview = (content: string) => {
    const stripped = content
      .replace(/#+\s+(.*)/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`(.*?)`/g, '$1')
      .trim();
    
    return stripped.length > 150 ? stripped.slice(0, 150) + '...' : stripped;
  };

  return (
    <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div class="p-5">
        <div class="flex justify-between items-start mb-3">
          <h2 class="text-xl font-semibold text-gray-900 line-clamp-2">{post.title}</h2>
          
          <div class="flex items-center text-xs text-gray-500">
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        <Show when={props.showAuthor !== false}>
          <div class="flex items-center mb-4">
            <A href={`/explore/${post.author.username}`} class="flex items-center group">
              <Show 
                when={post.author.avatarUrl} 
                fallback={
                  <div class="h-6 w-6 rounded-full mr-2 bg-gray-300 flex items-center justify-center">
                    <span class="text-xs text-gray-600 font-medium">
                      {post.author.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                }
              >
                <img 
                  src={post.author.avatarUrl} 
                  alt={post.author.displayName}
                  class="h-6 w-6 rounded-full mr-2 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </Show>
              <span class="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
                {post.author.displayName}
              </span>
            </A>
          </div>
        </Show>

        <div class="mb-4">
          <Switch>
            <Match when={post.contentType === 'markdown'}>
              <div class="prose prose-sm max-h-40 overflow-hidden">
                {/* SPA mode: Full markdown rendering for rich content */}
                {/* SSR mode: Text preview for faster initial load */}
                <Show when={props.preview} fallback={<MarkdownPreview markdown={post.content} />}>
                  <p class="text-gray-600 line-clamp-3">{getMarkdownPreview(post.content)}</p>
                </Show>
              </div>
            </Match>
            
            <Match when={post.contentType === 'audio'}>
              <audio
                controls
                src={post.content}
                class="w-full rounded-md"
                preload="metadata"
              >
                Your browser does not support the audio element.
              </audio>
            </Match>
            
            <Match when={post.contentType === 'video'}>
              <video
                controls
                src={post.content}
                class="w-full h-48 rounded-md object-cover"
                preload="metadata"
              >
                Your browser does not support the video element.
              </video>
            </Match>
            
            <Match when={post.contentType === 'gif'}>
              <div class="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                <img
                  src={post.content}
                  alt={post.title}
                  class="w-full h-48 object-cover rounded-md"
                  loading="lazy"
                />
              </div>
            </Match>
          </Switch>
        </div>
        
        {/* SPA navigation: Client-side routing for seamless transitions */}
        <A 
          href={`/post/${post.id}`} 
          class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Read more
          <svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </A>
      </div>
    </article>
  );
}