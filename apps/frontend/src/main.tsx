import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const query = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <QueryClientProvider client={query}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>
);
