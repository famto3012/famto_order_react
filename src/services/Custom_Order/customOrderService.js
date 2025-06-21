import axios from "axios";
import BASE_URL from "../../BaseURL";
import securedAxios from "../../utils/SecuredAxios";

export const addShop = async (payload) => {

  try {
    const resposne = await securedAxios.post(
      `${BASE_URL}/customers/add-shop`,
      payload,
    );
    if (resposne.status === 200) {
      return resposne.data && resposne.status;
    } else if (resposne.status === 401) {
      return resposne.status;
    }
  } catch (error) {
    console.log("Error in add shop", error);
  }
};

export const addItem = async (payload) => {
  const token = localStorage.getItem(`authToken`);
  try {
    const response = await axios.post(
      `${BASE_URL}/customers/add-item`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(`Error in add item`, error);
  }
};

export const updateItem = async (itemId, payload) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.put(
      `${BASE_URL}/customers/edit-item/${itemId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return true; // You can return response.data if you need it
    }
  } catch (error) {
    console.log("Error in update item", error);
  }

  return false;
};

export const addAddressData = async (formData) => {

  try {
    const response = await securedAxios.post(
      `${BASE_URL}/customers/add-delivery-address`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      console.log("Add Delivery Address Success", response.data);
      return response.data;
    } else {
      console.warn("Unexpected response:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Add Address API Error:", error.response?.data || error.message);
    return null;
  }
};


export const confirmCustomOrder = async (cartId) => {
  console.log("Cart ID in controller", cartId);
  const token = localStorage.getItem(`authToken`);
  try {
    const response = await axios.post(
      `${BASE_URL}/customers/confirm-custom-order`,
      {
        cartId: cartId,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    if(response.status === 200) {
      return response.status
    }
    return response.data;
  } catch (error) {}
};

export const getCartItems = async (itemId) => {
  const token = localStorage.getItem(`authToken`);
  try {
    const response = await axios.get(
      `${BASE_URL}/customers/get-item/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error in fetch item cart`);
  }
};

export const fetchCustomCartBill = async (cartId) => {
  console.log("cartId in controller",cartId);
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get(`${BASE_URL}/customers/custom-cart-bill`, {
      params: { cartId },
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200 ? response.data : null;
  } catch (err) {
    console.error("Error in getting custom order bill:", err);
    return null;
  }
};

export const addCustomTipPromo = async(cartId , orderType ,tip) => {
  const token = localStorage.getItem(`authToken`);
  try {
    const data = await axios.post(`${BASE_URL}/customers/add-custom-tip-and-promocode`,{
      addedTip : tip
    },{
      headers : {
        Authorization : `Bearer ${token}`
      },
      withCredentials: true
    });
    return data.data;
  } catch (error) {
    console.log(error);
  }
}