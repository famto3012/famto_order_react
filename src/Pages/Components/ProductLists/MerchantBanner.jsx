import { useEffect, useState } from "react";
import { fetchMerchantBanner } from "../../../services/Universal_Flow/universalService";

const MerchantBanner = ({ merchantId }) => {
  const [bannerData, setBannerData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const banner = await fetchMerchantBanner(merchantId);
        setBannerData(banner);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanner();
  }, [merchantId]);

  useEffect(() => {
    if (bannerData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // cleanup
  }, [bannerData]);

  return (
    <main className="px-4 py-2">
      {bannerData.length > 0 && (
        <div className="w-full h-48 overflow-hidden rounded-xl shadow-lg relative">
          <img
            key={currentIndex}
            src={bannerData[currentIndex]?.imageURL}
            alt={`Banner ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/fallback-banner.jpg";
            }}
          />
        </div>
      )}
    </main>
  );
};

export default MerchantBanner;
