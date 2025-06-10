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

export const fetchMerchantCategories = async() => {
  const data = await axios.get(`${BASE_URL}/customers/category`, {
    params : {
      merchantId,
      businessCategoryId,
      page,
      limit
    };
    if(status === 200) return data.data || [];
  })
}
