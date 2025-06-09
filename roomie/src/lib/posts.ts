// src/lib/posts.ts
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
    createdAt: prismaUser.createdAt.toISOString(),
  };
}

function transformPost(prismaPost: any): Post {
  return {
    id: prismaPost.id,
    title: prismaPost.title,
    content: prismaPost.content,
    contentType: prismaPost.contentType as PostType,
    authorId: prismaPost.authorId,
    createdAt: prismaPost.createdAt.toISOString(),
    updatedAt: prismaPost.updatedAt.toISOString(),
  };
}

function transformPostWithAuthor(prismaPost: any): PostWithAuthor {
  return {
    ...transformPost(prismaPost),
    author: transformUser(prismaPost.author),
  };
}

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
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  
  return posts.map(transformPostWithAuthor);
}