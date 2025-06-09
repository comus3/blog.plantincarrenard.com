// src/components/NavBar.tsx (fixed)
import { Component, Show, Suspense, createResource, createEffect } from 'solid-js'
import { A, useAction } from '@solidjs/router'
import { getCurrentUser, logoutAction } from '../lib/auth'

const NavBar: Component = () => {
  const [user] = createResource(() => getCurrentUser())
  const logout = useAction(logoutAction)

  // Debug the user resource
  createEffect(() => {
    console.log('NavBar - User resource state:', {
      loading: user.loading,
      error: user.error,
      data: user(),
      state: user.state
    })
  })

  const handleLogout = () => {
    logout()
  }

  return (
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* Navigation Links */}
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <A 
                href="/" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                activeClass="text-gray-900 bg-gray-100"
              >
                Home
              </A>
              <A 
                href="/about" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                activeClass="text-gray-900 bg-gray-100"
              >
                About
              </A>
            </div>
          </div>

          {/* Auth Section */}
          <div class="flex items-center space-x-4">
            <Suspense 
              fallback={
                <div class="h-8 w-20 bg-gray-200 rounded animate-pulse">
                  Loading...
                </div>
              }
            >
              <Show 
                when={user()} 
                fallback={
                  <div class="flex items-center space-x-2">
                    {/* Debug info */}
                    <div class="text-xs text-red-500">
                      Debug: {user.error ? 'Error' : user.loading ? 'Loading' : 'No user'} | User: {JSON.stringify(user())}
                    </div>
                    <A 
                      href="/login"
                      class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-gray-400 transition-colors"
                    >
                      Login
                    </A>
                    <A 
                      href="/register"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Sign Up
                    </A>
                  </div>
                }
              >
                <div class="flex items-center space-x-3">
                  {/* Debug info for when user exists */}
                  <div class="text-xs text-green-500">
                    User loaded: {user()?.username || 'No username'}
                  </div>
                  <A 
                    href={`/profile/${user()?.username}`}
                    class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Show 
                      when={user()?.avatarUrl} 
                      fallback={
                        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span class="text-xs font-medium text-gray-600">
                            {user()?.displayName?.charAt(0)?.toUpperCase() || user()?.username?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      }
                    >
                      <img 
                        src={user()?.avatarUrl} 
                        alt={user()?.displayName || user()?.username}
                        class="w-8 h-8 rounded-full object-cover"
                      />
                    </Show>
                    <span class="hidden sm:block">{user()?.displayName || user()?.username}</span>
                  </A>
                  
                  <button
                    onClick={handleLogout}
                    class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </Show>
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar