import axios from "axios";
import BASE_URL from "../../BaseURL";


export const fetchCustomerAddress = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/customer-address`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data || [];
  } catch (error) {
    console.error("Address fetch failed:", error.response?.data || error.message);
    return [];
  } 
}; 

