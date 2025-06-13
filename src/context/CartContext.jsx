import { createContext, useContext, useState } from "react";
import { updateItemData } from "../services/Universal_Flow/universalService";


const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const increment = async (productId) => {
    setCart((prev) => {
      const newQuantity = (prev[productId]?.quantity || 0) + 1;
      updateItemData(productId, newQuantity); // fire API
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity,
        },
      };
    });
  };

  const decrement = async (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      const newQuantity = (updated[productId]?.quantity || 1) - 1;

      if (newQuantity <= 0) {
        delete updated[productId];
           updateItemData(productId, 0); // fire API
      } else {
        updated[productId].quantity = newQuantity;
          updateItemData(productId, newQuantity); // fire API
      }

      return updated;
    });
  };

  const addToCart = (product) => {
    const { productId } = product;
    setCart((prev) => ({
      ...prev,
      [productId]: prev[productId]
        ? { ...prev[productId], quantity: prev[productId].quantity + 1 }
        : { ...product, quantity: 1 },
    }));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, increment, decrement, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
