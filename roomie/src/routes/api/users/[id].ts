// src/routes/api/users/[id].ts
import { json } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { getUserById, updateUser, deleteUser } from '../../../lib/users';

export async function GET(event: APIEvent) {
  try {
    const id = event.params.id;
    const user = await getUserById(id);
    
    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(event: APIEvent) {
  try {
    const id = event.params.id;
    const body = await event.request.json();
    
    const user = await updateUser(id, body);
    return json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json({ 
      error: error.message || 'Failed to update user' 
    }, { status: 400 });
  }
}

export async function DELETE(event: APIEvent) {
  try {
    const id = event.params.id;
    await deleteUser(id);
    return json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'P2025') {
      return json({ error: 'User not found' }, { status: 404 });
    }
    
    return json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
