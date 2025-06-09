import { createSignal, Show } from 'solid-js'
import { createAsync } from '@solidjs/router'
import ProtectedRoute from '../components/ProtectedRoute'
import { getCurrentUser } from '../lib/auth'

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const user = createAsync(() => getCurrentUser())
  const [isLoading, setIsLoading] = createSignal(false)
  const [message, setMessage] = createSignal('')
  const [error, setError] = createSignal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const currentUser = user()
      if (!currentUser) return

      const updateData = {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        displayName: formData.get('displayName') as string,
        bio: formData.get('bio') as string,
        avatarUrl: formData.get('avatarUrl') as string,
      }

      // Only include password if provided
      const newPassword = formData.get('newPassword') as string
      if (newPassword) {
        const confirmPassword = formData.get('confirmPassword') as string
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        updateData.password = newPassword
      }

      const apiUrl = process.env.API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Update failed')
      }

      setMessage('Profile updated successfully!')
      
      // Clear password fields
      const passwordInputs = form.querySelectorAll('input[type="password"]')
      passwordInputs.forEach(input => (input as HTMLInputElement).value = '')
      
    } catch (err: any) {
      setError(err.message || 'Update failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
            
            <Show when={user()}>
              {(currentUser) => (
                <form onSubmit={handleSubmit} class="space-y-6">
                  <Show when={message()}>
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                      {message()}
                    </div>
                  </Show>

                  <Show when={error()}>
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error()}
                    </div>
                  </Show>

                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label for="username" class="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={currentUser().username}
                        required
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>

                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={currentUser().email}
                        required
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="displayName" class="block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      value={currentUser().displayName}
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>

                  <div>
                    <label for="bio" class="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows={4}
                      value={currentUser().bio || ''}
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div>
                    <label for="avatarUrl" class="block text-sm font-medium text-gray-700">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      name="avatarUrl"
                      id="avatarUrl"
                      value={currentUser().avatarUrl || ''}
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label for="newPassword" class="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>

                      <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading()}
                      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading() ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </Show>
          </div>
        </div>
      </div>
    </div>
  )
}