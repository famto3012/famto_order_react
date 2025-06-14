import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { sendItemData } from "../../../services/Universal_Flow/universalService";
import { useCart } from "../../../context/CartContext";


const FloatingCart = ({merchantId, businessCategoryId }) => {
  
  const navigate = useNavigate();
  const { cart } = useCart();
  const itemCount = Object.values(cart).reduce((a, b) => a + b.quantity, 0);

const cartInitialize = async () => {
  const payload = {
    merchantId: merchantId || "",
    items: Object.entries(cart).map(([productId, item]) => ({
      productId: productId,
      quantity: item.quantity,
      price: item.price,
      variantTypeId: item.variantTypeId,
    })),
  };

  try {
    const data = await sendItemData(payload);
    console.log("Cart Data sent", data);
    navigate(`/checkout-page`, { state: { cart ,businessCategoryId} });
  } catch (error) {
    console.error(error);

    if (
      error?.response?.status === 401 ||
      error?.message === "User not authenticated"
    ) {
      navigate("/login"); // ✅ Navigate to login
    }
  }
};



  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          key="floating-cart"
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#00CED1] to-[#008B8B] text-white shadow-2xl rounded-2xl px-6 py-4 z-50 flex items-center justify-between gap-6 w-[90%] max-w-lg"
        >
          <div className="flex items-center gap-3">
            <FaShoppingCart size={40} className="text-white animate-bounce" />
            <div>
              <div className="text-sm">Items in Cart</div>
              <div className="font-bold text-lg">{itemCount} items</div>
            </div>
          </div>
          <button
            className="bg-white text-[#00CED1] font-bold px-5 py-2 rounded-full shadow hover:bg-gray-100 transition duration-200"
            onClick={cartInitialize}
          >
            View Cart
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
