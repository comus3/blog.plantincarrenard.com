// src/lib/auth.ts

import { useSession } from 'vinxi/http'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { action, cache, redirect } from '@solidjs/router'
import { createUser, getAllUsers, getUserById } from './users'

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
export const getCurrentUser = cache(async () => {
  'use server'
  try {
    const session = await getSession()
    if (!session.data.userId) {
      return null
    }

    const user = await getUserById(session.data.userId)
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}, 'getCurrentUser')

// Registration action 
export const registerAction = action(async (formData: FormData) => {
  'use server'
  
  try {
    console.log('Starting registration process...')
    
    const userData = registerSchema.parse({
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      displayName: formData.get('displayName'),
      bio: formData.get('bio') || undefined,
    })

    console.log('User data validated:', { ...userData, password: '[REDACTED]' })

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Create user directly using the function
    const newUser = await createUser({
      ...userData,
      password: hashedPassword,
    })

    console.log('User created successfully:', newUser.id)

    // Create session
    const session = await getSession()
    await session.update({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })

    console.log('Session created, redirecting...')
    throw redirect('/')
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message)
    }
    
    // Handle database constraint errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as any // Type assertion for Prisma errors
      if (dbError.code === 'P2002' && dbError.meta?.target?.includes('username')) {
        throw new Error('Username already exists')
      }
      if (dbError.code === 'P2002' && dbError.meta?.target?.includes('email')) {
        throw new Error('Email already exists')
      }
    }
    
    throw error
  }
})

// Login action - following your teacher's action pattern
export const loginAction = action(async (formData: FormData) => {
  'use server'
  
  try {
    const credentials = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    // Get all users and find by email
    const users = await getAllUsers()
    console.log('Fetched users:', users.length, 'users found')
    console.log('all users:', users.map(u => ({ email: u.email, hasPassword: !!u.password })))
    const user = users.find((u: any) => u.email === credentials.email)
    
    console.log('User found:', !!user)
    
    if (!user) {
      console.log('User not found for email:', credentials.email)
      return { error: 'Invalid email or password' }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password || '')
    console.log('User found:', { email: user.email, hasPassword: !!user.password })
    
    if (!isValidPassword) {
      console.log('Password validation failed')
      return { error: 'Invalid email or password' }
    }

    // Create session
    const session = await getSession()
    await session.update({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    throw redirect('/') // This is correct for successful login
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    // Re-throw redirect errors
    if (error instanceof Response) {
      throw error
    }
    return { error: 'Login failed' }
  }
})

// Logout action
export const logoutAction = action(async () => {
  'use server'
  const session = await getSession()
  await session.clear()
  throw redirect('/login')
})

// Check if user is authenticated
export const requireAuth = async () => {
  'use server'
  const session = await getSession()
  if (!session.data.userId) {
    throw redirect('/login')
  }
  return session.data
}