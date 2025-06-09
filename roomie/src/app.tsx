import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import NavBar from './components/NavBar'; 
import { isServer } from "solid-js/web";

console.log("Rendering on:", isServer ? "server" : "client");

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Best Blog Ever</Title>
          <NavBar />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}

    >
      <FileRoutes />
    </Router>
  );
}
