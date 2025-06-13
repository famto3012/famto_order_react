import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchMerchantData } from "../../services/Universal_Flow/merchantService";
import {
  fetchMerchantCategories,
  fetchProducts,
  searchProducts,
} from "../../services/Universal_Flow/universalService";

import MerchantCard from "../Components/ProductLists/MerchantCard";
import CategoryList from "../Components/ProductLists/CategoryList";
import ProductCard from "../Components/ProductLists/ProductCard";
import FloatingCart from "../Components/ProductLists/FloatingCart";
import MerchantBanner from "../Components/ProductLists/MerchantBanner";

const ProductList = () => {
  const { state } = useLocation();
  const merchantId = state?.merchantId;
  const businessCategoryId = state?.businessCategoryId;

  const [merchant, setMerchant] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [cart, setCart] = useState({});

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef(null);
  const productRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const merchantData = await fetchMerchantData(merchantId);
        const categoryData = await fetchMerchantCategories(
          merchantId,
          businessCategoryId,
          1,
          200
        );
        const fetchedCategories = categoryData?.data || [];
        const defaultCategoryId =
          fetchedCategories[0]?.category?.categoryId ||
          fetchedCategories[0]?.categoryId;

        setMerchant(merchantData);
        setCategories(fetchedCategories);
        setSelectedCategoryId(defaultCategoryId);

        const productData = await fetchProducts(defaultCategoryId, 1, 200);
        setProducts(productData?.data || []);
      } catch (err) {
        console.error("Load Error:", err);
      }
    };

    loadInitialData();
  }, [merchantId, businessCategoryId]);

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    const productData = await fetchProducts(categoryId, 1, 200);
    setProducts(productData?.data || []);
    setSearchText(""); // clear search on category change
    setTimeout(() => productRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await searchProducts(merchantId, query);
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  }, [merchantId]);

  // 🚀 Single debounce effect in parent only
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, handleSearch]);

  // 🎯 Proper rendering logic
  const productListToRender = searchText.trim() ? searchResults : products;


  console.log('Rendering:', productListToRender);


  return (
    <main className="flex flex-col md:px-18 px-6 py-5 gap-4 bg-white">
      <MerchantCard
        merchant={merchant}
        businessCategoryId={businessCategoryId}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <MerchantBanner merchantId={merchantId} />

      <div className="flex flex-col lg:flex-row gap-16">
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={handleCategoryClick}
        />

        <div ref={productRef} className="w-full lg:w-2/3 space-y-4">
          {productListToRender.length > 0 ? (
            productListToRender.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                cart={cart}
                setCart={setCart}
              />
            ))
          ) : searchText.trim() ? ( // Only show "no results" for searches
            <div className="text-gray-500 text-center text-lg py-10">
              No products found for "{searchText}"
            </div>
          ) : null}
        </div>
      </div>

      <FloatingCart merchantId={merchantId} />
    </main>
  );
};

export default ProductList;
