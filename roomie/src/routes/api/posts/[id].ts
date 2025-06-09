// src/routes/api/posts/[id].ts
import { json } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { getPostById, updatePost, deletePost } from '../../../lib/posts';

export async function GET(event: APIEvent) {
  try {
    const id = event.params.id;
    const post = await getPostById(id);
    
    if (!post) {
      return json({ error: 'Post not found' }, { status: 404 });
    }
    
    return json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(event: APIEvent) {
  try {
    const id = event.params.id;
    const body = await event.request.json();
    
    const post = await updatePost(id, body);
    return json(post);
  } catch (error: any) {
    console.error('Error updating post:', error);
    
    if (error.code === 'P2025') {
      return json({ error: 'Post not found' }, { status: 404 });
    }
    
    return json({ 
      error: error.message || 'Failed to update post' 
    }, { status: 400 });
  }
}

export async function DELETE(event: APIEvent) {
  try {
    const id = event.params.id;
    await deletePost(id);
    return json({ success: true });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    
    if (error.code === 'P2025') {
      return json({ error: 'Post not found' }, { status: 404 });
    }
    
    return json({ error: 'Failed to delete post' }, { status: 500 });
  }
}