import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BASE_URL from "../../BaseURL";

const Home_Delivery = React.memo = (() => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, status } = await axios.post(
          `${BASE_URL}/customers/all-business-categories`,
          { latitude: 8.495721, longitude: 76.995264 },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        if (status === 200) setCategories(data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleCategoryClick = (id, title) => {
    navigate("/merchants", { state: { businessCategoryId: id, token, category: title } });
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-start p-4">
       <motion.section
        className="w-full max-w-[85rem] bg-[#0d0d1f] rounded-2xl shadow-lg md:mt-12 justify-center items-end overflow-hidden md:flex relative"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        {/* Left Section */}
        <div className="md:w-1/2 h-96 p-8  text-white flex flex-col justify-center">
          <p className="text-sm text-gray-300">
            Order Restaurant food, takeaway, groceries and etc... .
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
            Feast Your Senses,
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-teal-300">
            Fast and Fresh
          </h2>
          <div className="mt-6">
            <p className="text-sm text-gray-300 mb-2">
              Search for what you need !!!
            </p>
            <div className="flex bg-[#FFFFFF] rounded-4xl">
              <input
                type="text"
                placeholder="e.g. Search for food"
                className="p-3 w-2/3 md:w-3/4 rounded-l-lg text-black focus:outline-none"
              />
              <button className="px-12 py-3 rounded-4xl items-end justify-end text-white font-semibold bg-teal-900">
                Search
              </button>
            </div>
          </div>
        </div>
        <img
          src="/order/home.png"
          alt="Food Delivery"
          className="w-1/2 max-w-sm min-h-3/4 md:max-w-md object-cover hidden absolute items-center justify-center md:flex rounded-lg bg-transparent"
        />

        {/* Right Section */}
        <div className="md:w-1/2 flex bg-[#00ced1] mt-30 rounded-tl-full items-center justify-center p-4 space-x-4">
          <div className="flex flex-col space-y-4 ml-24">
            <div className="bg-white p-4 rounded-lg shadow-lg text-sm ml-6 w-64">
              <p className="font-semibold">We've Received your order!</p>
              <p className="text-xs text-gray-500">
                Awaiting Restaurant acceptance
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg text-sm w-64 ml-24">
              <p className="font-semibold">Order Accepted! ✅</p>
              <p className="text-xs text-gray-500">
                Your order will be delivered shortly
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg text-sm w-64 ml-5">
              <p className="font-semibold">Your rider's nearby 🎉</p>
              <p className="text-xs text-gray-500">
                They're almost there - get ready!
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Category List */}
      <div className="mt-10 text-2xl font-semibold">Select Category</div>
      <motion.div
        className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-5 place-items-center"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {categories.map(({ id, title, bannerImageURL }) => (
          <motion.div
            key={id}
            className="w-60 rounded-2xl hover:shadow-2xl border border-teal-300 shadow-lg bg-[#00CED1] cursor-pointer"
            whileHover={{ scale: 1.085 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(id, title)}
            transition={{ duration: 0.5 }}
          >
            <img src={bannerImageURL} alt={title} className="w-4/5 h-50 object-cover rounded-b-full mx-auto" />
            <div className="bg-black text-white p-3 rounded-b-2xl">
              <h3 className="font-semibold text-center">{title}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
});

Home_Delivery.displayName = "Home_Delivery";
export default Home_Delivery;