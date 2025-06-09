// src/routes/api/posts/index.ts
import { json } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { createPost, getAllPosts, searchPosts } from '../../../lib/posts';

export async function GET(event: APIEvent) {
  try {
    const url = new URL(event.request.url);
    const limit = url.searchParams.get('limit');
    const search = url.searchParams.get('search');
    const contentType = url.searchParams.get('type') as any;
    
    let posts;
    
    if (search) {
      posts = await searchPosts(search, limit ? parseInt(limit) : undefined);
    } else if (contentType && ['markdown', 'audio', 'video', 'gif'].includes(contentType)) {
      const { getPostsByContentType } = await import('../../../lib/posts');
      posts = await getPostsByContentType(contentType, limit ? parseInt(limit) : undefined);
    } else {
      posts = await getAllPosts(limit ? parseInt(limit) : undefined);
    }
    
    return json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json();
    const post = await createPost(body);
    return json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    
    if (error.code === 'P2003') {
      return json({ error: 'Author not found' }, { status: 400 });
    }
    
    return json({ 
      error: error.message || 'Failed to create post' 
    }, { status: 400 });
  }
}