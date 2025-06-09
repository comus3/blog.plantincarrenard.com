// src/components/ProtectedRoute.tsx

import { createAsync, Navigate } from '@solidjs/router'
import { Show, Suspense } from 'solid-js'
import { getCurrentUser } from '../lib/auth'

interface ProtectedRouteProps {
  children: any
  fallback?: string
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const user = createAsync(() => getCurrentUser())

  return (
    <Suspense fallback={
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <Show 
        when={user()} 
        fallback={<Navigate href={props.fallback || '/login'} />}
      >
        {props.children}
      </Show>
    </Suspense>
  )
}