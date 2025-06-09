// src/lib/auth.ts

import { useSession } from 'vinxi/http'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { action, query, redirect } from '@solidjs/router'
import { cache } from '@solidjs/router'

// Session type definition
type SessionData = {
  userId?: string
  email?: string
  username?: string
}

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  bio: z.string().optional(),
})

// Session management
export function getSession() {
  'use server'
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET || 'fallback-secret-key-change-in-production',
  })
}

// Get current user from session
export const getCurrentUser = query(async () => {
  'use server'
  try {
    const session = await getSession()
    if (!session.data.userId) {
      return null
    }

    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/users/${session.data.userId}`)
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}, 'getCurrentUser')

// Registration action
export const register = action(async (formData: FormData) => {
  'use server'
  
  try {
    const userData = registerSchema.parse({
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      displayName: formData.get('displayName'),
      bio: formData.get('bio') || undefined,
    })

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Create user via API
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        password: hashedPassword,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const newUser = await response.json()

    // Create session
    const session = await getSession()
    await session.update({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })

    throw redirect('/')
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw error
  }
}, 'register')

// Login action
export const login = action(async (formData: FormData) => {
  'use server'
  
  try {
    const credentials = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    // Find user by email
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const usersResponse = await fetch(`${apiUrl}/api/users`)
    
    if (!usersResponse.ok) {
      throw new Error('Authentication failed')
    }
    
    const users = await usersResponse.json()
    const user = users.find((u: any) => u.email === credentials.email)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // For now, we'll need to store hashed passwords in your user data
    // You'll need to modify your user creation to include password field
    const isValidPassword = await bcrypt.compare(credentials.password, user.password || '')
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    // Create session
    const session = await getSession()
    await session.update({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    throw redirect('/')
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    throw error
  }
}, 'login')

// Logout action
export const logout = action(async () => {
  'use server'
  const session = await getSession()
  await session.clear()
  throw redirect('/login')
}, 'logout')

// Check if user is authenticated
export const requireAuth = async () => {
  'use server'
  const session = await getSession()
  if (!session.data.userId) {
    throw redirect('/login')
  }
  return session.data
}

// Protected route wrapper
export const withAuth = <T extends any[]>(
  handler: (...args: T) => Promise<any>
) => {
  return async (...args: T) => {
    'use server'
    await requireAuth()
    return handler(...args)
  }
}