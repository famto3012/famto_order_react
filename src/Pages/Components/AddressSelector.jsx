import { useState } from "react";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
const AddressSelector = () => {

    const [selectedPickup, setSelectedPickup] = useState(null);
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [addressList, setAddressList] = useState({
        Home: null,
        Work: null,
        Others: []
    });
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        flat: "",
        street: "",
        nearby: "",
        addressType: "",
        pickupInstructions: "",
        deliveryInstructions: "",
    });

    const handleSelectPickup = (type) => {
        setSelectedPickup(type === selectedPickup ? null : type);
        if (selectedDrop === type) setSelectedDrop(null);
    };

    const handleSelectDrop = (type) => {
        if (type !== selectedPickup) {
            setSelectedDrop(type === selectedDrop ? null : type);
        }
    };
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSave = () => {
        setAddressList((prev) => {
            if (formData.addressType === "Others") {
                return { ...prev, Others: [...prev.Others, formData] };
            } else {
                return { ...prev, [formData.addressType]: formData };
            }
        });

        setFormVisible(false);
        setSelectedPickup(formData.addressType);
        setFormData({
            fullName: "",
            phone: "",
            flat: "",
            street: "",
            nearby: "",
            addressType: "Home",
            pickupInstructions: "",
            deliveryInstructions: "",
        });
        console.log(formData.fullName, formData.phone, formData.flat, formData.nearby, formData.street, formData.addressType);

    };

    return (
        <div className="max-w-6xl mx-auto mt-12 ">
            <p className="font-[600] mb-5 text-[24px] ">Pick Up</p>
            {/* Buttons Row */}
            <div className="flex items-center justify-between  ">
                {[
                    { type: "Home", icon: <HomeOutlinedIcon fontSize="large" /> },
                    { type: "Work", icon: <WorkOutlineOutlinedIcon fontSize="large" /> },
                    { type: "Others", icon: <MapsHomeWorkOutlinedIcon fontSize="large" /> },
                    { type: "Add", icon: <AddLocationAltOutlinedIcon fontSize="large" /> },
                ].map(({ type, icon }) => (
                    <button
                        key={type}
                        type="button"
                        className={`py-3 px-20 rounded-lg  transition ${selectedPickup === type ? "bg-[#00ced1] text-white text-[20px]" : "bg-gray-300 text-[20px]"
                            }`}
                        onClick={() => (type === "Add" ? setFormVisible(true) : handleSelectPickup(type))}
                    >
                        {icon} {type}
                    </button>
                ))}
            </div>

            {formVisible && (
                <div className="mt-8 space-y-4">
                    <div className="flex items-center">
                        <label className="w-1/3">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-2/3 p-2 border border-gray-300 rounded "
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/3">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-2/3 p-2 border border-gray-300 rounded "
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/3">Flat/House no/Floor/Building</label>
                        <input
                            type="text"
                            name="flat"
                            placeholder="Flat, Apartment, House No."
                            value={formData.flat}
                            onChange={handleInputChange}
                            className="w-2/3 p-2 border border-gray-300 rounded "
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/3">Area/Sector/Locality*</label>
                        <input
                            type="text"
                            name="street"
                            placeholder="Street, Locality"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="w-2/3 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/3">Nearby landmark (optional)</label>
                        <input
                            type="text"
                            name="nearby"
                            placeholder="Nearby Landmark"
                            value={formData.nearby}
                            onChange={handleInputChange}
                            className="w-2/3 p-2 border border-gray-300 rounded "
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="w-1/3">Labelled as</label>
                        <div className="mb-4 flex gap-4 ">
                            {["Home", "Work", "Others"].map((type) => (
                                <label key={type} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="addressType"
                                        value={type}
                                        checked={formData.addressType === type}
                                        onChange={handleInputChange}
                                        className="accent-[#00ced1] w-2/3"
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className=" bg-[#00ced1] text-white p-3 rounded-lg font-semibold "
                        >
                            Save Address
                        </button>
                    </div>
                </div>
            )}

            {selectedPickup === "Home" && addressList.Home && (
                <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
                    <p className="font-semibold">{addressList.Home.fullName}</p>
                    <p className="text-gray-600">{addressList.Home.phone}</p>
                    <p className="text-gray-600">{addressList.Home.flat}, {addressList.Home.street}, {addressList.Home.nearby}</p>
                </div>
            )}

            {selectedPickup === "Work" && addressList.Work && (
                <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
                    <p className="font-semibold">{addressList.Work.fullName}</p>
                    <p className="text-gray-600">{addressList.Work.phone}</p>
                    <p className="text-gray-600">{addressList.Work.flat}, {addressList.Work.street}, {addressList.Work.nearby}</p>
                </div>
            )}

            {selectedPickup === "Others" && addressList.Others.length > 0 && (
                <div className="mt-4 space-y-2">
                    {addressList.Others.map((addr, index) => (
                        <div key={index} className="p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
                            <p className="font-semibold">{addr.fullName}</p>
                            <p className="text-gray-600">{addr.phone}</p>
                            <p className="text-gray-600">{addr.flat}, {addr.street}, {addr.nearby}</p>
                        </div>
                    ))}
                </div>
            )}

            <input
                type="text"
                name="instructions"
                placeholder="Instructions to Pick up"
                value={formData.pickupInstructions}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded my-8"
            />
            {selectedPickup && (
                <div>
                    <p className="font-[600] mb-5 text-[24px]">Drop</p>
                    <div className="flex items-center justify-between  ">
                        {[
                            { type: "Home", icon: <HomeOutlinedIcon fontSize="large" /> },
                            { type: "Work", icon: <WorkOutlineOutlinedIcon fontSize="large" /> },
                            { type: "Others", icon: <MapsHomeWorkOutlinedIcon fontSize="large" /> },
                            { type: "Add", icon: <AddLocationAltOutlinedIcon fontSize="large" /> },
                        ].map(({ type, icon }) => (
                            <button
                                key={type}
                                type="button"
                                className={`py-3 px-20 rounded-lg transition ${selectedDrop === type ? "bg-[#00ced1] text-white text-[20px]" : "bg-gray-300 text-[20px]"
                                    }`}
                                onClick={() => (type === "Add" ? setFormVisible(true) : handleSelectDrop(type))}
                            >
                                {icon} {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}
               {selectedPickup && (
            <input
                type="text"
                name="text"
                placeholder="Instructions to Delivery"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded my-8"
            />
               )}
        </div>

    );
};

export default AddressSelector;
