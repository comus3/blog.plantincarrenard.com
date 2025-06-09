// src/components/NavBar.tsx

import { A, useAction } from '@solidjs/router'
import { createAsync } from '@solidjs/router'
import { Show, createSignal } from 'solid-js'
import { getCurrentUser, logout } from '../lib/auth'


export default function NavBar() {
  const user = createAsync(() => getCurrentUser())
  const logoutAction = useAction(logout)
  const [isMenuOpen, setIsMenuOpen] = createSignal(false)

  const handleLogout = async () => {
    try {
      await logoutAction()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <A 
              href="/" 
              class="flex-shrink-0 flex items-center text-xl font-bold text-gray-800 hover:text-gray-600"
            >
              Your App
            </A>
            
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <A 
                href="/" 
                class="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                activeClass="text-blue-600 border-b-2 border-blue-600"
              >
                Home
              </A>
              <A 
                href="/about" 
                class="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                activeClass="text-blue-600 border-b-2 border-blue-600"
              >
                About
              </A>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <Show 
              when={user()} 
              fallback={
                <div class="hidden md:flex items-center space-x-4">
                  <A 
                    href="/login" 
                    class="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
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
              {(currentUser) => (
                <div class="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen())}
                    class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div class="flex items-center space-x-3">
                      <Show 
                        when={currentUser().avatarUrl} 
                        fallback={
                          <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                            {currentUser().displayName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        }
                      >
                        <img 
                          class="h-8 w-8 rounded-full" 
                          src={currentUser().avatarUrl} 
                          alt={currentUser().displayName} 
                        />
                      </Show>
                      <span class="hidden md:block text-gray-700 font-medium">
                        {currentUser().displayName}
                      </span>
                    </div>
                  </button>

                  <Show when={isMenuOpen()}>
                    <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div class="py-1">
                        <A 
                          href={`/profile/${currentUser().username}`}
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Your Profile
                        </A>
                        <A 
                          href="/settings" 
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Settings
                        </A>
                        <button
                          onClick={handleLogout}
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </Show>
                </div>
              )}
            </Show>

            {/* Mobile menu button */}
            <div class="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen())}
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Show when={isMenuOpen()}>
          <div class="md:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <A 
                href="/" 
                class="text-gray-900 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </A>
              <A 
                href="/about" 
                class="text-gray-900 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </A>
              
              <Show 
                when={!user()} 
                fallback={
                  <div class="pt-2 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      class="text-gray-900 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                }
              >
                <div class="pt-2 border-t border-gray-200">
                  <A 
                    href="/login" 
                    class="text-gray-900 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </A>
                  <A 
                    href="/register" 
                    class="text-gray-900 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </A>
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  )
}