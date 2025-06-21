import axios from "axios";
import BASE_URL from "../../BaseURL";
import securedAxios from "../../utils/SecuredAxios";

export const fetchCategories = async () => {
  const { data, status } = await securedAxios.post(
    `${BASE_URL}/customers/all-business-categories`,
    { latitude: 8.495721, longitude: 76.995264 }
  );
  if (status === 200) return data.data || [];
  return [];
};

export const fetchMerchantCategories = async (
  merchantId,
  businessCategoryId,
  page,
  limit
) => {
  const data = await securedAxios.get(`${BASE_URL}/customers/category`, {
    params: {
      merchantId,
      businessCategoryId,
      page,
      limit,
    },
  });
  console.log("Merchant Categories :", data.data);
  return data.data || [];
};

export const fetchProducts = async (categoryId, page, limit) => {
  const data = await securedAxios.get(`${BASE_URL}/customers/products`, {
    params: {
      categoryId,
      page,
      limit,
    },
  });
  console.log("Products", data.data);
  return data.data || [];
};

export const fetchMerchantBanner = async (merchantId) => {
  const response = await securedAxios.get(
    `${BASE_URL}/customers/merchant-banner/${merchantId}`,
  );
  console.log("Banner", response);
  return response?.data || [];
};

export const searchProducts = async (merchantId, searchText) => {
  try {
    const response = await securedAxios.get(
      `${BASE_URL}/customers/products/filter-and-sort/${merchantId}`,
      {
        params: {
          productName: searchText,
        },
      }
    );
    console.log("Search Results", response.data);
    return response.data;
  } catch (error) {
    console.error("Search error:", error);
  }
};

export const fetchVariants = async (productId) => {
  try {
    const response = await securedAxios.get(
      `${BASE_URL}/customers/merchant/product/${productId}/variants`,
    );
    console.log("Fetched variants", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const sendItemData = async (payload) => {
  try {
    const response = await securedAxios.post(
      `${BASE_URL}/customers/add-items`,
      payload
    );

    console.log("✅ Item added successfully. Status code:", response.status);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error sending item data:",
      error.response?.data || error.message
    );
    throw error; // Let the caller handle the error
  }
};

export const clearCart = async(cartId) => {
  try {
    const resposne = await securedAxios.delete(`${BASE_URL}/customers/clear-cart`,{
      params : {
        cartId : cartId
      }
    });
    console.log('Cart Cleared Succesfully');
    return resposne.data;
  } catch (error) {
    
  }
}

export const updateItemData = async (productId, newQuantity, variantTypeId) => {
  try {
    const response = await securedAxios.put(`${BASE_URL}/customers/update-cart`, {
      productId,
      quantity: newQuantity,
      variantTypeId,
    });

    console.log("🛒 Item updated successfully:", response.status);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating cart item:", error.response?.data || error.message);
    throw error; // so calling code can handle it
  }
};

export const updateCartDetail = async (formData) => {
  console.log("Pay load", formData);
  try {
    const response = await securedAxios.post(`${BASE_URL}/customers/cart/add-details`,
      {
    formData,
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {}
};

export const fetchMapplsAuthToken = async (navigate) => {
  try {
    const response = await securedAxios.get(`${BASE_URL}/token/get-auth-token`, {
    });
    // if (!response.ok) throw new Error("Token fetch failed");

    const data = await response.data;
    console.log("Mappls Token Response:", data.data); // ✅ Add this

    return data?.data; // or adjust based on your response structure
  } catch (error) {
    console.error("Error fetching Mappls token:", error);
    // navigate("/error"); // optional redirect if token fails
    return null;
  }
};

export const fetchBill = async (cartId, token) => {
  try {
    const response = await securedAxios.get(`${BASE_URL}/customers/get-cart-bill`, {
      params: {
        cartId,
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

export const confirmOrder = async (paymentMode, token) => {
  try {
    const response = await securedAxios.post(
      `${BASE_URL}/customers/confirm-order`,
      { paymentMode },
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
export const verifyPayment = async (orderId, amount, token) => {
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

          const res = await securedAxios.post(
            `${BASE_URL}/customers/verify-payment`,
            { paymentDetails },
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

export const fetchTemporaryOrders = async () => {
  try {
    const response = await securedAxios.get(
      `${BASE_URL}/customers/get-temporary-order`,
    );
    if (response.status === 200) {
      console.log("Temporary Orders Fetched Succesfully", response.data);
      return response.data;
    } else if (response.status === 401) {
      console.log("Invalid/Expired Token");
    }
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const cancelOrderById = async (orderId) => {
  try {
    const response = await securedAxios.post(
      `${BASE_URL}/customers/cancel-universal-order`,
      {
        orderId: orderId,
      },
    );
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrders = async () => {
  try {
    const response = await securedAxios.get(`${BASE_URL}/customers/orders`, {
    });
    if (response.status === 200) {
      console.log(`All-Orders fetched Successfully`);
      return response.data;
    } else if (response.status === 401) {
      console.log(`Invalid/Expire Token`);
    }
  } catch (error) {
    console.log(`Error`);
  }
};

export const fetchCustomerCart = async () => {

  try {
    const response = await securedAxios.get(`${BASE_URL}/customers/get-cart`, {
    });
    if (response.status === 200) {
      console.log("Cart Data", response.data);
      return response.data;
    } else if (response.status === 401) {
      console.log(`Invalid/ Expired Token`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchCustomPickTimings = async () => {

  try {
    const response = await securedAxios.get(
      `${BASE_URL}/customers/customization/timings`,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Token may be expired");
    } else {
      console.error("Error fetching custom pick timings:", error.message);
    }
    return null;
  }
};
