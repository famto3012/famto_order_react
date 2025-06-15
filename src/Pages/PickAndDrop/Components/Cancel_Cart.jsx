import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cancelOrder } from "../../../services/Pick_Drop/pickdropService";
import { useNavigate } from "react-router-dom";

const Cancel_Cart = ({ orderId }) => {
    const navigate = useNavigate();
  const [seconds, setSeconds] = useState(60);
  const [cancelEnabled, setCancelEnabled] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCancelEnabled(false); // Disable cancel after 60s
    }
  }, [seconds]);

  const handleCancelClick = () => {
    if (cancelEnabled) {
      setShowConfirm(true); // Show confirmation modal
    }
  };
  
 const handleConfirmCancel = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }

    try {
      const res = await cancelOrder(orderId, token);

      if (res.success) {
        alert("🚫 Order Cancelled Successfully");
        setShowConfirm(false);
        setTimeout(() => navigate("/"), 1000); // Navigate to home or orders page
      } else {
        alert(`❌ ${res.message}`);
      }
    } catch (err) {
      alert("❌ Failed to cancel order");
      setShowConfirm(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="cancel-cart"
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white shadow-2xl bg-gradient-to-r from-[#00CED1] to-[#008B8B] rounded-2xl px-6 py-4 z-50 flex items-center justify-between gap-6 w-[80%] max-w-md"
        >
          <button
            onClick={handleCancelClick}
            disabled={!cancelEnabled}
            className={`font-semibold px-5 py-2 rounded-full shadow transition duration-200 ${
              cancelEnabled
                ? "bg-red-700 hover:bg-black text-white"
                : "bg-gray-400 cursor-not-allowed text-white"
            }`}
          >
            {cancelEnabled ? `Cancel Order (${seconds}s)` : "Cancel Disabled"}
          </button>

          <button className="bg-[#00CED1] text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-black transition duration-200">
            Order Successful
          </button>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Are you sure you want to cancel this order?
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmCancel}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  No, Go Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cancel_Cart;
