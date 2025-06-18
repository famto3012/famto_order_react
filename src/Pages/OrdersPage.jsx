import { useEffect, useState } from "react";
import { fetchTemporaryOrders } from "../services/Universal_Flow/universalService";
import { cancelOrderById } from "../services/Universal_Flow/universalService"; // Optional: If cancel API exists

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [AllOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchTemporaryOrders();
        setOrders(data);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrderById(orderId);

      // Optimistically update UI
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-teal-700 text-center">
        Your Temporary Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No temporary orders found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Your order is preparing
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Order ID: <span className="font-mono text-teal-600">{order._id}</span>
              </p>
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
