import React, { useEffect, useState } from "react";
import "../../styles/Universal_Flow/CustomOrderStyles.css";
import {
  confirmCustomOrder,
  fetchCustomCartBill,
} from "../../services/Custom_Order/customOrderService";
import { FiShoppingBag } from "react-icons/fi";
import { LuSquareChevronRight } from "react-icons/lu";
import { LuSquareChevronDown } from "react-icons/lu";
import { Card, CardContent } from "@mui/material";
import { GrDownload } from "react-icons/gr";
import { useMutation } from "@tanstack/react-query";
import {
  applyPromocode,
  applyTip,
  confirmPickAndDropOrder,
  fetchAvailablePromocode,
  fetchBillCharges,
  removePromocode,
  verifyPickAndDropPayment,
} from "../../services/Pick_Drop/pickdropService";
import { useLocation } from "react-router-dom";
import { fetchBill } from "../../services/Universal_Flow/universalService";

const CustomCheckout = ({ cartItems = [], cartId }) => {
  const { state } = useLocation();
  const [selectedTip, setSelectedTip] = useState(20);
  const confirmationData = state?.confirmationData;
  const [isOtherTip, setIsOtherTip] = useState(false);
  const [customTipInput, setCustomTipInput] = useState("");
  const [promoexpanded, setPromoExpanded] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState("");
  const [showPopper, setShowPopper] = useState(false);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [billData, setBillData] = useState([]);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const data = await fetchCustomCartBill(cartId);
        setBillData(data);
      } catch (error) {
        console.log("Error in fetch custom Bill");
      }
    };
    fetchBillData();
  }, []);

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
        orderType,
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
    const data = await fetchAvailablePromocode("Custom Order", token);
    // console.log("hai merchant", orderType);

    setPromoCodes(data);
    setLoadingPromos(false);
  };

  const handleRemovePromoCode = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }

    try {
      await removePromocode(confirmationData.cartId, orderType, token);
      console.log("✅ Promocode removed from backend");
      setSelectedPromoCode("");
      await fetchCharges();
    } catch (error) {
      console.error("❌ Failed to remove promocode:", error);
    }
  };
  const token = localStorage.getItem("authToken");

  const confirmOrderMutation = useMutation({
    mutationFn: () => confirmOrder(paymentMode, token),
    onSuccess: async (data) => {
      const { orderId, amount, success } = data;

      if (!success) return alert("❌ Order creation failed");

      if (paymentMode === "Cash-on-delivery") {
        alert("✅ Order placed. Pay on delivery.");
        navigate("/home-delivery");
      } else {
        if (!orderId || !amount) return alert("⚠️ Missing payment data.");

        try {
          const result = await verifyPayment(orderId, amount, token);
          if (result.success) {
            alert("✅ Payment successful!");
            console.log("Take Away");
            // navigate(`/home-delivery/?orderId=${result.orderId}`); // ✅ Navigate from component
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

  const handleOtherClick = () => {
    setIsOtherTip(true);
    setCustomTipInput("");
  };

  const handleTipSelect = async (tip) => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("You're not logged in.");

    try {
      setSelectedTip(tip);
      setIsOtherTip(false);
      console.log("Tip selected:", tip);

      // Example backend call — you should replace or define `applyTip` and `fetchCharges`
      // await applyTip(cartId, "custom-order", tip, token);
      // await fetchCharges();
    } catch (err) {
      console.error("❌ Failed to save tip:", err);
    }
  };

  const handleSaveCustomTip = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("You're not logged in.");

    const value = parseFloat(customTipInput);
    if (isNaN(value) || value <= 0) return alert("Enter a valid custom tip");

    await handleTipSelect(value);
  };

  const handleConfirmOrder = async () => {
    console.log("Confirming order for cartId:", cartId);
    await confirmCustomOrder(cartId);
  };

  const grandTotal =
    DELIVERY_CHARGE +
    SURGE_CHARGE +
    WAITING_CHARGE +
    selectedTip +
    TAX -
    DISCOUNT;

  return (
    <div className="checkout-box">
      <h4>Checkout</h4>

      {/* Tip Selection */}
      <div className="my-6">
        <h3 className="text-gray-700 font-medium">Add Tip</h3>

        {isOtherTip ? (
          <div className="flex gap-2 my-4">
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
          <div className="flex gap-2 my-4">
            {PRESET_TIPS.map((tip) => (
              <button
                key={tip}
                onClick={() => handleTipSelect(tip)}
                className={`flex-1 rounded-lg py-2 ${
                  selectedTip === tip
                    ? "bg-[#00CED1] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                ₹ {tip}
              </button>
            ))}
            <button
              onClick={handleOtherClick}
              className="flex-1 bg-gray-200 rounded-lg py-2"
            >
              {PRESET_TIPS.includes(selectedTip) ? "Other" : `₹ ${selectedTip}`}
            </button>
          </div>
        )}
      </div>

      {/* Bill Summary */}
      <div className="bill-summary flex flex-col">
        <h5>Bill Summary</h5>
        <div className="bill-row">
          <span>Item Total</span>
          <span>will be updated soon</span>
        </div>
        <div className="bill-row">
          <span>Delivery Charges</span>
          <span>₹ {DELIVERY_CHARGE}</span>
        </div>
        <div className="bill-row">
          <span>Surge Charges</span>
          <span>₹ {SURGE_CHARGE}</span>
        </div>
        <div className="bill-row">
          <span>Waiting Charges</span>
          <span>₹ {WAITING_CHARGE}</span>
        </div>
        <div className="bill-row">
          <span>Tip</span>
          <span>₹ {selectedTip}</span>
        </div>
        <div className="bill-row">
          <span>Discount (Promo Code)</span>
          <span>-₹ {DISCOUNT}</span>
        </div>
        <div className="bill-row">
          <span>Taxes & Fees</span>
          <span>₹ {TAX}</span>
        </div>
        <div className="bill-row total">
          <strong>Grand Total</strong>
          <strong>₹ {grandTotal}</strong>
        </div>
      </div>

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
              <p className="text-sm text-gray-500">No promo codes available</p>
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
                          onClick={() => setSelectedPromoCode(promo.promoCode)}
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

      {/* Confirm Order Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleConfirmOrder}
          className="bg-[#00CED1] px-6 py-3 text-white text-lg rounded-full"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CustomCheckout;
