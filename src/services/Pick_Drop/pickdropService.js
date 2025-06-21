import axios from "axios";
import BASE_URL from "../../BaseURL";
import securedAxios from "../../utils/SecuredAxios";

// export const fetchCustomerAddress = async (token) => {
//   try {
//     const response = await securedAxios.get(`${BASE_URL}/customers/customer-address`, {
//       withCredentials: true,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data || [];
//   } catch (error) {
//     console.error(
//       "Address fetch failed:",
//       error.response?.data || error.message
//     );
//     return [];
//   }
// };

export const fetchCustomerAddress = async () => {
  try {
    const response = await securedAxios.get("/customers/customer-address");
    return response.data || [];
  } catch (error) {
    console.error(
      "Address fetch failed:",
      error.response?.data || error.message
    );
    return [];
  }
};


export const fetchVehicleCharges = async (cartId) => {
  try {
    const response = await securedAxios.get(
      `${BASE_URL}/customers/get-vehicle-charges`,
      {
        params: {
          cartId,
        },
      }
    );
    return response.data || [];
  } catch (error) {
    console.error(
      "Vehicle Charge fetch failed:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const submitAddress = async (
  type,
  fullName,
  phoneNumber,
  flat,
  area,
  landmark,
  coordinates,
  token
) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/customers/update-address`,
      { type, fullName, phoneNumber, flat, area, landmark, coordinates },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
     return response.data?.address;
  } catch (error) {
    console.error(
      "Adding address Failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const submitPickDropRequest = async (formData, token) => {
  try {
    const response = await securedAxios.post(
      `${BASE_URL}/customers/add-pick-and-drop-address`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // important for FormData
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Pick & Drop request failed:",
      error.response?.data || error.message
    );
    throw error; // rethrow if caller needs to handle errors
  }
};

export const submitUpdateItemRequest = async (items, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customers/add-additional-pick-items`,
      { items },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Pick & Drop request failed:",
      error.response?.data || error.message
    );
    throw error; // rethrow if caller needs to handle errors
  }
};

export const confirmVehicleTypeandCharge = async (
  vehicleType,
  deliveryCharges,
  surgeCharges,
) => {
  try {
    const response = await securedAxios.post(
      `${BASE_URL}/customers/add-pick-and-drop-items`,
      { vehicleType, deliveryCharges, surgeCharges },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Confirm Vehicle Type and Charge failed:",
      error.response?.data || error.message
    );
    throw error; // rethrow if caller needs to handle errors
  }
};

