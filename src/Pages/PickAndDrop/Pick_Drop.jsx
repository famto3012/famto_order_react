import React, { useState } from "react";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import AddressSelector from "../Components/AddressSelector";
import CategoryGrid from "../Components/Categories";
import { Card, CardContent } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { FiTrash } from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";

const Pick_Drop = (React.memo = () => {

  const [savedPackages, setSavedPackages] = useState({}); // Store selected packages
  const [selected, setSelected] = useState("");

  const categories = [
    {id: 0,name: "Documents & Parcels", image: "/order/documents_parcels.jpg"},
    { id: 1, name: "Foods & Groceries", image: "/order/food_groceries.png" },
    { id: 2, name: "Clothing & Laundry", image: "/order/laundry.jpeg" },
    { id: 3, name: "Medical Supplies", image: "/order/medical_supplies.jpg" },
    { id: 4, name: "Personal Items", image: "/order/personal_items.png" },
    { id: 5, name: "Gifts & Flowers", image: "/order/gift_flowers.jpeg" },
    { id: 6, name: "Electronics", image: "/order/electronics.jpg" },
    { id: 7, name: "Books & Stationary", image: "/order/books_stationery.jpg" },
    { id: 8, name: "Online Orders", image: "/order/online_orders.jpg" },
    { id: 9, name: "Pet Supplies", image: "/order/pet_supplies.jpg" },
    { id: 10, name: "Automotive Parts", image: "/order/automative_parts.jpg" },
    { id: 11, name: "Others", image: "/order/delivery_boys.png" },
  ];

  const handleSavePackage = (newData) => {
    setSavedPackages(newData);
    console.log("Saved Package Data:", newData);
  };

  const handleSelect = (vehicle) => {
    setSelected(vehicle);
    console.log(vehicle);
  };
  
  return (
    <>
      <main>
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Banner Section with Background Image */}
          <div
            className="relative p-10 rounded-lg bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/order/delivery_motorvehicle.jpg')`,
            }}
          >
            {/* Overlay Behind Content (Prevents Affecting Cards) */}
            <div className="absolute inset-0 bg-white opacity-80 rounded-lg z-0"></div>
            {/* Content Wrapper */}
            <div className="relative flex items-center justify-between z-10">
              {/* Information Cards */}
              <div className="flex flex-col gap-6 mt-6 w-1/2">
                {/* Heading */}
                <p className="text-[15px] md:text-[36px] font-[600] z-10">
                  From Your Door to Their Door
                </p>

                {/* Card 1 */}
                <div className="bg-[#00ced1] flex flex-col px-8 py-4 shadow-lg rounded-[50px]  self-start">
                  <p className="text-[18px] font-[500] text-white">
                    Forgot something at home?
                  </p>
                  <p className="text-[14px] text-white">
                    Give us a pickup address
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#00ced1] flex flex-col px-8 py-4 shadow-lg rounded-[50px]  self-end">
                  <p className="text-[18px] font-[500] text-white">
                    Delivery boys available anytime
                  </p>
                  <p className="text-[14px] text-white">
                    Our delivery agents are at your service
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#00ced1] flex flex-col px-8 py-4 shadow-lg rounded-[50px]  self-center">
                  <p className="text-[18px] font-[500] text-white">
                    Fast and safe delivery
                  </p>
                  <p className="text-[14px] text-white">
                    We ensure safe & fast delivery every time
                  </p>
                </div>
              </div>

              {/* Image Section */}
              <div className="relative w-80 h-80 shadow-lg bg-[#0D0D1F] rounded-lg overflow-hidden">
                <img
                  src="/order/delivery boys.png"
                  alt="Delivery Boys"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col md:flex-row items-center justify-center  mt-12 relative gap-20 max-w-6xl mx-auto">
          <div className="w-1/2 bg-gray-200 px-10 py-6 rounded-l-full relative">
            <p className="font-[600] text-[20px] ms-5 md:ms-0">
              {" "}
              Choose Pick Up Location
            </p>
            <div className="flex items-center gap-5 mt-2">
              <PersonPinCircleOutlinedIcon
                sx={{ fontSize: 42 }}
                className="md:mb-0 mb-12 md:mx-0 mx-auto"
              />
              <button className="bg-[#00ced1] text-white font-semibold px-4 py-2 md:mb-0 mb-12 rounded-full">
                Kesavadasapuram
              </button>
            </div>
          </div>

          <div className="bg-white rounded-full p-8  absolute z-10">
            <img src="/order/jeep.png" alt="truck" className="w-20 h-20" />
          </div>
          <div className="w-1/2 bg-gray-200 px-10 py-6 rounded-r-full relative ">
            <p className="font-[600] text-[20px] ms-5 md:m-0 mt-8 md:mt-0">
              {" "}
              Choose Drop Location
            </p>
            <div className="flex items-center  gap-5 mt-2">
              <PersonPinCircleOutlinedIcon
                sx={{ fontSize: 42 }}
                className="md:mb-0 mb-12 md:mx-0 mx-auto"
              />
              <button className="bg-[#00ced1] text-white font-semibold px-4 py-2 md:mb-0 mb-12 rounded-full">
                Kesavadasapuram
              </button>
            </div>
          </div>
        </div>
        <AddressSelector />
        <CategoryGrid onSavePackage={handleSavePackage} />
        {/* Display Saved Packages */}
        <div className="max-w-5xl mx-auto  grid-cols-1 sm:grid-cols-2 md:grid md:grid-cols-3 gap-4 mt-18">
          {Object.keys(savedPackages).map((key) => {
            const packageData = savedPackages[key];
            const category = categories.find((cat) => cat.id === parseInt(key));

            if (!category) return null;

            return (
              <Card
                key={category.id}
                sx={{
                  width: "320px",
                  borderRadius: "20px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                }}
                className=""
              >
                <CardContent className="text-center">
                  <div className="flex flex-row  justify-between gap-5">
                    <p className="my-4 font-semibold text-center">
                      {category.name}
                    </p>
                    <div className="flex items-center gap-5">
                      <FiEdit className="text-[#00CED1] text-[25px]" />
                      <FiTrash className="text-red-400 text-[25px]" />
                    </div>
                  </div>

                  <div className="flex ">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-14 mx-auto rounded-lg"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm text-gray-600">
                        Dimensions: {packageData.length} x {packageData.width} x{" "}
                        {packageData.height} cm
                      </p>
                      <p className="text-sm text-gray-600">
                        ⚖️ Weight: {packageData.weight} kg
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="max-w-6xl mx-auto my-18 text-[15px] md:text-[24px] font-[600] text-start">
          Vehicle Type
        </p>

        <div className="max-w-4xl mx-auto  grid-cols-1 md:grid md:grid-cols-2 gap-4 mt-18">
          <Card
            sx={{
              width: "400px",
              borderRadius: "20px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CardContent className="text-center">
              <div className="flex justify-between items-center">
                <img src="order\motorcycle.gif" className="h-24 rounded-lg" />
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-[500] text-start"> Bike</p>
                  <p className="text-sm text-gray-600"> 7.1 kms | 50 min </p>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <LiaRupeeSignSolid />
                  <p className="text-[24px] font-[600] text-start">45.02</p>
                </div>
                <input
                  type="radio"
                  name="vehicle"
                  checked={selected === "Bike"}
                  onChange={() => handleSelect("Bike")}
                  className="h-5 w-5 accent-blue-500"
                />
              </div>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: "400px",
              borderRadius: "20px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CardContent className="text-center">
              <div className="flex justify-between items-center">
                <img src="order\scooter.gif" className="h-24 rounded-lg" />
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-[500] text-start"> Scooter</p>
                  <p className="text-sm text-gray-600"> 7.1 kms | 50 min </p>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <LiaRupeeSignSolid />
                  <p className="text-[24px] font-[600] text-start">45.02</p>
                </div>
                <input
                  type="radio"
                  name="vehicle"
                  checked={selected === "Scooter"}
                  onChange={() => handleSelect("Scooter")}
                  className="h-5 w-5 accent-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
});

Pick_Drop.displayName = "Pick_Drop";

export default Pick_Drop;
