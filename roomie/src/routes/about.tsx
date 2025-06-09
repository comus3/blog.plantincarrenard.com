// src/routes/about.tsx
import { Title } from '@solidjs/meta'

export default function About() {
  return (
    <>
      <Title>About - SolidStart Blog</Title>
      
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
              About This Blog
            </h1>
            
            <div class="mt-8 space-y-6 text-lg text-gray-600 max-w-2xl mx-auto">
              <p>
                Welcome to our SolidStart blog platform! This is a modern blogging application 
                built with the latest web technologies.
              </p>
              
              <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                  Technical Stack
                </h2>
                
                <div class="space-y-3 text-left">
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>SolidStart:</strong> Full-stack framework for building web applications</span>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span><strong>SSR:</strong> Server-Side Rendering for optimal performance and SEO</span>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span><strong>SPA:</strong> Single Page Application for smooth user interactions</span>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>Hybrid:</strong> Best of both worlds - fast initial loads and dynamic updates</span>
                  </div>
                </div>
              </div>
              
              <p>
                This platform demonstrates the power of modern web development, 
                combining server-side rendering for performance with client-side 
                interactivity for a seamless user experience.
              </p>
              
              <div class="pt-6">
                <a 
                  href="/"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}