// src/routes/api/posts/author/[authorId].ts
import { json } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { getPostsByAuthor } from '../../../../lib/posts';

export async function GET(event: APIEvent) {
  try {
    const authorId = event.params.authorId;
    const url = new URL(event.request.url);
    const limit = url.searchParams.get('limit');
    
    const posts = await getPostsByAuthor(authorId, limit ? parseInt(limit) : undefined);
    return json(posts);
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    return json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}