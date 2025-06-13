import axios from "axios";
import BASE_URL from "../../BaseURL";


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

    return response.data; // return response if needed
  } catch (error) {
    console.error("Error sending item data:", error);
    throw error; // rethrow if you want to handle it outside
  }
};

export const updateItemData = async (productId, newQuantity) => {
  const token = localStorage.getItem('authToken');
  try{
    const response = await axios.put(`${BASE_URL}/customers/update-cart`,{
      productId : productId,
      quantity : newQuantity
    },{
      withCredentials: true,
      headers : {
        Authorization : `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error){
    console.log(error);
  }
}


export const updateCartDetail = async(payload) => {
const token = localStorage.getItem('authToken');
try {
  const response = await axios.post(`${BASE_URL}/customers/cart/add-details`,payload,{
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