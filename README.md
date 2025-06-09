# SolidStart API Routes Documentation

This documentation covers the API routes in your SolidStart application, which follows file-based routing conventions. These routes work in both SSR and SPA modes, providing RESTful endpoints for managing users and posts.

## Route Structure Overview

SolidStart uses file-based routing where files in the `src/routes` directory automatically become routes. API routes are placed in the `api` folder and export HTTP method functions (GET, POST, PUT, DELETE) that handle requests server-side.

## Users API Routes

### GET /api/users

**Purpose**: Retrieve all users from the database

**Usage**:
```javascript
// Client-side fetch
const response = await fetch('/api/users');
const users = await response.json();
```

**Response**:
- Success: Array of user objects with 200 status
- Error: `{ error: 'Failed to fetch users' }` with 500 status

**Expected Behavior**: Returns a complete list of all users in the system. No pagination or filtering is currently implemented.

---

### POST /api/users

**Purpose**: Create a new user

**Usage**:
```javascript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'newuser',
    email: 'user@example.com',
    // other user fields
  })
});
const user = await response.json();
```

**Response**:
- Success: Created user object with 201 status
- Username conflict: `{ error: 'Username already exists' }` with 409 status
- Other errors: `{ error: 'Failed to create user' }` with 400 status

**Expected Behavior**: Creates a new user with validation. Handles unique constraint violations for usernames gracefully.

---

### GET /api/users/[id]

**Purpose**: Retrieve a specific user by ID

**Usage**:
```javascript
const response = await fetch('/api/users/123');
const user = await response.json();
```

**Parameters**:
- `id`: User ID from the URL path

**Response**:
- Success: User object with 200 status
- Not found: `{ error: 'User not found' }` with 404 status
- Error: `{ error: 'Failed to fetch user' }` with 500 status

**Expected Behavior**: Returns detailed information for a single user. Handles non-existent users appropriately.

---

### PUT /api/users/[id]

**Purpose**: Update an existing user

**Usage**:
```javascript
const response = await fetch('/api/users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newemail@example.com',
    // fields to update
  })
});
const updatedUser = await response.json();
```

**Parameters**:
- `id`: User ID from the URL path
- Request body: JSON object with fields to update

**Response**:
- Success: Updated user object with 200 status
- Not found: `{ error: 'User not found' }` with 404 status
- Error: `{ error: 'Failed to update user' }` with 400 status

**Expected Behavior**: Updates existing user data. Uses Prisma error codes to provide specific error messages.

---

### DELETE /api/users/[id]

**Purpose**: Delete a user

**Usage**:
```javascript
const response = await fetch('/api/users/123', {
  method: 'DELETE'
});
const result = await response.json();
```

**Parameters**:
- `id`: User ID from the URL path

**Response**:
- Success: `{ success: true }` with 200 status
- Not found: `{ error: 'User not found' }` with 404 status
- Error: `{ error: 'Failed to delete user' }` with 500 status

**Expected Behavior**: Permanently removes a user from the database. Consider implementing soft deletes for production applications.

---

### GET /api/users/username/[username]

**Purpose**: Retrieve a user by their username

**Usage**:
```javascript
const response = await fetch('/api/users/username/johndoe');
const user = await response.json();
```

**Parameters**:
- `username`: Username from the URL path

**Response**:
- Success: User object with 200 status
- Not found: `{ error: 'User not found' }` with 404 status
- Error: `{ error: 'Failed to fetch user' }` with 500 status

**Expected Behavior**: Alternative way to fetch users when you have their username instead of ID. Useful for profile pages and user lookup.

## Posts API Routes

### GET /api/posts

**Purpose**: Retrieve posts with optional filtering and searching

**Usage**:
```javascript
// Get all posts
const response = await fetch('/api/posts');

// Get limited number of posts
const response = await fetch('/api/posts?limit=10');

// Search posts
const response = await fetch('/api/posts?search=javascript');

// Filter by content type
const response = await fetch('/api/posts?type=markdown');
```

**Query Parameters**:
- `limit`: Number of posts to return (optional)
- `search`: Search term to filter posts (optional)
- `type`: Content type filter (`markdown`, `audio`, `video`, `gif`)

**Response**:
- Success: Array of post objects with 200 status
- Error: `{ error: 'Failed to fetch posts' }` with 500 status

**Expected Behavior**: Flexible endpoint that handles multiple use cases. Uses dynamic imports for content type filtering to optimize bundle size.

---

### POST /api/posts

**Purpose**: Create a new post

**Usage**:
```javascript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My New Post',
    content: 'Post content here',
    authorId: '123',
    // other post fields
  })
});
const post = await response.json();
```

**Response**:
- Success: Created post object with 201 status
- Invalid author: `{ error: 'Author not found' }` with 400 status
- Other errors: `{ error: 'Failed to create post' }` with 400 status

**Expected Behavior**: Creates a new post with proper validation. Handles foreign key constraints for author relationships.

---

### GET /api/posts/author/[authorId]

**Purpose**: Retrieve all posts by a specific author

**Usage**:
```javascript
// Get all posts by author
const response = await fetch('/api/posts/author/123');

// Get limited posts by author
const response = await fetch('/api/posts/author/123?limit=5');
```

**Parameters**:
- `authorId`: Author ID from the URL path
- `limit`: Optional query parameter to limit results

**Response**:
- Success: Array of post objects with 200 status
- Error: `{ error: 'Failed to fetch posts' }` with 500 status

**Expected Behavior**: Returns posts filtered by author. Useful for author profile pages and user-specific content views.

## SolidStart Integration Notes

### SSR/SPA Compatibility
These API routes work seamlessly in both SSR and SPA modes:
- **SSR Mode**: Routes execute on the server during initial page load
- **SPA Mode**: Routes handle client-side API calls after hydration

### Error Handling
All routes implement consistent error handling:
- Try-catch blocks around database operations
- Specific error messages for common scenarios (not found, validation errors)
- Proper HTTP status codes
- Console logging for debugging

### Type Safety
Routes use TypeScript with proper typing:
- `APIEvent` type for request handling
- Proper parameter extraction from URLs
- JSON parsing with error handling

### Performance Considerations
- Dynamic imports used for optional functionality (content type filtering)
- Efficient database queries through the lib layer
- Proper error boundaries to prevent crashes

### Best Practices Followed
- RESTful URL structure and HTTP methods
- Consistent response format
- Proper status codes
- Database error code handling (Prisma-specific)
- Separation of concerns with lib functions

## Usage in Components

```javascript
import { createResource } from 'solid-js';

// In a Solid component
const [users] = createResource(async () => {
  const response = await fetch('/api/users');
  return response.json();
});

// For mutations
const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

These routes provide a solid foundation for a content management system with user authentication and post management capabilities, following SolidStart conventions and best practices.