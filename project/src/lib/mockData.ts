import { User, Post } from './types';

// Mock users data
export const users: User[] = [
  {
    id: '1',
    username: 'demo_user',
    displayName: 'Demo User',
    bio: 'This is a demo user for testing purposes.',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    bio: 'Writer, photographer, and tech enthusiast.',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: '2023-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    username: 'john_doe',
    displayName: 'John Doe',
    bio: 'Software developer who loves to share knowledge.',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: '2023-01-03T00:00:00.000Z',
  },
];

// Mock posts data
export const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with SolidJS',
    content: `# Getting Started with SolidJS

SolidJS is a declarative JavaScript library for creating user interfaces. It does not use a Virtual DOM. Instead it compiles its templates down to real DOM nodes and updates them with fine-grained reactions.

## Why Solid?

- **Performant**: Solid is really fast, consistently one of the fastest frameworks.
- **Simple**: The reactive system is straightforward and intuitive.
- **Powerful**: Solid's reactivity is fine-grained, making it incredibly efficient.

## Code Example

\`\`\`jsx
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);
  
  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

Thanks for reading!`,
    contentType: 'markdown',
    authorId: '1',
    createdAt: '2023-01-15T12:00:00.000Z',
    updatedAt: '2023-01-15T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Introduction to Web Development',
    content: `# Introduction to Web Development

Web development is the work involved in developing a website for the Internet or an intranet.

## Front-end Development

Front-end development involves creating the user interface and user experience of a website.

## Back-end Development

Back-end development involves server-side logic and database interactions.

## Full-stack Development

Full-stack development encompasses both front-end and back-end development.`,
    contentType: 'markdown',
    authorId: '2',
    createdAt: '2023-02-10T15:30:00.000Z',
    updatedAt: '2023-02-10T15:30:00.000Z',
  },
  {
    id: '3',
    title: 'Beautiful Sunset',
    content: 'https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&w=800',
    contentType: 'gif',
    authorId: '3',
    createdAt: '2023-03-05T18:45:00.000Z',
    updatedAt: '2023-03-05T18:45:00.000Z',
  },
  {
    id: '4',
    title: 'Relaxing Nature Sounds',
    content: 'https://samplelib.com/lib/preview/mp3/sample-15s.mp3',
    contentType: 'audio',
    authorId: '2',
    createdAt: '2023-04-20T09:15:00.000Z',
    updatedAt: '2023-04-20T09:15:00.000Z',
  },
  {
    id: '5',
    title: 'Mountain Time-lapse',
    content: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    contentType: 'video',
    authorId: '1',
    createdAt: '2023-05-12T14:20:00.000Z',
    updatedAt: '2023-05-12T14:20:00.000Z',
  }
];

// Current user (hardcoded for now)
export const currentUser = users[0];

// Mock database functions
export const getUsers = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return users;
};

export const getUserByUsername = async (username: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return users.find(user => user.username === username) || null;
};

export const getAllPosts = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return posts.map(post => ({
    ...post,
    author: users.find(user => user.id === post.authorId)!
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getPostsByUser = async (userId: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return posts
    .filter(post => post.authorId === userId)
    .map(post => ({
      ...post,
      author: users.find(user => user.id === post.authorId)!
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const searchPosts = async (query: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const lowercaseQuery = query.toLowerCase();
  return posts
    .filter(post => {
      const author = users.find(user => user.id === post.authorId)!;
      return post.title.toLowerCase().includes(lowercaseQuery) || 
             author.displayName.toLowerCase().includes(lowercaseQuery) ||
             author.username.toLowerCase().includes(lowercaseQuery);
    })
    .map(post => ({
      ...post,
      author: users.find(user => user.id === post.authorId)!
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  const newPost: Post = {
    ...post,
    id: String(posts.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  posts.unshift(newPost);
  
  return {
    ...newPost,
    author: users.find(user => user.id === newPost.authorId)!
  };
};