export const applyTip = async (cartId, deliveryMode, tip, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customers/update-tip`,
      { cartId, deliveryMode, tip },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Tip added failed:", error.response?.data || error.message);
    throw error; // rethrow if caller needs to handle errors
  }
};

export const fetchBillCharges = async (cartId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/customers/get-pick-and-drop-bill`,
      {
        params: {
          cartId,
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data || [];
  } catch (error) {
    console.error(
      "bill fetched failed:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const fetchAvailablePromocode = async (deliveryMode, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/get-promocodes`, {
      params: {
        deliveryMode,
      },
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error(
      "bill fetched failed:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const applyPromocode = async (
  cartId,
  deliveryMode,
  promoCode,
  token
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customers/apply-promo`,
      { cartId, deliveryMode, promoCode },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Promocode added failed:",
      error.response?.data || error.message
    );
    throw error; // rethrow if caller needs to handle errors
  }
};

export const removePromocode = async (cartId, deliveryMode) => {
  try {
    const response = await securedAxios.put(
      `${BASE_URL}/customers/remove-promo-code`,
      { cartId, deliveryMode },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Remove Promocode failed:",
      error.response?.data || error.message
    );
    throw error; // rethrow if caller needs to handle errors
  }
};

export const confirmPickAndDropOrder = async (paymentMode) => {
  try {
    const response = await securedAxios.post(
      `${BASE_URL}/customers/confirm-pick-and-drop`,
      paymentMode,
    );

    // Handle empty (204) response
    if (response.status === 204 || !response.data) {
      return {
        success: true,
        orderId: null,
        amount: null,
      };
    }
    console.log("hai", response.data.order_id);

    return response.data;
  } catch (err) {
    console.error(
      "❌ Order creation failed:",
      err.response?.data || err.message
    );
    return { success: false, orderId: null };
  }
};
export const verifyPickAndDropPayment = async (orderId, amount, token) => {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_APP_RAZORPAY_KEY,
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      name: "Famto",
      description: "Order Payment",
      order_id: orderId,
      image:
        "https://res.cloudinary.com/dcfj1j1ku/image/upload/v1743054538/Group_427320859_y8jszt.svg",
      handler: async function (response) {
        try {
          const paymentDetails = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const res = await axios.post(
            `${BASE_URL}/customers/verify-pick-and-drop`,
            { paymentDetails },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (res.status === 200) {
            resolve(res.data);
            console.log("helo", res.data.orderId); // ✅ Only return result, don't navigate
          } else {
            reject(new Error("Backend verification failed"));
          }
        } catch (error) {
          console.error("❌ Backend verification failed:", error);
          reject(error);
        }
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#00CED1" },
    });

    rzp.open();
  });
};

export const cancelOrder = async (orderId, token) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/customers/cancel-pick-and-drop-order`,
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.status === 200
      ? res.data
      : { success: false, message: "Order not found or already confirmed" };
  } catch (err) {
    alert("❌ Order already confirmed or not found");
    console.error("❌ Error in cancelling order:", err);
    return { success: false, message: "Error while cancelling order" };
  }
};
// export const confirmPickAndDropOrder = async (paymentMode, token) => {
//   try {
//     console.log("Calling API with:", paymentMode, token);
//     const response = await axios.post(
//       `${BASE_URL}/customers/confirm-pick-and-drop`,
//       { paymentMode },
//       {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (response.status === 204) {
//       return { success: true, orderId: "unknown", amount: 0 };
//     }

//     return res.data || { success: false, orderId: "" };
//     // console.log("API Response:", res.status, res.data);
//     // return response.status === 200
//     //   ? response.data
//     //   : { success: false, orderId: "" };

//   } catch (error) {
//     console.error("❌ API Error:", err.response?.data || err.message);
//     console.error(
//       "Error in confirming pick and drop:",
//       error.response?.data || error.message
//     );
//     return { success: false, orderId: "" };
//   }
// };
// export const verifyPickAndDropPayment = async (orderId, amount, token) => {
//   try {
//     const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;

//     if (!razorpayKey) {
//       throw new Error("Razorpay key missing in environment variables.");
//     }
//     console.log(razorpayKey);
//     const amountInPaise = Math.round(Number(amount) * 100);

//     const options = {
//       key: razorpayKey,
//       amount: amountInPaise,
//       currency: "INR",
//       name: "Famto",
//       description: "Order Payment",
//       order_id: orderId,
//       image:
//         "https://res.cloudinary.com/dcfj1j1ku/image/upload/v1743054538/Group_427320859_y8jszt.svg",
//       handler: async function (response) {
//         const paymentDetails = {
//           razorpay_order_id: response.orderId,
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_signature: response.razorpay_signature,
//         };

//         try {
//           const res = await axios.post(
//             `${BASE_URL}/customers/verify-pick-and-drop`,
//             { paymentDetails },
//             {
//               withCredentials: true,
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           return res.status === 200
//             ? res.data
//             : { success: false, orderId: "", createdAt: "" };
//         } catch (error) {
//           console.error(
//             "Error verifying payment:",
//             error.response?.data || error.message
//           );
//           return { success: false, orderId: "", createdAt: "" };
//         }
//       },
//       prefill: {
//         name: "",
//         email: "",
//         contact: "",
//       },
//       theme: {
//         color: "#00CED1",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (error) {
//     console.error("Error in verifying payment:", error.message);
//     return { success: false, orderId: "", createdAt: "" };
//   }
// };
// export const verifyPickAndDropPayment = async (orderId, amount, token) => {
//   try {

//     // if (!razorpayKey) {
//     //   throw new Error("Razorpay key is missing in .env");
//     // }

//     const amountInPaise = Math.round(Number(amount) * 100);

//     const options = {
//       key: import.meta.env.VITE_APP_RAZORPAY_KEY,
//       amount: amountInPaise,
//       currency: "INR",
//       name: "Famto",
//       description: "Order Payment",
//       order_id: orderId,
//       image:
//         "https://res.cloudinary.com/dcfj1j1ku/image/upload/v1743054538/Group_427320859_y8jszt.svg",
//       handler: async function (response) {
//         const paymentDetails = {
//           razorpay_order_id: response.razorpay_order_id,
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_signature: response.razorpay_signature,
//         };

//         try {
//           const res = await axios.post(
//             `${BASE_URL}/customers/verify-pick-and-drop`,
//             { paymentDetails },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//               withCredentials: true,
//             }
//           );

//           if (res.status === 200) {
//             alert("✅ Payment verified and order confirmed!");
//           } else {
//             alert("❌ Payment verification failed.");
//           }
//         } catch (err) {
//           console.error("❌ Backend verification failed:", err);
//           alert("❌ Payment verification failed.");
//         }
//       },
//       prefill: {
//         name: "",
//         email: "",
//         contact: "",
//       },
//       theme: {
//         color: "#00CED1",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (err) {
//     console.error("❌ Razorpay init error:", err);
//     alert("❌ Could not start payment. Check console.");
//   }
// };
