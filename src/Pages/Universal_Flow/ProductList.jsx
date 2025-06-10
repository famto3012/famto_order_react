import { useEffect, useState } from "react";
import { fetchMerchantData } from "../../services/Universal_Flow/merchantService";
import { useLocation } from "react-router-dom";
import "../../styles/Universal_Flow/merchantStyles.css";

const ProductList = (() => {

    const { state } = useLocation();
    const merchantId = state?.merchantId;
    const [merchant, setMerchant] = useState([]);

    useEffect(() => {
        const loadMerchantData = async () => {
            try {
                const data = await fetchMerchantData(merchantId);
                console.log("Merchant", data);
                setMerchant(data);
            } catch (error) {
                console.error("Failed to fetch merchant data:", error);
            }
        };

        loadMerchantData();
    }, [merchantId]);

    return (
        <>
            <main>
                Product List
                <div className="card" onClick={() => navigate("/products", { state: { merchantId: merchant.id } })}
                >
                    <img
                        src={merchant.merchantImage || "order/empty_merchant.png"}
                        alt={merchant.merchantName}
                        className="cardImage"
                        onError={(e) => {
                            e.target.onerror = null; // prevent infinite loop
                            e.target.src = "order/empty_merchant.png";
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
            </main>
        </>
    );
});

ProductList.displayName = "ProductList";
export default ProductList;