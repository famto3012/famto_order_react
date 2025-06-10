import axios from "axios";
import BASE_URL from "../../BaseURL";

export const fetchMerchantsByCategory = async (businessCategoryId, token, latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/filter-and-search-merchants`, {
      params: {
        latitude,
        longitude,
        businessCategoryId,
        page: 1,
        limit: 1000,
      },
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error("Merchant fetch failed:", error.response?.data || error.message);
    return [];
  }
};

export const fetchMerchantData = async (merchantId) => {
  const latitude = 8.56123;
  const longitude = 71.86224;
  try {
    const response = await axios.get(`${BASE_URL}/customers/merchant-data`, {
      params: {
        merchantId,
        longitude,
        latitude
      },
      withCredentials: true
    });
    console.log("Merchant-data", response.data);
    return response.data || [];

  } catch (error) {
    console.log("Merchant data failed :", error.response.data || error.message);
  }
}