import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import popper from "../../assets/popper.json";

const Checkout = React.memo = (() => {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [showPopper, setShowPopper] = useState(false);

  const subtotal = 95.0;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome2024") {
      setDiscount(10);
      setShowPopper(true);
      setTimeout(() => setShowPopper(false), 2000); // Popper disappears after 1 second
    } else {
      setDiscount(0);
      setShowPopper(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] p-6">
      <motion.section
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-center text-[#00CED1]">Checkout</h2>
        
        {/* Item Specifications */}
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          {/* <h3 className="text-gray-700 font-semibold">Item Specifications</h3> */}
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Oil</span>
              <span>30×30×30 cm</span>
              <span>5 Kg</span>
            </div>
            <div className="flex justify-between">
              <span>Oil</span>
              <span>30×30×30 cm</span>
              <span>5 Kg</span>
            </div>
            <div className="flex justify-between">
              <span>Oil</span>
              <span>30×30×30 cm</span>
              <span>5 Kg</span>
            </div>
          </div>
        </div>

        {/* Tip Selection */}
        <div className="mt-4">
          <h3 className="text-gray-700 font-semibold">Added Tip</h3>
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-2 bg-[#00CED1] text-white rounded-lg">₹10</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">₹20</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">₹50</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">Other</button>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-gray-700 font-semibold">Bill Summary</h3>
          <div className="mt-2 text-gray-600">
            <div className="flex justify-between">
              <span>Your total bill is</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <p className="text-xs">Including all charges and tax</p>
          </div>
        </div>

        {/* Promo Code */}
        <div className="mt-4 relative">
          <h3 className="text-gray-700 font-semibold">Apply a promo code</h3>
          <p className="text-xs text-gray-500">Get discounts using promo codes</p>
          <div className="flex mt-2 gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 border p-2 rounded-lg"
            />
            <button
              onClick={applyPromoCode}
              className="bg-[#00CED1] text-white px-4 py-2 rounded-lg relative"
            >
              Apply
            </button>
          </div>
          {showPopper && (
            <motion.div
              className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg"
              initial={{ scale: 1, y:30 }}
              animate={{ scale: 1 , y:0}}
              exit={{ scale: 0 }}
              transition={{ duration: 3.3 }}
            >
                <Lottie
            animationData={popper} className="bg-transparent"/>
              🎉 Promo Applied!
            </motion.div>
          )}
          {promoCode && (
            <div className="mt-2 text-sm text-gray-700 bg-gray-200 p-2 rounded-lg flex justify-between items-center">
              <span>Code used <b>{promoCode.toUpperCase()}</b></span>
              <button onClick={() => setPromoCode("")} className="text-red-500">✖</button>
            </div>
          )}
        </div>

        {/* Payment Option */}
        <div className="mt-4">
          <h3 className="text-gray-700 font-semibold">Pay</h3>
          <p className="text-gray-600">Pay online</p>
        </div>

        {/* Confirm Order */}
        <button className="w-full bg-[#00CED1] text-white font-semibold mt-6 py-3 rounded-lg text-lg">
          Confirm Order
        </button>
      </motion.section>
    </main>
  );
});

Checkout.displayName = "Checkout";
export default Checkout;
