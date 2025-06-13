import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { updateCartDetail } from "../../services/Universal_Flow/universalService";


const CheckoutPage = () => {
  const [orderType, setOrderType] = useState("Home-Delivery");
  const [merchantInstruction, setMerchantInstruction] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const { cart } = useCart();
  const cartItems = Object.entries(cart);

  const handleConfirmOrder = async () => {
    const items = cartItems.map(([productId, item]) => ({
      productId,
      quantity: item.quantity,
      variantTypeId: item.variantTypeId || null,
    }));

    const payload = {
      orderType,
      merchantInstruction,
      customerNote,
      items,
    };

    try {
      const result = await updateCartDetail(payload);
      alert("Order confirmed!");
      console.log(result);
    } catch (error) {
      alert("Failed to confirm order");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 md:px-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-center text-teal-600">Checkout</h1>

      {/* Order Type Buttons */}
      <div className="flex justify-center gap-4">
        <button
          className={`px-18 py-2 rounded-full font-medium border ${orderType === "Home-Delivery" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setOrderType("Home-Delivery")}
        >
          Home Delivery
        </button>
        <button
          className={`px-18 py-2 rounded-full font-medium border ${orderType === "Takeaway" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setOrderType("Takeaway")}
        >
          Take Away
        </button>
      </div>

      {/* Address Selection */}
      {orderType === "Home-Delivery" && (
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <span className="text-gray-700 font-medium">Select a Delivery address</span>
          <button className="text-xl text-gray-500">{'>'}</button>
        </div>
      )}

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
            <div key={productId} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-gray-700 font-bold">₹ {item.price * item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-gray-200 w-8 h-8 rounded-full font-bold text-red-500" onClick={() => decrement(productId)}>-</button>
                <span>{item.quantity}</span>
                <button className="bg-gray-200 w-8 h-8 rounded-full font-bold text-green-500" onClick={() => increment(productId)}>+</button>
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
    </div>
  );
};

export default CheckoutPage;
