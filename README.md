# SolidJS Blog API Documentation

This document outlines all API routes, their inputs, outputs, and usage patterns for the SolidJS blog application.

## Base URL
- Development: `http://localhost:3000`
- Production: Use `process.env.API_URL` environment variable

## User Routes

### GET /api/users
**Description:** Get all users
**Parameters:** None
**Response:**
```typescript
User[]

// User type:
{
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
}
```

### POST /api/users
**Description:** Create a new user
**Body:**
```typescript
{
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}
```
**Response:** `User` (201) or error (400/409)
**Error Codes:**
- 409: Username already exists
- 400: Validation error

### GET /api/users/[id]
**Description:** Get user by ID
**Parameters:** 
- `id`: string (URL parameter)
**Response:** `User` (200) or error (404/500)

### PUT /api/users/[id]
**Description:** Update user by ID
**Parameters:**
- `id`: string (URL parameter)
**Body:** Partial `User` object
**Response:** `User` (200) or error (400/404)

### DELETE /api/users/[id]
**Description:** Delete user by ID
**Parameters:**
- `id`: string (URL parameter)
**Response:** `{ success: true }` (200) or error (404/500)

### GET /api/users/username/[username]
**Description:** Get user by username
**Parameters:**
- `username`: string (URL parameter)
**Response:** `User` (200) or error (404/500)

## Post Routes

### GET /api/posts
**Description:** Get all posts with optional filtering
**Query Parameters:**
- `limit?: number` - Limit number of results
- `search?: string` - Search posts by content
- `type?: 'markdown' | 'audio' | 'video' | 'gif'` - Filter by content type
**Response:**
```typescript
PostWithAuthor[]

// PostWithAuthor type:
{
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
    avatarUrl?: string;
  };
}
```

### POST /api/posts
**Description:** Create a new post
**Body:**
```typescript
{
  title: string;
  content: string;
  contentType: 'markdown' | 'audio' | 'video' | 'gif';
  authorId: string;
}
```
**Response:** `PostWithAuthor` (201) or error (400)
**Error Codes:**
- 400: Author not found or validation error

### GET /api/posts/[id]
**Description:** Get post by ID
**Parameters:**
- `id`: string (URL parameter)
**Response:** `PostWithAuthor` (200) or error (404/500)

### PUT /api/posts/[id]
**Description:** Update post by ID
**Parameters:**
- `id`: string (URL parameter)
**Body:** Partial post object (excluding `id`, `authorId`, `createdAt`)
**Response:** `PostWithAuthor` (200) or error (400/404)

### DELETE /api/posts/[id]
**Description:** Delete post by ID
**Parameters:**
- `id`: string (URL parameter)
**Response:** `{ success: true }` (200) or error (404/500)

### GET /api/posts/author/[authorId]
**Description:** Get posts by author ID
**Parameters:**
- `authorId`: string (URL parameter)
**Query Parameters:**
- `limit?: number` - Limit number of results
**Response:** `PostWithAuthor[]` (200) or error (500)

## Important Notes

### Error Response Format
All error responses follow this format:
```typescript
{
  error: string; // Human-readable error message
}
```

### Date Handling
- All dates are returned as ISO strings from the API
- Convert to Date objects in your frontend code: `new Date(dateString)`

### Content Types
The `contentType` field supports these values:
- `'markdown'` - Regular text/markdown posts
- `'audio'` - Audio content posts
- `'video'` - Video content posts  
- `'gif'` - GIF/image posts

### Common HTTP Status Codes
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `404` - Resource not found
- `409` - Conflict (duplicate resource)
- `500` - Internal server error

### Usage Patterns in Components

#### Fetching User by Username
```typescript
const getUser = cache(async (username: string): Promise<User | null> => {
  "use server";
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const response = await fetch(`${apiUrl}/api/users/username/${username}`);
  if (!response.ok) return null;
  return await response.json();
}, "user");
```

#### Fetching Posts by Author
```typescript
const getUserPosts = cache(async (authorId: string): Promise<PostWithAuthor[]> => {
  "use server";
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const response = await fetch(`${apiUrl}/api/posts/author/${authorId}`);
  if (!response.ok) return [];
  return await response.json();
}, "user-posts");
```

#### Fetching All Posts with Search
```typescript
const getPosts = cache(async (search?: string): Promise<PostWithAuthor[]> => {
  "use server";
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const url = search 
    ? `${apiUrl}/api/posts?search=${encodeURIComponent(search)}`
    : `${apiUrl}/api/posts`;
  const response = await fetch(url);
  if (!response.ok) return [];
  return await response.json();
}, "posts");
```

## Key Route Corrections for Profile Component

Based on your actual API routes, the profile component should use:
- **User by username:** `/api/users/username/${username}` 
- **Posts by author:** `/api/posts/author/${authorId}` (requires user ID, not username)

Note: To get posts by username, you'll need to:
1. First fetch the user by username to get their ID
2. Then fetch posts using the author ID