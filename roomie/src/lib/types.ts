export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  email?: string;
};

export type PostType = 'markdown' | 'audio' | 'video' | 'gif';

export type Post = {
  id: string;
  title: string;
  content: string;
  contentType: PostType;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type PostWithAuthor = Post & {
  author: User;
};