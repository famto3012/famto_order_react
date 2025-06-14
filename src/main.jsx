
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';

// 1. Create a QueryClient instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <CartProvider>
      <App />
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>
);

