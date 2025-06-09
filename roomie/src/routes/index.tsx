import { createSignal, createResource, For, Show } from "solid-js";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { PostCard } from "~/components/PostCard";
import { PostWithAuthor, Post, User } from "~/lib/types";



export default function Home() {

  return (
    <>
      <Title>Best Blog Ever - Home</Title>
      
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section class="relative py-20 px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to the 
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Best Blog Ever
              </span>
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover amazing stories, insights, and ideas from our community of writers. 
              Join us on a journey of knowledge and creativity.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <A
                href="/explore"
                class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Posts
              </A>
              <A
                href="/register"
                class="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl border border-blue-600"
              >
                Join Community
              </A>
            </div>
          </div>
        </section>

        

        {/* Features Section */}
        <section class="py-16 px-4 bg-white">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center p-6">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Easy Writing</h3>
                <p class="text-gray-600">
                  Beautiful markdown editor with live preview makes writing a breeze.
                </p>
              </div>
              
              <div class="text-center p-6">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p class="text-gray-600">
                  Connect with other writers and readers in our vibrant community.
                </p>
              </div>
              
              <div class="text-center p-6">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p class="text-gray-600">
                  Built with modern technology for the best reading experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section class="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div class="max-w-4xl mx-auto text-center text-white">
            <h2 class="text-3xl font-bold mb-4">
              Ready to Share Your Story?
            </h2>
            <p class="text-xl mb-8 opacity-90">
              Join thousands of writers who trust our platform to share their ideas.
            </p>
            <A
              href="/register"
              class="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Writing Today
            </A>
          </div>
        </section>
      </div>
    </>
  );
}