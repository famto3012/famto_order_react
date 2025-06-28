// import { createContext, useContext, useState } from "react";
// import { updateItemData } from "../services/Universal_Flow/universalService";

// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState({});

//   const increment = async (productId, variantTypeId) => {
//     setCart((prev) => {
//       const newQuantity = (prev[productId]?.quantity || 0) + 1;
//       updateItemData(productId, newQuantity, variantTypeId); // fire API
//       return {
//         ...prev,
//         [productId]: {
//           ...prev[productId],
//           quantity: newQuantity,
//         },
//       };
//     });
//   };

//   const decrement = async (productId, variantTypeId) => {
//     setCart((prev) => {
//       const updated = { ...prev };
//       const newQuantity = (updated[productId]?.quantity || 1) - 1;

//       if (newQuantity <= 0) {
//         delete updated[productId];
//            updateItemData(productId, 0, variantTypeId); // fire API
//       } else {
//         updated[productId].quantity = newQuantity;
//           updateItemData(productId, newQuantity, variantTypeId); // fire API
//       }

//       return updated;
//     });
//   };

//   const addToCart = (product) => {
//     const { productId } = product;
//     setCart((prev) => ({
//       ...prev,
//       [productId]: prev[productId]
//         ? { ...prev[productId], quantity: prev[productId].quantity + 1 }
//         : { ...product, quantity: 1 },
//     }));
//   };

//   return (
//     <CartContext.Provider value={{ cart, setCart, increment, decrement, addToCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

import { createContext, useContext, useState } from "react";
import {
  updateItemData,
  fetchCustomerCart,
} from "../services/Universal_Flow/universalService";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [cartId, setCartId] = useState(null);
  const [isLocalCart, setIsLocalCart] = useState(false);
  const [cartProductDetails, setCartProductDetails] = useState([]);
  const [currentMerchantId, setCurrentMerchantId] = useState(null);

  const initializeCart = async (merchantId) => {
    try {
      const data = await fetchCustomerCart();
      if (data) {
        const apiCart = {};
        const apiCartId = data?.data?.cartId;
        const items = data?.data?.items || [];

        // items.forEach((item) => {
        //   const productId = item.productId?.id; // ✅ extract productId from API object
        //   if (productId) {
        //     apiCart[productId] = {
        //       ...item,
        //       productId: productId, // ✅ store as string
        //       quantity: item.quantity,
        //       price: item.price,
        //       variantTypeId: item.variantTypeId,
        //     };
        //   }
        // });

        items.forEach((item) => {
          apiCart[item.productId.id] = {
            productId: item.productId.id,
            productName: item.productId.productName,
            quantity: item.quantity,
            price: item.price,
            variantTypeId: item.variantTypeId,
          };
        });

        setCart(apiCart);
        setCartId(apiCartId);
        setCurrentMerchantId(merchantId);
        setIsLocalCart(false);
        setCartProductDetails(items);
        console.log("Cart ID in cartContext", apiCartId);
      }
    } catch (error) {
      console.error("Failed to initialize cart:", error);
    }
  };

  const increment = async (productId, variantTypeId, merchantId, productData) => {
      if (merchantId !== currentMerchantId) {
      // 🚨 New merchant selected → reset cart
      resetCart(productData, merchantId);
      return;
    }
    setCart((prev) => {
      const newQuantity = (prev[productId]?.quantity || 0) + 1;
      updateItemData(productId, newQuantity, variantTypeId);
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity,
        },
      };
    });
  };

  const decrement = async (productId, variantTypeId) => {
    setCart((prev) => {
      const updated = { ...prev };
      const newQuantity = (updated[productId]?.quantity || 1) - 1;

      if (newQuantity <= 0) {
        delete updated[productId];
        updateItemData(productId, 0, variantTypeId);
      } else {
        updated[productId].quantity = newQuantity;
        updateItemData(productId, newQuantity, variantTypeId);
      }

      return updated;
    });
  };

   const resetCart = (product, merchantId) => {
    // Start fresh cart for new merchant
    setCart({
      [product.productId]: { ...product, quantity: 1 }
    });
    setCurrentMerchantId(merchantId);
    setIsLocalCart(true);
  };


  const addToCart = (product, merchantId) => {

    if (merchantId !== currentMerchantId) {
      // 🚨 New merchant selected → reset cart
      resetCart(product, merchantId);
      return;
    }

    const { productId } = product;
    setCart((prev) => ({
      ...prev,
      [productId]: prev[productId]
        ? { ...prev[productId], quantity: prev[productId].quantity + 1 }
        : { ...product, quantity: 1 },
    }));
    setIsLocalCart(true);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartId,
        isLocalCart,
        cartProductDetails,
        initializeCart,
        increment,
        decrement,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
