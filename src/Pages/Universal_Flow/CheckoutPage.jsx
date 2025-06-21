import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";
import { updateCartDetail } from "../../services/Universal_Flow/universalService";
import Address from "../Components/Address";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState("Home Delivery");
  const [merchantInstruction, setMerchantInstruction] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const { cart, increment, decrement } = useCart();
  const location = useLocation();
  const businessCategoryId = location?.state?.businessCategoryId || null;

  const cartItems = Object.entries(cart);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }

    // const updatedData = {
    //   ...savedData,
    //   [selectedItem]: {
    //     ...formData,
    //     image: categories[selectedItem].image,
    //     name: categories[selectedItem].name,
    //   },
    // };


    try {
     
        // 🟢 First item being saved: use pick & drop request
        const formDataToSend = new FormData();
        formDataToSend.append(
          "deliveryAddressType",
          selectedAddress.type || ""
        );
        formDataToSend.append("businessCategoryId", businessCategoryId || "");
        formDataToSend.append("orderType", orderType || "");
        if (selectedAddress.type === "other") {
          formDataToSend.append(
            "deliveryAddressOtherAddressId",
            selectedAddress.id || ""
          );
        }
        // Only include newPickupAddress fields if it's a new address (no id)
        if (selectedAddress?.isNewAddress) {
          formDataToSend.append(
            "newDeliveryAddress[fullName]",
            selectedAddress.fullName
          );
          formDataToSend.append(
            "newDeliveryAddress[phoneNumber]",
            selectedAddress.phoneNumber
          );
          formDataToSend.append(
            "newDeliveryAddress[flat]",
            selectedAddress.flat
          );
          formDataToSend.append(
            "newDeliveryAddress[area]",
            selectedAddress.area
          );
          formDataToSend.append(
            "newDeliveryAddress[landmark]",
            selectedAddress.landmark
          );
          formDataToSend.append(
            "newDeliveryAddress[coordinates][0]",
            selectedAddress.coordinates?.[0] || ""
          );
          formDataToSend.append(
            "newDeliveryAddress[coordinates][1]",
            selectedAddress.coordinates?.[1] || ""
          );
        }
        formDataToSend.append("instructionInPickup", selectedAddress || "");

        const items = cartItems.map(([productId, item]) => ({
          productId,
          quantity: item.quantity,
          variantTypeId: item.variantTypeId || null,
        }));
        formDataToSend.append("item", JSON.stringify(items));

        const response = await updateCartDetail(formDataToSend, token);
        console.log(response);
         navigate("/order-confirm", {
        state: { confirmationData: response, orderType },
        });
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
        }
        alert("Pick & Drop Request Submitted");
     
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to save item.");
    }
  };
  // const handleConfirmOrder = async () => {
  //   const items = cartItems.map(([productId, item]) => ({
  //     productId,
  //     quantity: item.quantity,
  //     variantTypeId: item.variantTypeId || null,
  //   }));

  //   const payload = {
  //     orderType,
  //     // merchantInstruction,
  //     // customerNote,
  //     // items,
  //     // selectedAddress,/
  //     businessCategoryId,
  //   };

  //   try {
  //     const result = await updateCartDetail(payload);
  //     alert("Order confirmed!");
  //     console.log("hai hloo", result);
  //     console.log("hai hoo", orderType);
  //     navigate("/order-confirm", {
  //       state: { confirmationData: result, orderType },
  //     });
  //   } catch (error) {
  //     alert("Failed to confirm order");
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] md:p-6 space-y-6">
      <motion.section
        className="w-full md:max-w-2xl bg-white rounded-xl shadow-lg md:p-6 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[15px] md:text-2xl font-semibold text-center text-[#00CED1]">
          Checkout
        </h1>

        {/* Order Type Buttons */}
        <div className="flex justify-center gap-4 my-6 mx-4 md:mx-auto">
          <button
            className={`w-[200px] text-[10px] md:text-xl py-2 rounded-full font-medium border border-gray-50 md:w-[300px] ${
              orderType === "Home Delivery"
                ? "bg-[#00CED1] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setOrderType("Home Delivery")}
          >
            Home Delivery
          </button>
          <button
            className={`w-[200px] text-[10px] md:text-xl py-2 rounded-full font-medium border border-gray-50 md:w-[300px] ${
              orderType === "Take Away"
                ? "bg-[#00CED1] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setOrderType("Take Away")}
          >
            Take Away
          </button>
        </div>

        <Address
          onSelectAddress={(selectedAddress) =>
            setSelectedAddress(selectedAddress)
          }
        />

        {/* Instruction to Rider */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Instructions (if any)"
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm"
          />
        </div>

        {/* Cart Items */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Added Items</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            cartItems.map(([productId, item]) => (
              <div
                key={productId}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-gray-700 font-bold">
                    ₹ {item.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-200 w-8 h-8 rounded-full font-bold text-red-500"
                    onClick={() => decrement(productId, item?.variantTypeId)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="bg-gray-200 w-8 h-8 rounded-full font-bold text-green-500"
                    onClick={() => increment(productId, item?.variantTypeId)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Instruction to Merchant */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Instruction to merchant"
            value={merchantInstruction}
            onChange={(e) => setMerchantInstruction(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm"
          />
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmOrder}
          className="w-full bg-teal-500 text-white py-4 rounded-full font-semibold text-lg"
        >
          Confirm Order detail
        </button>
      </motion.section>
    </div>
  );
};

export default CheckoutPage;
