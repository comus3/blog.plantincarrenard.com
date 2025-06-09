// src/routes/register.tsx

import { createSignal, Show } from 'solid-js'
import { registerAction, getCurrentUser } from '../lib/auth'
import { A, useSubmissions, useNavigate } from '@solidjs/router'
import { createAsyncStore, type RouteDefinition } from '@solidjs/router'

export const route = {
  preload() {
    getCurrentUser();
  },
} satisfies RouteDefinition;

export default function Register() {
  const [error, setError] = createSignal<string>('')
  const [confirmPasswordError, setConfirmPasswordError] = createSignal<string>('')
  const navigate = useNavigate()
  
  // Use createAsyncStore like your teacher's pattern
  const user = createAsyncStore(() => getCurrentUser(), {
    initialValue: null,
  })
  
  // Use useSubmissions to track form submission state
  const registerSubmissions = useSubmissions(registerAction)

  // Redirect if already logged in
  if (user()) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = (e: Event) => {
    setError('')
    setConfirmPasswordError('')
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    // Client-side password confirmation check
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    if (password !== confirmPassword) {
      e.preventDefault() // Only prevent if validation fails
      setConfirmPasswordError('Passwords do not match')
      return
    }
    
    // If validation passes, let the form submit naturally
    // The action and method attributes will handle the submission
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        <form 
          class="mt-8 space-y-6" 
          action={registerAction}
          method="post"
          onSubmit={handleSubmit}
        >
          <Show when={error() || confirmPasswordError()}>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error() || confirmPasswordError()}
            </div>
          </Show>

          {/* Show server-side errors from submissions */}
          <Show when={registerSubmissions.some(sub => sub.error)}>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {registerSubmissions.find(sub => sub.error)?.error?.message || 'Registration failed'}
            </div>
          </Show>

          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">
                Bio (optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tell us about yourself"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password (min. 8 characters)"
              />
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={registerSubmissions.some(sub => sub.pending)}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerSubmissions.some(sub => sub.pending) ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div class="text-center">
            <A 
              href="/login" 
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </A>
          </div>
        </form>
      </div>
    </div>
  )
}