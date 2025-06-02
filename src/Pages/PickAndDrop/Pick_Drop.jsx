import React, { useState } from "react";
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import AddressSelector from "../Components/AddressSelector";
import CategoryGrid from "../Components/Categories";
import { Card, CardContent } from "@mui/material";
import { TbEdit } from "react-icons/tb";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutline";
import { ImBin } from "react-icons/im";


const Pick_Drop = React.memo = (() => {

    const [savedPackages, setSavedPackages] = useState({}); // Store selected packages


    const categories = [
        { id: 0, name: "Documents & Parcels", image: "/order/documents_parcels.jpg" },
        { id: 1, name: "Foods & Groceries", image: "/order/food_groceries.png" },
        { id: 2, name: "Clothing & Laundry", image: "/order/laundry.jpeg" },
        { id: 3, name: "Medical Supplies", image: "/order/medical_supplies.jpg" },
        { id: 4, name: "Personal Items", image: "/order/personal_items.png" },
        { id: 5, name: "Gifts & Flowers", image: "/order/gift_flowers.jpeg" },
        { id: 6, name: "Electronics", image: "/order/electronics.jpg" },
        { id: 7, name: "Household items", image: "/order/household.jpg" },
        { id: 8, name: "Books & Stationary", image: "/order/books_stationery.jpg" },
        { id: 9, name: "Online Orders", image: "/order/online_orders.jpg" },
        { id: 10, name: "Pet Supplies", image: "/order/pet_supplies.jpg" },
        { id: 11, name: "Automotive Parts", image: "/order/automative_parts.jpg" },
        { name: "Others", image: "/order/delivery_boys.png" },
    ];

    const handleSavePackage = (newData) => {
        setSavedPackages(newData);
        console.log("Saved Package Data:", newData);
    };

    return (
        <>
            <main className="">
                
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Banner Section with Background Image */}
                    <div
                        className="relative p-10 rounded-lg bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('/order/delivery_motorvehicle.jpg')` }}
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
                                    <p className="text-[18px] font-[500] text-white">Forgot something at home?</p>
                                    <p className="text-[14px] text-white">Give us a pickup address</p>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-[#00ced1] flex flex-col px-8 py-4 shadow-lg rounded-[50px]  self-end">
                                    <p className="text-[18px] font-[500] text-white">Delivery boys available anytime</p>
                                    <p className="text-[14px] text-white">Our delivery agents are at your service</p>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-[#00ced1] flex flex-col px-8 py-4 shadow-lg rounded-[50px]  self-center">
                                    <p className="text-[18px] font-[500] text-white">Fast and safe delivery</p>
                                    <p className="text-[14px] text-white">We ensure safe & fast delivery every time</p>
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
                        <p className="font-[600] text-[20px] ms-5 md:ms-0"> Choose Pick Up Location</p>
                        <div className="flex items-center gap-5 mt-2">
                            <PersonPinCircleOutlinedIcon sx={{ fontSize: 42 }} className="md:mb-0 mb-12 md:mx-0 mx-auto"/>
                            <button className="bg-[#00ced1] text-white font-semibold px-4 py-2 md:mb-0 mb-12 rounded-full">
                                Kesavadasapuram
                            </button>
                        </div>
                    </div>
                  
                    <div className="bg-white rounded-full p-8  absolute z-10">
                        <img src="/order/jeep.png" alt="truck" className="w-20 h-20" />
                    </div>
                    <div className="w-1/2 bg-gray-200 px-10 py-6 rounded-r-full relative ">
                        <p className="font-[600] text-[20px] ms-5 md:m-0 mt-8 md:mt-0"> Choose Drop Location</p>
                        <div className="flex items-center  gap-5 mt-2">
                            <PersonPinCircleOutlinedIcon sx={{ fontSize: 42 }} className="md:mb-0 mb-12 md:mx-0 mx-auto"/>
                            <button className="bg-[#00ced1] text-white font-semibold px-4 py-2 md:mb-0 mb-12 rounded-full">
                                Kesavadasapuram
                            </button>
                        </div>
                   
                    </div>
                </div>
                <AddressSelector />
                <CategoryGrid onSavePackage={handleSavePackage} />
                {/* Display Saved Packages */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {Object.keys(savedPackages).map((key) => {
                        const packageData = savedPackages[key];
                        const category = categories.find(cat => cat.id === parseInt(key));

                        if (!category) return null;

                        return (
                            <Card key={category.id} sx={{ borderRadius: "20px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" }} className="">
                                <CardContent className="text-center">
                                    <div className="flex flex-row gap-5 items-center justify-center">
                                        <p className="my-4 font-semibold">{category.name}</p>
                                        <TbEdit className="text-[#00CED1] text-[30px]" />
                                        <ImBin className="text-red-400 text-[25px]" />
                                    </div>

                                    <div className="flex ">
                                        <img src={category.image} alt={category.name} className="h-24 mx-auto rounded-lg" />
                                        <div className="flex flex-col justify-center">
                                            <p className="text-sm text-gray-600">
                                                Dimensions: {packageData.length} x {packageData.width} x {packageData.height} cm
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



            </main>
        </>
    )

});

Pick_Drop.displayName = "Pick_Drop";

export default Pick_Drop;


{/* <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 w-1/3 border-t-2 border-dotted border-gray-600"></div> */ }
{/* <div className="bg-gradient-to-b from-[#00ced1] to-white p-10 rounded-[50px] border border-[#008080] shadow-lg">
                        <p className="font-[600] text-[22px]"> Choose Drop Location</p>
                        <div className="flex justify-between items-center gap-5 mt-5">
                            <PersonPinCircleOutlinedIcon sx={{ fontSize: 52 }} />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                className="mt-1 px-2 w-full border rounded-md  placeholder:text-[14px] outline-none focus:outline-none"
                            />
                        </div>
                    </div> */}
{/* <div className="font-[500] text-[#00ced1] ">
                    Pick & Drop
                </div>
                <div className=" mt-12">
                    <div className="bg-[#008080] shadow-lg p-10 rounded-b-[100px] ">
                        <div className="flex items-center justify-between px-30 ">
                            <p className=" text-[15px] md:text-[32px] font-[700] z-10 text-white">
                                FASTEST DELIVERY EASY PICKUP
                            </p>
                            <a href="">
                                <img
                                    src="/order/delivery boys.png"
                                    className=" h-50 w-50"
                                />
                            </a>
                        </div>
                        <div className="flex flex-col gap-6 px-30">
                            <div className="bg-white flex flex-col p-3 shadow-lg rounded-xl">
                                <p className=" text-[20px] ">
                                    Forgot something at home?
                                </p>
                                <p className=" text-[15px]">
                                    Give us a pickup address
                                </p>
                            </div>
                            <div className="bg-white flex flex-col p-3 shadow-lg rounded-xl">
                                <p className=" text-[20px] ">
                                    Delivery boys available anytime
                                </p>
                                <p className=" text-[15px] ">
                                    Our delivery agents are at your service
                                </p>
                            </div>
                            <div className="bg-white flex flex-col p-3 shadow-lg rounded-xl">
                                <p className=" text-[20px]">
                                    Fast and safe delivery
                                </p>
                                <p className=" text-[15px]">
                                    We ensure safe and fast delivery everytime
                                </p>
                            </div>
                        </div>
                    </div>

                </div> */}