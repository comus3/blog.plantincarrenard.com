// src/app.tsx - FINAL VERSION WITH REAL PROFILE

import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, lazy } from "solid-js";
import "./app.css";
import NavBar from './components/NavBar'; 
import { AuthProvider } from './components/AuthProvider';
import { isServer } from "solid-js/web";

console.log("🚀 App.tsx loading on:", isServer ? "server" : "client");

// 🎯 IMPORT THE REAL PROFILE COMPONENT
const Profile = lazy(() => import("./routes/profile/[username]"));

export default function App() {
  console.log("🚀 App component rendering on:", isServer ? "server" : "client");
  
  return (
    <Router
      root={props => {
        console.log("🔄 Router root rendering on:", isServer ? "server" : "client");
        return (
          <MetaProvider>
            <Title>Best Blog Ever</Title>
            <AuthProvider>
              <NavBar />
              <Suspense fallback={
                <div class="flex items-center justify-center min-h-screen">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading page...</p>
                  </div>
                </div>
              }>
                {props.children}
              </Suspense>
            </AuthProvider>
          </MetaProvider>
        );
      }}
    >
      {/* 🎯 REAL PROFILE ROUTE - manually registered to bypass FileRoutes issues */}
      <Route path="/profile/:username" component={Profile} />
      
      {/* Keep FileRoutes for other routes */}
      <FileRoutes />
    </Router>
  );
}