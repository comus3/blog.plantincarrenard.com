// src/lib/types.ts

export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  email: string;
  password: string; 
};

export type PostType = 'markdown' | 'audio' | 'video' | 'gif';

export type Post = {
  id: string;
  title: string;
  content: string;
  contentType: PostType;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface PostWithAuthor {
  id: string;
  title: string;
  content: string;
  contentType: 'markdown' | 'audio' | 'video' | 'gif';
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    createdAt: Date;
    email: string;
    password: string;
  };
}