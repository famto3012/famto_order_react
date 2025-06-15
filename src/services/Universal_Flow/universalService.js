import axios from "axios";
import BASE_URL from "../../BaseURL";
import { useNavigate } from "react-router-dom";


export const fetchCategories = async (token) => {
  const { data, status } = await axios.post(
    `${BASE_URL}/customers/all-business-categories`,
    { latitude: 8.495721, longitude: 76.995264 },
    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
  );
  if (status === 200) return data.data || [];
  return [];
};

export const fetchMerchantCategories = async (merchantId, businessCategoryId, page, limit) => {
  const data = await axios.get(`${BASE_URL}/customers/category`, {
    params: {
      merchantId,
      businessCategoryId,
      page,
      limit
    },
    withCredentials: true
  });
  console.log("Merchant Categories :", data.data);
  return data.data || [];
}

export const fetchProducts = async (categoryId, page, limit) => {
  const data = await axios.get(`${BASE_URL}/customers/products`, {
    params: {
      categoryId,
      page,
      limit
    },
    withCredentials: true
  });
  console.log("Products", data.data);
  return data.data || [];
}

export const fetchMerchantBanner = async (merchantId) => {
  const response = await axios.get(`${BASE_URL}/customers/merchant-banner/${merchantId}`, {
    withCredentials: true
  });
  console.log("Banner", response);
  return response?.data || [];

}

export const searchProducts = async (merchantId, searchText) => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/products/filter-and-sort/${merchantId}`, {
      params: {
        productName: searchText,
      }
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
    const response = await axios.get(`${BASE_URL}/customers/merchant/product/${productId}/variants`,
      { withCredentials: true }
    )
    console.log("Fetched variants", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const sendItemData = async (payload) => {
  const token = localStorage.getItem("authToken");

  console.log('Token', token);

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/customers/add-items`,
      payload,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Status code',response.status);

    if(response.status == 401) {
         throw new Error("User not authenticated");
    }
    return response.data;
  } catch (error) {
    console.error("Error sending item data:", error);
    throw error;
  }
};
export const updateItemData = async (productId, newQuantity, variantTypeId) => {
  const token = localStorage.getItem('authToken');
  try{
    const response = await axios.put(`${BASE_URL}/customers/update-cart`,{
      productId : productId,
      quantity : newQuantity,
      variantTypeId : variantTypeId
    },{
      withCredentials: true,
      headers : {
        Authorization : `Bearer ${token}`
      }
    });
    console.log('Update Items',response.status);
    return response.data;
  } catch (error){
    console.log("error in update items",error);
  }
}


export const updateCartDetail = async(payload) => {
const token = localStorage.getItem('authToken');
console.log('Pay load',payload);
try {
  const response = await axios.post(`${BASE_URL}/customers/cart/add-details`,{
    businessCategoryId: payload.businessCategoryId,
    instructionToMerchant : payload.merchantInstruction,
    instructionToDeliveryAgent : payload.customerNote,
    deliveryMode: payload.orderType,
    deliveryAddressType : "home"
  },{
    headers: {
      Authorization : `Bearer ${token}`
    },
    withCredentials: true
  })
  console.log(response.data);
  return response.data;
} catch (error) {
  
}
}

export const fetchBill = async (cartId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/customers/get-cart-bill`,
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

export const confirmOrder = async (paymentMode, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/customers/confirm-order`,
      { paymentMode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Handle empty (204) response
    if (response.status === 204 || !response.data) {
      return {
        success: true,
        orderId: null,
        amount: null,
      };
    }
console.log("hai",response.data.order_id);

    return response.data;
  } catch (err) {
    console.error("❌ Order creation failed:", err.response?.data || err.message);
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
      image: "https://res.cloudinary.com/dcfj1j1ku/image/upload/v1743054538/Group_427320859_y8jszt.svg",
      handler: async function (response) {
        try {
          const paymentDetails = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const res = await axios.post(
            `${BASE_URL}/customers/verify-payment`,
            { paymentDetails },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (res.status === 200) {
            resolve(res.data); 
            console.log("helo",res.data.orderId);// ✅ Only return result, don't navigate
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