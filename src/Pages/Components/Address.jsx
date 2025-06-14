import { useEffect, useState } from "react";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import { fetchCustomerAddress } from "../../services/Pick_Drop/pickdropService";
import { useNavigate } from "react-router-dom";

const Address = ({onSelectAddress}) => {
    const navigate = useNavigate();
    const [formVisible, setFormVisible] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [addressList, setAddressList] = useState({ home: null, work: null, other: [] });
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        flat: "",
        street: "",
        nearby: "",
        addressType: "home",
        pickupInstructions: "",
        deliveryInstructions: "",
        latitude: 8.92234,
        longitude : 79.39199
    });

    // Load addresses on mount
    useEffect(() => {
        const loadAddresses = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) 
            navigate('/login');
            const res = await fetchCustomerAddress(token);

            setAddressList({
                home: res.homeAddress ? mapAddress(res.homeAddress, "home") : null,
                work: res.workAddress ? mapAddress(res.workAddress, "work") : null,
                other: res.otherAddress?.map(addr => mapAddress(addr, "other")) || [],
            });
        };
        loadAddresses();
    }, []);

    const mapAddress = (data, type) => ({
        fullName: data.fullName,
        phone: data.phoneNumber,
        flat: data.flat,
        street: data.area,
        nearby: data.landmark,
        addressType: type,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
   const handleSave = () => {
    const updated = { ...addressList };
    const newAddress = { ...formData, isNew: true }; // ✅ Add isNew flag

    if (formData.addressType === "other") {
        updated.other = [...addressList.other, newAddress];
        setAddressList(updated);
        setSelectedPickup("other");
        onSelectAddress([...addressList.other, newAddress]); // send full "other"
    } else {
        updated[formData.addressType] = newAddress;
        setAddressList(updated);
        setSelectedPickup(formData.addressType);
        onSelectAddress(newAddress); // send single saved address
    }

    setFormVisible(false);
    setFormData({
        fullName: "",
        phone: "",
        flat: "",
        street: "",
        nearby: "",
        addressType: "home",
        pickupInstructions: "",
        deliveryInstructions: "",
    });
};


    const handleSelectPickup = (type) => {
        const newSelected = type === selectedPickup ? null : type;
        setSelectedPickup(newSelected);

        if (newSelected === "other") {
            onSelectAddress(addressList.other); // send full list of others if selected
        } else {
            onSelectAddress(addressList[newSelected]);
        }
    };


    const AddressCard = ({ data }) => (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
            <p className="font-semibold">{data.fullName}</p>
            <p className="text-gray-600">{data.phone}</p>
            <p className="text-gray-600">
                {data.flat}, {data.street}, {data.nearby}
            </p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-2">
            <h2 className="font-medium text-xl mb-6">Select Delivery Address</h2>

            {/* Address buttons */}
            <div className="flex flex-wrap gap-4">
                {[
                    { type: "home", icon: <HomeOutlinedIcon fontSize="large" />, disabled: !addressList.home },
                    { type: "work", icon: <WorkOutlineOutlinedIcon fontSize="large" />, disabled: !addressList.work },
                    {
                        type: "others",
                        icon: <MapsHomeWorkOutlinedIcon fontSize="large" />,
                        disabled: addressList.other.length === 0,
                    },
                    {
                        type: "Add",
                        icon: <AddLocationAltOutlinedIcon fontSize="large" />,
                        disabled: false,
                    },
                ].map(({ type, icon, disabled }) => (
                    <button
                        key={type}
                        type="button"
                        disabled={disabled}
                        className={`w-full sm:w-[48%] md:w-[22%] py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-[16px] transition 
        ${selectedPickup === type ? "bg-[#00ced1] text-white" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#00bcbc]"}`}
                        onClick={() =>
                            !disabled && (type === "Add" ? setFormVisible(true) : handleSelectPickup(type))
                        }
                    >
                        {icon} {type}
                    </button>
                ))}
            </div>



            {/* Address Form */}
            {formVisible && (
                <div className="space-y-4 mb-6 mt-6">
                    {[
                        { label: "Full Name", name: "fullName", placeholder: "Full Name" },
                        { label: "Phone Number", name: "phone", placeholder: "Phone Number" },
                        { label: "Flat/House No", name: "flat", placeholder: "Flat, Apartment, House No." },
                        { label: "Area/Sector", name: "street", placeholder: "Street, Locality" },
                        { label: "Nearby landmark", name: "nearby", placeholder: "Nearby Landmark" },
                    ].map(({ label, name, placeholder }) => (
                        <div key={name} className="flex flex-col md:flex-row items-center gap-2">
                            {/* <label className="w-1/3 min-w-[120px] font-medium">{label}</label> */}
                            <input
                                type="text"
                                name={name}
                                value={formData[name]}
                                onChange={handleInputChange}
                                placeholder={placeholder}
                                className="flex-1 p-2 border border-gray-300 rounded-2xl"
                            />
                        </div>
                    ))}

                    {/* Address Type Radio */}
                    <div className="flex items-center gap-4">
                        <label className="w-1/3 font-medium">Labelled as</label>
                        <div className="flex gap-4">
                            {["home", "work", "others"].map((type) => (
                                <label key={type} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="addressType"
                                        value={type}
                                        checked={formData.addressType === type}
                                        onChange={handleInputChange}
                                        className="accent-[#00ced1]"
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-[#00ced1] text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            Save Address
                        </button>
                    </div>
                </div>
            )}

            {/* Selected Address Display */}
            {selectedPickup === "home" && addressList.home && <AddressCard data={addressList.home} />}
            {selectedPickup === "work" && addressList.work && <AddressCard data={addressList.work} />}
            {selectedPickup === "other" &&
                addressList.other.map((addr, index) => <AddressCard key={index} data={addr} />)}
        </div>
    );
};

export default Address;
