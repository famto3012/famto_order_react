import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import deliveryAnimation from "../assets/delivery-gif.json";
import pickAnimation from "../assets/pick.json";
import customAnimation from "../assets/custom.json";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";

const HomePage = React.memo(() => {
  const navigate = useNavigate();

  const [showFirst, setShowFirst] = useState(true);

  // Toggle between two texts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 2000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const text1Variants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
  };

  const text2Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 },
  };

  return (
    <main className="bg-gradient-to-b from-[#00CED1] via-white to-white min-h-screen p-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <img
            src="/order/black_logo.png"
            alt="Famto Logo"
            className="w-18 h-6"
          />
        </div>
        {/* <Lottie animationData={burgerAnimation} className="w-10 h-10"/> */}
       <button
  className="px-4 py-2 rounded-lg bg-white text-black shadow-md hover:bg-gray-100"
  onClick={() => navigate('/login')}  // ✅ This delays execution until click
>
  Login
</button>

      </header>

      <div style={{ textAlign: "center", marginTop: "10px" , minHeight: "120px"}}>
        <AnimatePresence mode="wait">
          {showFirst ? (
            <motion.div
              key="text1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={text1Variants}
              transition={{ duration: 0.1 }}
            >
              <h1 className="font-[500] text-[#00CED1] text-[14px] md:text-[26px] bg-gradient-to-r to-black from-[#008080] bg-clip-text text-transparent">
                Explore our fast and reliable delivery services
              </h1>
            </motion.div>
          ) : (
            <motion.div
              key="text2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={text2Variants}
              transition={{ duration: 0.1 }}
            >
              <h1 className="font-[500] text-[#00ced1] text-[14px] md:text-[26px] bg-gradient-to-r from-[#008080] to-black bg-clip-text text-transparent">
                One-Stop Solution for Everything you need
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "HOME DELIVERY",
            icon: deliveryAnimation, // Pass imported JSON
            route: "/home-delivery",
            isLottie: true,
          },
          {
            title: "PICK & DROP",
            icon: pickAnimation,
            route: "/pick-drop",
            isLottie: true,
          },
          {
            title: "CUSTOM ORDER",
            icon: customAnimation,
            route: "/custom-order",
            isLottie: true,
          },
        ].map((service, index) => (
          <div
            key={index}
            className="relative h-100 bg-white hover:bg-teal-300 p-6 shadow-md rounded-2xl flex flex-col items-center hover:shadow-xl transition cursor-pointer overflow-visible"
            onClick={() => navigate(service.route)}
          >
            {/* Curved Effect */}
            <div className="absolute top-0 left-10 right-10 h-60 bg-gray-100 rounded-b-full"></div>

            {/* Icon */}
            {service.isLottie ? (
              <Lottie
                animationData={service.icon} // Now passing valid animation data
                className="w-80 h-80 bottom-32 relative z-10"
              />
            ) : (
              <img
                src={service.icon}
                alt={service.title}
                className="w-32 h-32 relative z-10 mb-4"
              />
            )}

            {/* Title */}
            <h3 className="font-extrabold relative bottom-10  z-10 ">
              {service.title}
            </h3>
          </div>
        ))}
      </section>

      {/* Download Section */}
      <section className="flex flex-col md:flex-row items-center pr-11 justify-between bg-teal-700 rounded-2xl text-white">
        <div>
          <img
            src="/order/app.png"
            alt="Famto App Preview"
            className="w-40 md:w-1/2 h-full"
          />
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold mb-2">
            Download the Famto app!
          </h3>
          <div className="flex gap-4">
            <div className="mt-5 flex gap-2">
              <a href="">
                <img
                  src="/order/play-store.png"
                  className="p-1 h-12 border md:border-gray-800 rounded-lg border-white"
                />
              </a>
              <a href="">
                <img
                  src="/order/app-store.png"
                  className="p-1 h-12 border md:border-gray-800 rounded-lg border-white"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

HomePage.displayName = "HomePage";

export default HomePage;
