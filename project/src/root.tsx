// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import { NavBar } from "./components/NavBar";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart Blog Platform</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="description" content="A modern blog platform built with SolidStart" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Body class="bg-gray-50 text-gray-900 min-h-screen">
        <ErrorBoundary fallback={(err) => (
          <div class="flex items-center justify-center min-h-screen">
            <div class="p-8 bg-white rounded-lg shadow-md">
              <h1 class="text-xl font-bold text-red-500 mb-4">Something went wrong</h1>
              <pre class="text-sm bg-gray-100 p-4 rounded">{err.toString()}</pre>
              <button
                class="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
                onClick={() => window.location.href = "/"}
              >
                Go back home
              </button>
            </div>
          </div>
        )}>
          <NavBar />
          <Suspense fallback={
            <div class="flex justify-center items-center min-h-screen">
              <div class="animate-pulse flex flex-col items-center">
                <div class="h-12 w-12 bg-primary-300 rounded-full mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          }>
            <main class="pt-16 pb-12">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}