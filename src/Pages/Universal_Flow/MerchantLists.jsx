import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../BaseURL";

const MerchantLists = React.memo = (() => {
  const { state } = useLocation();
  const { businessCategoryId, category } = state || {};

  const [merchantList, setMerchantList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMerchants = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Component mounted with state:", { businessCategoryId, token });

      if (!businessCategoryId || !token) {
        console.warn("Missing businessCategoryId or token.");
        return;
      }

      try {
        setIsLoading(true);
        const latitude = 8.495721;
        const longitude = 76.995264;

        console.log("Sending request with:", { latitude, longitude, businessCategoryId, token });

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

        console.log("Merchant API response:", response.data);
        setMerchantList(response.data || []);
      } catch (error) {
        console.error("Error fetching merchants:", error.response?.data || error.message);
        setMerchantList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, [businessCategoryId]);

  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold text-left mb-6">{category}</h2>
      {isLoading ? (
        <p>Loading merchants...</p>
      ) : (
        <div className="grid grid-cols-2 p-12 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {merchantList.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No merchants found.</p>
          ) : (
            merchantList.map((merchant, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden shadow-md">
                <img
                  src={merchant.merchantImageURL || "/default-merchant.jpg"}
                  alt={merchant.merchantName}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-black/30 text-white p-4">
                  <div className="flex justify-between rounded-lg">
                    <h3 className="text-lg font-semibold">{merchant.merchantName}</h3>
                    <span className="text-sm font-medium">{merchant.displayAddress || "Unknown"}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-sm">{merchant.rating || "5.0"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});

MerchantLists.displayName = "MerchantLists";
export default MerchantLists;
