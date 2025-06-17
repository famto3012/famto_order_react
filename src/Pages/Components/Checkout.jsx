import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import popper from "../../assets/popper.json";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  applyPromocode,
  applyTip,
  confirmPickAndDropOrder,
  fetchAvailablePromocode,
  fetchBillCharges,
  removePromocode,
  verifyPickAndDropPayment,
} from "../../services/Pick_Drop/pickdropService";
import { LuSquareChevronRight } from "react-icons/lu";
import { LuSquareChevronDown } from "react-icons/lu";
import { Card, CardContent } from "@mui/material";
import { GrDownload } from "react-icons/gr";
import { FiShoppingBag } from "react-icons/fi";
const Checkout = () => {
  const [paymentMode, setPaymentMode] = useState("");
  const [showPopper, setShowPopper] = useState(false);
  const subtotal = 95.0;

  const { state } = useLocation();
  const navigate = useNavigate();
  const confirmationData = state?.confirmationData;
  const [selectedTip, setSelectedTip] = useState(null);
  const [billDetails, setBillDetails] = useState(null);
  const [isOther, setIsOther] = useState(false);
  const [customTipInput, setCustomTipInput] = useState("");
  const presetTips = [10, 20, 50];
  const [expanded, setExpanded] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoexpanded, setPromoExpanded] = useState(false);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState("");
  const toggleDetails = () => setExpanded((prev) => !prev);
  const toggleDetail = () => setPromoExpanded((prev) => !prev);

  const fetchCharges = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !confirmationData?.cartId) return;
    const data = await fetchBillCharges(confirmationData.cartId, token);
    setBillDetails(data);
  };

  useEffect(() => {
    console.log("Cart ID:", state?.cartId);
    console.log("useEffect running for fetchBillCharges...");
    fetchCharges();
  }, [confirmationData?.cartId]);

  const handlePromoToggle = async () => {
    setPromoExpanded((prev) => {
      const newState = !prev;
      if (newState) {
        fetchPromos();
      }
      return newState;
    });
  };

  const handleApplyPromoCode = async (promoCode) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }

    try {
      const res = await applyPromocode(
        confirmationData.cartId,
        "Pick and Drop",
        promoCode,
        token
      );
      console.log("✅ Promocode saved to backend:", res);
      // ✅ Show popper on success
      setShowPopper(true);
      setTimeout(() => setShowPopper(false), 2000);

      // Optionally set the applied code visually
      setSelectedPromoCode(promoCode);
      await fetchCharges();
    } catch (err) {
      console.error("❌ Failed to save promocode:", err);
    }
  };

  const fetchPromos = async () => {
    setLoadingPromos(true);
    const token = localStorage.getItem("authToken"); // Or from context/auth state
    const data = await fetchAvailablePromocode("Pick and Drop", token);
    setPromoCodes(data);
    setLoadingPromos(false);
  };

  const handleTipSelect = async (tip) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }
    try {
      setSelectedTip(tip);
      setIsOther(false);
      console.log("Tip selected:", tip);

      const res = await applyTip(
        confirmationData.cartId,
        "Pick and Drop",
        tip,
        token
      );
      console.log("✅ Tip saved to backend:", res);
      await fetchCharges();
    } catch (err) {
      console.error("❌ Failed to save tip:", err);
    }
  };

  const handleOtherClick = () => {
    setIsOther(true);
    setCustomTipInput("");
  };

  const handleSaveCustomTip = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }
    const customValue = parseFloat(customTipInput);
    if (!isNaN(customValue) && customValue > 0) {
      try {
        setSelectedTip(customValue);
        setIsOther(false);
        console.log("Tip selected:", customValue);
        const res = await applyTip(
          confirmationData.cartId,
          "Pick and Drop",
          customValue,
          token
        );
        console.log("✅ Custom tip saved to backend:", res);
        await fetchCharges();
      } catch (err) {
        console.error("❌ Failed to save custom tip:", err);
      }
    }
  };

  const handleCustomTipClick = () => {
    handleOtherClick(); // Reopen for editing
  };

  // Add this function in your component
  const handleRemovePromoCode = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }

    try {
      await removePromocode(confirmationData.cartId, "Pick and Drop", token);
      console.log("✅ Promocode removed from backend");
      setSelectedPromoCode("");
      await fetchCharges();
    } catch (error) {
      console.error("❌ Failed to remove promocode:", error);
    }
  };
  const token = localStorage.getItem("authToken");

  const confirmOrderMutation = useMutation({
    mutationFn: () => confirmPickAndDropOrder(paymentMode, token),
    onSuccess: async (data) => {
      const { orderId, amount, success } = data;

      if (!success) return alert("❌ Order creation failed");

      if (paymentMode === "cash") {
        alert("✅ Order placed. Pay on delivery.");
        navigate("/pick-drop");
      } else {
        if (!orderId || !amount) return alert("⚠️ Missing payment data.");

        try {
          const result = await verifyPickAndDropPayment(orderId, amount, token);
          if (result.success) {
            alert("✅ Payment successful!");
            navigate(`/pick-drop/?orderId=${result.orderId}`); // ✅ Navigate from component
          } else {
            alert("❌ Payment failed");
          }
        } catch (error) {
          console.error("❌ Payment error:", error);
          alert("❌ Payment verification failed.");
        }
      }
    },
    onError: () => {
      alert("❌ Order creation failed");
    },
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] p-6">
      <motion.section
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-center text-[#00CED1]">
          Checkout
        </h2>

        {/* Item Specifications */}
        <div className="my-6 text-sm text-gray-600 divide-y divide-gray-200">
          {confirmationData?.items?.map((item, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center px-2 py-3 rounded ${idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
            >
              <span>{item.itemName}</span>
              <span>
                {item.length}*{item.width}*{item.height} cm
              </span>
              <span>{item.weight} Kg</span>
            </div>
          ))}
        </div>

        {/* Tip Selection */}
        <div className="my-6">
          <h3 className="text-gray-700 font-medium">Added Tip</h3>

          {/* Show input for custom tip */}
          {isOther ? (
            <div className="flex justify-between gap-2 my-4">
              <input
                type="number"
                value={customTipInput}
                onChange={(e) => setCustomTipInput(e.target.value)}
                placeholder="Enter custom tip"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                onClick={handleSaveCustomTip}
                className="bg-[#00CED1] text-white rounded-lg px-4 py-2"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between gap-2 my-4">
              {presetTips.map((tip) => (
                <button
                  key={tip}
                  onClick={() => handleTipSelect(tip)}
                  className={`flex-1 rounded-lg py-2 ${selectedTip === tip
                    ? "bg-[#00CED1] text-white"
                    : "bg-gray-200 text-black"
                    }`}
                >
                  ₹ {tip}
                </button>
              ))}

              {/* If custom tip is selected, show it */}
              {typeof selectedTip === "number" &&
                !presetTips.includes(selectedTip) ? (
                <button
                  onClick={handleCustomTipClick}
                  className="flex-1 bg-[#00CED1] text-white rounded-lg py-2"
                >
                  ₹ {selectedTip}
                </button>
              ) : (
                <button
                  onClick={handleOtherClick}
                  className="flex-1 bg-gray-200 rounded-lg py-2"
                >
                  Other
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bill Summary */}

        <div className="my-6">
          <h3 className="text-gray-700 font-medium">Bill Summary</h3>

          {/* Summary Header (Clickable) */}
          <div
            className="my-4 bg-gray-100 flex justify-between items-center p-4 rounded-lg cursor-pointer"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <div className="gap-4 flex flex-row items-center">
              <FiShoppingBag className="text-3xl font-light text-gray-500" />
              <div className="flex flex-col">
                <span>Your total bill is ₹{subtotal}</span>
                <p className="text-sm text-gray-500">
                  Including all charges and tax
                </p>
              </div>
            </div>
            {expanded ? (
              <LuSquareChevronDown className="text-3xl font-light text-gray-500" />
            ) : (
              <LuSquareChevronRight className="text-3xl font-light text-gray-500" />
            )}
          </div>

          {/* Expanded Detail Section */}
          {expanded && billDetails && (
            <div className="bg-white  border-gray-200 border-2 rounded-lg p-4 space-y-3 text-gray-700 shadow-sm">
              <div className="flex justify-between">
                <span className="font-medium">Delivery Charges</span>
                <span>₹{billDetails.deliveryCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Surge charges</span>
                <span>₹{billDetails.surgePrice ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Added Tip</span>
                <span>₹{billDetails.addedTip ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Discount</span>
                <span>₹{billDetails.discountedAmount ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Taxes & Fees</span>
                <span>₹{billDetails.taxAmount ?? 0}</span>
              </div>
              <hr className="border-gray-400" />
              <div className="flex justify-between font-semibold">
                <span className="font-medium">Grand Total</span>
                <span>₹{billDetails.grandTotal}</span>
              </div>
            </div>
          )}
        </div>
        {/* Promo Code */}
        <div className="my-3">
          {/* Summary Header (Clickable) */}
          <div
            className="my-4 bg-gray-100 flex justify-between items-center p-4 rounded-lg cursor-pointer"
            onClick={handlePromoToggle}
          >
            <div className="gap-4 flex flex-row items-center">
              <FiShoppingBag className="text-3xl font-light text-gray-500" />
              <div className="flex flex-col">
                <span>Apply a promo code</span>
                <p className="text-sm text-gray-500">
                  Get discounts using promo codes
                </p>
              </div>
            </div>
            {promoexpanded ? (
              <LuSquareChevronDown className="text-3xl font-light text-gray-500" />
            ) : (
              <LuSquareChevronRight className="text-3xl font-light text-gray-500" />
            )}
          </div>
          {promoexpanded && (
            <div className="space-y-3 flex justify-center">
              {loadingPromos ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : promoCodes.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No promo codes available
                </p>
              ) : (
                promoCodes.map((promo) => (
                  <Card
                    key={promo.id}
                    sx={{
                      width: "100%",
                      maxWidth: "400px",
                      borderRadius: "20px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <CardContent className="!p-0">
                      <div className="flex w-full h-24">
                        <img
                          src={promo.imageURL}
                          className="h-24 w-24 object-contain rounded-l-lg"
                          alt={promo.promoCode}
                        />
                        <div className="flex flex-col justify-center px-4 flex-grow">
                          <p className="text-lg font-semibold text-black">
                            {promo.promoCode} - {promo.discount}% Off
                          </p>
                          <p className="text-sm text-gray-500">
                            Valid upto {promo.validUpTo}
                          </p>
                        </div>
                        <div className="bg-[#F7F7F7] w-12 h-full flex items-center justify-center rounded-r-lg border-l-2 border-gray-200">
                          <GrDownload
                            className="text-lg cursor-pointer"
                            onClick={() =>
                              setSelectedPromoCode(promo.promoCode)
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
        <div className="mt-4 ">
          <div className="flex mx-auto">
            {selectedPromoCode && (
              <div className="text-sm text-gray-700 bg-gray-200 px-5 py-[6px] rounded-lg flex justify-between items-center w-full max-w-md mx-auto">
                <span>
                  Code used: <b>{selectedPromoCode}</b>
                </span>
                <button
                  onClick={handleRemovePromoCode}
                  className="text-red-500 font-bold ml-2"
                >
                  ✖
                </button>
              </div>
            )}
            {selectedPromoCode && (
              <button
                onClick={() => handleApplyPromoCode(selectedPromoCode)}
                className="bg-[#00CED1] text-white px-12 py-1 rounded-lg relative"
                disabled={!selectedPromoCode}
              >
                Apply
              </button>
            )}
          </div>
          {showPopper && (
            <motion.div
              className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg"
              initial={{ scale: 1, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              transition={{ duration: 3.3 }}
            >
              <Lottie animationData={popper} className="bg-transparent" />
              🎉 Promo Applied!
            </motion.div>
          )}
        </div>

        {/* Payment Option */}
        <div className="mt-4">
          <h3 className="text-gray-700 font-medium">Pay</h3>
          <button
            className={`px-4 py-2 rounded-lg border ${paymentMode === "Online-payment" ? "bg-[#00CED1] text-white" : ""
              }`}
            onClick={() => setPaymentMode("Online-payment")}
          >
            Online Payment
          </button>
        </div>

        {/* Confirm Order */}
        <button
          className="w-full bg-[#00CED1] text-white font-medium
         mt-6 py-3 rounded-lg text-lg"
          onClick={() => {
            if (!token) {
              alert("You're not logged in.");
              console.log("Payment Mode:", paymentMode);
              return;
            }

            if (!paymentMode) {
              alert("Please select a payment mode.");
              console.log("Token:", token);
              return;
            }

            confirmOrderMutation.mutate();
            console.log("Payment Mode:", paymentMode);
            console.log("Token:", token);
          }}
        >
          Confirm Order
        </button>
      </motion.section>
    </main>
  );
};

Checkout.displayName = "Checkout";
export default Checkout;
