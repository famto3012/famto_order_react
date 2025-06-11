// import React, { useEffect, useState } from "react";
// import { fetchMerchantData } from "../../services/Universal_Flow/merchantService";
// import { useLocation } from "react-router-dom";
// import "../../styles/Universal_Flow/merchantStyles.css";
// import { fetchMerchantCategories } from "../../services/Universal_Flow/universalService";

// const ProductList = React.memo = (() => {

//     const { state } = useLocation();
//     const merchantId = state?.merchantId;
//     const businessCategoryId = state?.businessCategoryId;
//     const [merchant, setMerchant] = useState({});
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         const loadInitialData = async () => {
//             try {
//                 // 1. Fetch merchant data
//                 const merchantData = await fetchMerchantData(merchantId);
//                 console.log("Merchant", merchantData);
//                 setMerchant(merchantData);

//                 // 2. Fetch merchant categories
//                 const categoryData = await fetchMerchantCategories(merchantId, businessCategoryId, 1, 200);
//                 console.log("Merchant Categories", categoryData);
//                 setCategories(categoryData || []);
//             } catch (error) {
//                 console.error("Failed to load initial data:", error);
//             }
//         };
//         loadInitialData();
//     }, [merchantId]);

//     return (
//         <>
//             <main>
//                 Product List
//                 <div className="card"
//                 >
//                     <img
//                         src={merchant.merchantImage || "order/empty_merchant.png"}
//                         alt={merchant.merchantName}
//                         className="cardImage"
//                         onError={(e) => {
//                             e.target.onerror = null; // prevent infinite loop
//                             e.target.src = "order/empty_merchant.png";
//                         }}
//                     />
//                     <div className="cardContent">
//                         <div className="cardTitle">
//                             <span>{merchant.merchantName}</span>
//                             <span>{merchant.displayAddress || ""}</span>
//                         </div>
//                         <div className="cardRating">
//                             Rating: {merchant.rating || "5.0"}
//                         </div>
//                     </div>

//                 </div>
//                 <div>
//                   {Array.isArray(categories) && categories.map((item) => {
//                     // Check the actual structure of your category data
//                     const category = item.category || item;
//                     return (
//                         <div key={category.categoryId}>
//                             <h2>{category.categoryName}</h2>
//                         </div>
//                     );
//                 })}


//                 </div>
//             </main>
//         </>
//     );
// });

// ProductList.displayName = "ProductList";
// export default ProductList;



import React, { useEffect, useState } from "react";
import { fetchMerchantData } from "../../services/Universal_Flow/merchantService";
import { useLocation } from "react-router-dom";
import "../../styles/Universal_Flow/merchantStyles.css";
import { fetchMerchantCategories, fetchProducts } from "../../services/Universal_Flow/universalService";
import { IoIosArrowDropright, IoIosArrowDropdown } from "react-icons/io";

const ProductList = () => {
    const { state } = useLocation();
    const merchantId = state?.merchantId;
    const businessCategoryId = state?.businessCategoryId;
    const [merchant, setMerchant] = useState({});
    const [categories, setCategories] = useState([]);
    const [products, setProductData] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Fetch merchant data
                const merchantData = await fetchMerchantData(merchantId);
                console.log("Merchant", merchantData);
                setMerchant(merchantData);

                // 2. Fetch merchant categories
                const categoryData = await fetchMerchantCategories(merchantId, businessCategoryId, 1, 200);
                console.log("Merchant Categories", categoryData);
                // Make sure to set the correct part of the response
                setCategories(categoryData?.data || categoryData || []);


            } catch (error) {
                console.error("Failed to load initial data:", error);
            }
        };
        loadInitialData();
    }, [merchantId, businessCategoryId]);

    const handleClick = async (categoryId) => {
        setSelectedCategoryId(categoryId);
        try {
            const productData = await fetchProducts(categoryId, 1, 200);
            setProductData(productData?.data || []);

        } catch (error) {
            console.log("Error in fetch Products", error);
        }
    }

    return (
        <main className="flex flex-col">
            Product List
            <div className="card">
                <img
                    src={merchant.merchantImage || "order/empty_merchant.png"}
                    alt={merchant.merchantName}
                    className="cardImage"
                    onError={(e) => {
                        e.target.onerror = null;
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
            <div className="flex flex-row">
                <div className="p-[5rem]">
                    {Array.isArray(categories) &&
                        categories.map((item) => {
                            const category = item.category || item;
                            const isSelected = selectedCategoryId === category.categoryId;

                            return (
                                <div
                                    key={category.categoryId}
                                    className={`p-5 cursor-pointer transition-all shadow-sm flex flex-row justify-between items-center
                                    ${isSelected ? "bg-green-500 rounded-lg text-white" : "bg-gray-200 text-black hover:bg-gray-400"}`}

                                    onClick={() => handleClick(category.categoryId)}
                                >
                                    <h2>{category.categoryName}</h2>
                                    {isSelected ? <IoIosArrowDropdown size={25} /> : <IoIosArrowDropright size={25} />}
                                </div>
                            );
                        })}
                </div>

                <div className="p-[5rem] w-[100rem]">
                    <div className="space-y-4"> {/* Adds vertical space between cards */}
                        {Array.isArray(products) && products.map((item) => {
                            const product = item.product || item;
                            return (
                                <div key={product.productId} className="bg-gray-100 rounded-2xl flex flex-row justify-start items-start">
                                    <img src={product.productImageURL} className="h-60 h-50 object-cover" />
                                    <h2 className="p-5 text-2xl">{product.productName}</h2>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </main>
    );
};

ProductList.displayName = "ProductList";
export default ProductList;