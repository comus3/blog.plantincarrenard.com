// src/routes/api/users/username/[username].ts
import { json } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { getUserByUsername } from '../../../../lib/users';

export async function GET(event: APIEvent) {
  try {
    const username = event.params.username;
    const user = await getUserByUsername(username);
    
    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json(user);
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}