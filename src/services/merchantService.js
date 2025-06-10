import axios from "axios";
import BASE_URL from "../BaseURL";

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
