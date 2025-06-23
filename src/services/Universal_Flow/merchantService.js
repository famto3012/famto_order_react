import axios from "axios";
import BASE_URL from "../../BaseURL";
import securedAxios from "../../utils/SecuredAxios";

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
    const response = await axios.get(
      `${BASE_URL}/customers/merchant-data`,
      {
        params: {
          merchantId,
          longitude,
          latitude,
        },
      }
    );
    console.log("Merchant-data", response.data);
    return response.data || [];
  } catch (error) {
    console.log("Merchant data failed :", error.response.data || error.message);
  }
};

export const toggleMerchantFavourite = async (
  merchantId,
  businessCategoryId
) => {
  const token = localStorage.getItem("authToken");
  console.log("Token", token);
  try {
    const data = await securedAxios.patch(
      `${BASE_URL}/customers/toggle-merchant-favorite/${merchantId}/${businessCategoryId}`,
      {}
    );
    console.log("Favourite Merchant", data);
    return data.data || [];
  } catch (error) {}
};
