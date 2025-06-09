// src/components/NavBar.tsx 
import { Component, Show, createEffect, createSignal, onMount } from 'solid-js'
import { A, useAction } from '@solidjs/router'
import { logoutAction } from '../lib/auth'
import { useAuth } from './AuthProvider'

const NavBar: Component = () => {
  const { user, isLoggedIn, isLoading, refetch } = useAuth()
  const logout = useAction(logoutAction)
  const [isHydrated, setIsHydrated] = createSignal(false)

  // Only show auth state after hydration to prevent mismatch
  onMount(() => {
    setIsHydrated(true)
  })

  // Debug the user resource
  createEffect(() => {
    console.log('NavBar - User resource state:', {
      loading: isLoading(),
      data: user(),
      isLoggedIn: isLoggedIn(),
      isHydrated: isHydrated()
    })
  })

  const handleLogout = async () => {
    await logout()
    // Refresh auth state after logout
    refetch()
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
              <Show when={isHydrated() && isLoggedIn()}>
                <A 
                  href="/explore" 
                  class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  activeClass="text-gray-900 bg-gray-100"
                >
                  Explore
                </A>
              </Show>
            </div>
          </div>

          {/* Auth Section - Always show loading until hydrated */}
          <div class="flex items-center space-x-4">
            <Show 
              when={isHydrated() && !isLoading()}
              fallback={
                /* Always show loading during SSR and initial hydration */
                <div class="h-8 w-32 bg-gray-200 rounded animate-pulse flex items-center justify-center">
                  <span class="text-xs text-gray-500">Loading...</span>
                </div>
              }
            >
              <Show 
                when={isLoggedIn()} 
                fallback={
                  /* Not logged in - show login/register */
                  <div class="flex items-center space-x-2">
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
                {/* Logged in - show user profile */}
                <div class="flex items-center space-x-3">
                  <A 
                    href={`/profile/${user()?.username || ''}`}
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
                        alt={user()?.displayName || user()?.username || 'User'}
                        class="w-8 h-8 rounded-full object-cover"
                      />
                    </Show>
                    <span class="hidden sm:block">{user()?.displayName || user()?.username || 'User'}</span>
                  </A>
                  
                  <button
                    onClick={handleLogout}
                    class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </Show>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar