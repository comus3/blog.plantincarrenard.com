// src/routes/api/users/index.ts
import { json } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { createUser, getAllUsers } from '../../../lib/users';

export async function GET() {
  try {
    const users = await getAllUsers();
    return json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(event: APIEvent) {
  try {
    const body = await event.request.json();
    const user = await createUser(body);
    return json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
      return json({ error: 'Username already exists' }, { status: 409 });
    }
    
    return json({ 
      error: error.message || 'Failed to create user' 
    }, { status: 400 });
  }
}
