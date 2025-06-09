// src/lib/posts.ts
import { action, cache, revalidate } from "@solidjs/router";
import { db } from './db';
import { z } from 'zod';
import type { Post, PostWithAuthor, PostType, User } from './types';


// Validation schemas
export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  contentType: z.enum(['markdown', 'audio', 'video', 'gif']),
  authorId: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  contentType: z.enum(['markdown', 'audio', 'video', 'gif']).optional(),
});

// Transform functions
function transformUser(prismaUser: any): User {
  return {
    id: prismaUser.id,
    username: prismaUser.username,
    displayName: prismaUser.displayName,
    bio: prismaUser.bio,
    avatarUrl: prismaUser.avatarUrl,
    createdAt: prismaUser.createdAt,
    email: prismaUser.email , 
    password: prismaUser.password, 
  };
}

function transformPost(prismaPost: any): Post {
  return {
    id: prismaPost.id,
    title: prismaPost.title,
    content: prismaPost.content,
    contentType: prismaPost.contentType as PostType,
    authorId: prismaPost.authorId,
    createdAt: new Date(prismaPost.createdAt),
    updatedAt: new Date(prismaPost.updatedAt),
  };
}

function transformPostWithAuthor(prismaPost: any): PostWithAuthor {
  return {
    ...transformPost(prismaPost),
    author: transformUser(prismaPost.author),
  };
}

// Database functions (keeping your existing ones)
export async function createPost(data: z.infer<typeof createPostSchema>): Promise<Post> {
  const validatedData = createPostSchema.parse(data);
  
  const post = await db.post.create({
    data: validatedData,
  });
  
  return transformPost(post);
}

export async function getPostById(id: string): Promise<PostWithAuthor | null> {
  const post = await db.post.findUnique({
    where: { id },
    include: { author: true },
  });
  
  return post ? transformPostWithAuthor(post) : null;
}

export async function getAllPosts(limit?: number): Promise<PostWithAuthor[]> {
  const posts = await db.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  
  return posts.map(transformPostWithAuthor);
}

export async function getPostsByAuthor(authorId: string, limit?: number): Promise<PostWithAuthor[]> {
  const posts = await db.post.findMany({
    where: { authorId },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  
  return posts.map(transformPostWithAuthor);
}

export async function getPostsByContentType(contentType: PostType, limit?: number): Promise<PostWithAuthor[]> {
  const posts = await db.post.findMany({
    where: { contentType },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  
  return posts.map(transformPostWithAuthor);
}

export async function updatePost(id: string, data: z.infer<typeof updatePostSchema>): Promise<Post> {
  const validatedData = updatePostSchema.parse(data);
  
  const post = await db.post.update({
    where: { id },
    data: validatedData,
  });
  
  return transformPost(post);
}

export async function deletePost(id: string): Promise<void> {
  await db.post.delete({
    where: { id },
  });
}

export async function searchPosts(query: string, limit?: number): Promise<PostWithAuthor[]> {
  const posts = await db.post.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
      ],
    },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  
  return posts.map(transformPostWithAuthor);
}

// SolidJS Router cache functions
export const getPosts = cache(async (search?: string, limit?: number): Promise<PostWithAuthor[]> => {
  "use server";
  try {
    if (search) {
      return await searchPosts(search, limit);
    }
    return await getAllPosts(limit);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}, "posts");

export const getUserPosts = cache(async (authorId: string, limit?: number): Promise<PostWithAuthor[]> => {
  "use server";
  try {
    return await getPostsByAuthor(authorId, limit);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}, "user-posts");

export const getPost = cache(async (id: string): Promise<PostWithAuthor | null> => {
  "use server";
  try {
    return await getPostById(id);
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}, "post");

export const getPostsByType = cache(async (contentType: PostType, limit?: number): Promise<PostWithAuthor[]> => {
  "use server";
  try {
    return await getPostsByContentType(contentType, limit);
  } catch (error) {
    console.error('Error fetching posts by type:', error);
    return [];
  }
}, "posts-by-type");

// SolidJS Router actions
export const createPostAction = action(async (formData: FormData) => {
  "use server";
  
  const title = formData.get("title")?.toString() || "";
  const contentType = formData.get("contentType")?.toString() as PostType;
  const content = formData.get("content")?.toString() || "";
  const authorId = formData.get("authorId")?.toString() || "";

  try {
    // Validate the input using your existing schema
    const validatedData = createPostSchema.parse({ 
      title, 
      contentType, 
      content, 
      authorId 
    });

    // Create the post using your existing function
    const newPost = await createPost(validatedData);
    
    // Invalidate relevant caches
    revalidate("posts");
    revalidate("user-posts");
    revalidate("posts-by-type");
    
    return { success: true, post: newPost };
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    
    return { error: 'Failed to create post. Please try again.' };
  }
});

export const updatePostAction = action(async (formData: FormData) => {
  "use server";
  
  const id = formData.get("id")?.toString() || "";
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const contentType = formData.get("contentType")?.toString() as PostType;

  if (!id) {
    return { error: "Post ID is required" };
  }

  try {
    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (contentType) updateData.contentType = contentType;

    // Update the post using your existing function
    const updatedPost = await updatePost(id, updateData);
    
    // Invalidate relevant caches
    revalidate("posts");
    revalidate("user-posts");
    revalidate("post");
    revalidate("posts-by-type");
    
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    
    return { error: 'Failed to update post. Please try again.' };
  }
});

export const deletePostAction = action(async (id: string) => {
  "use server";
  
  try {
    // Get the post first to know which caches to revalidate
    const post = await getPostById(id);
    
    if (!post) {
      return { error: 'Post not found' };
    }

    // Delete the post using your existing function
    await deletePost(id);
    
    // Invalidate relevant caches
    revalidate("posts");
    revalidate("user-posts");
    revalidate("post");
    revalidate("posts-by-type");
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: 'Failed to delete post. Please try again.' };
  }
});
