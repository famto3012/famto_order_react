// import { useEffect, useState } from "react";
// import { fetchTemporaryOrders } from "../services/Universal_Flow/universalService";
// import { cancelOrderById } from "../services/Universal_Flow/universalService"; // Optional: If cancel API exists

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [AllOrders, setAllOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const data = await fetchTemporaryOrders();
//         setOrders(data);
//       } catch (error) {
//         console.log("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

// const handleCancelOrder = async (orderId, deliveryMode) => {
//   try {
//     await cancelOrderById(orderId, deliveryMode);

//     // Remove canceled order from the list
//     setOrders((prev) => prev.filter((order) => order._id !== orderId));
//   } catch (error) {
//     console.error("Error canceling order:", error);
//   }
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white via-gray-100 to-white p-6">
//       <h2 className="text-2xl font-bold mb-6 text-teal-700 text-center">
//         Your Temporary Orders
//       </h2>

//       {orders.length === 0 ? (
//         <p className="text-center text-gray-500">No temporary orders found.</p>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
//             >
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 Your order is preparing
//               </h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 Order ID: <span className="font-mono text-teal-600">{order._id}</span>
//               </p>
//               <p className="text-sm text-gray-600 mb-4">
//                 delivery Mode: <span className="font-mono text-teal-600">{order.deliveryMode}</span>
//               </p>
//               <button
//                 onClick={() => handleCancelOrder(order._id, order.deliveryMode)}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//               >
//                 Cancel Order
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersPage;


import { useEffect, useState } from "react";
import { fetchTemporaryOrders, cancelOrderById } from "../services/Universal_Flow/universalService";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { motion } from "framer-motion";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

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

  const handleCancelOrder = async (orderId, deliveryMode) => {
    try {
      await cancelOrderById(orderId, deliveryMode);
      setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-6">
      {/* App Download Promo Section */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-teal-600 text-white rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between shadow-xl"
      >
        <div className="mb-4 md:mb-0 max-w-lg">
          <h2 className="text-3xl font-bold mb-2">🚀 Experience More with the Famto App</h2>
          <p className="text-base opacity-90">
            Get real-time tracking, faster updates, exclusive offers and more — available only on our app!
          </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="https://play.google.com/store/apps/details?id=com.famto.customerapp&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <FaGooglePlay size={20} />
            Play Store
          </a>
          <a
            href="https://apps.apple.com/in/app/famto-food-delivery-shopping/id6747160693"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <FaApple size={20} />
            App Store
          </a>
        </div>
      </motion.div>

      {/* Orders Header */}
      {/* <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-8 text-teal-700 text-center"
      >
        🧾 Your Temporary Orders
      </motion.h2> */}

      {/* Orders Section */}
      {orders.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          No temporary orders found.
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform duration-300 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                🛒 Order is being prepared
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Order ID:</span>{" "}
                <span className="font-mono text-teal-600">{order._id}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Delivery Mode:</span>{" "}
                <span className="font-mono text-teal-600">{order.deliveryMode}</span>
              </p>
              <button
                onClick={() => handleCancelOrder(order.orderId, order.deliveryMode)}
                className="w-full py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
              >
                Cancel Order
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrdersPage;
