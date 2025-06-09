import { createSignal, Show } from 'solid-js'
import { login, getCurrentUser } from '../lib/auth'
import { A, useAction, useSubmission } from '@solidjs/router'
import { createAsync } from '@solidjs/router'

export default function Login() {
  const [error, setError] = createSignal<string>('')
  const loginAction = useAction(login)
  const loginSubmission = useSubmission(login)
  const user = createAsync(() => getCurrentUser())

  // Redirect if already logged in
  if (user()) {
    window.location.href = '/'
    return null
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setError('')
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    try {
      await loginAction(formData)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form 
          class="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          <Show when={error()}>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error()}
            </div>
          </Show>

          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginSubmission.pending}
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginSubmission.pending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div class="text-center">
            <A 
              href="/register" 
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Sign up
            </A>
          </div>
        </form>
      </div>
    </div>
  )
}