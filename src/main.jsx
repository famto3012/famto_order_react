import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ChakraProvider } from "@chakra-ui/react"; // ✅ Import ChakraProvider
import "./index.css";
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';

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
