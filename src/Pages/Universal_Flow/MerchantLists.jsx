// src/components/MerchantLists/MerchantLists.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMerchantsByCategory } from "../../services/merchantService.js";
import "../../styles/merchantStyles.css";

const MerchantLists = React.memo = (() => {
  const { state } = useLocation();
  const { businessCategoryId, category } = state || {};
  const [merchantList, setMerchantList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMerchants = async () => {
      const token = localStorage.getItem("authToken");
      if (!businessCategoryId || !token) return;

      setIsLoading(true);
      const latitude = 8.495721;
      const longitude = 76.995264;

      const data = await fetchMerchantsByCategory(businessCategoryId, token, latitude, longitude);
      setMerchantList(data);
      setIsLoading(false);
    };

    loadMerchants();
  }, [businessCategoryId]);

  return (
    <div className="container">
      <h2 className="title">{category}</h2>
      {isLoading ? (
        <p>Loading merchants...</p>
      ) : (
        <div className="grid">
          {merchantList.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No merchants found.</p>
          ) : (
            merchantList.map((merchant, index) => (
              <div key={index} className="card" onClick={() => navigate("/products")}>
                <img
                  src={merchant.merchantImageURL || "public/order/empty_merchant.png"}
                  alt={merchant.merchantName}
                  className="cardImage"
                   onError={(e) => {
                e.target.onerror = null; // prevent infinite loop
                e.target.src = "public/order/empty_merchant.png";
              }}
                />
                <div className="cardContent">
                  <div className="cardTitle">
                    <span>{merchant.merchantName}</span>
                    <span>{merchant.displayAddress || ""}</span>
                  </div>
                  <div className="cardRating">
                    Rating: {merchant.rating || "5.0"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
);

MerchantLists.displayName = "MerchantLists";
export default MerchantLists;
