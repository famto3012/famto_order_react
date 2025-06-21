import { useEffect, useState } from "react";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import { fetchCustomerAddress, submitAddress } from "../../services/Pick_Drop/pickdropService";
import { useNavigate } from "react-router-dom";
import MapModal from "../Mappls/MapModal";

const Address = ({ onSelectAddress = () => {}, }) => {
  const navigate = useNavigate();
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedPickupOtherId, setSelectedPickupOtherId] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
   const [formPurpose, setFormPurpose] = useState(null);
  const [addressList, setAddressList] = useState({
    Home: null,
    Work: null,
    Others: [],
  });
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    flat: "",
    area: "",
    nearby: "",
    type: "",
    latitude: "",
    longitude: "",
  });
  const loadAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/login");

    try {
      const res = await fetchCustomerAddress(token);
      const formatted = {
        Home: res.homeAddress
          ? {
              id: res.id,
              fullName: res.homeAddress.fullName,
              phoneNumber: res.homeAddress.phoneNumber,
              flat: res.homeAddress.flat,
              area: res.homeAddress.area,
              nearby: res.homeAddress.landmark,
              type: "home",
              coordinates: res.homeAddress.coordinates || [],
            }
          : null,
        Work: res.workAddress
          ? {
              id: res.id,
              fullName: res.workAddress.fullName,
              phoneNumber: res.workAddress.phoneNumber,
              flat: res.workAddress.flat,
              area: res.workAddress.area,
              nearby: res.workAddress.landmark,
              type: "work",
              coordinates: res.workAddress.coordinates || [],
            }
          : null,
        Others:
          res.otherAddress
            ?.map((addr) => {
              if (!addr) return null; // skip undefined entries

              return {
                id: addr.id,
                fullName: addr.fullName || "",
                phoneNumber: addr.phoneNumber || "",
                flat: addr.flat || "",
                area: addr.area || "",
                nearby: addr.landmark || "",
                type: "other",
                coordinates: Array.isArray(addr.coordinates)
                  ? addr.coordinates
                  : [],
              };
            })
            .filter(Boolean) || [],
      };
      setAddressList(formatted);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleLocationSelect = ({ lat, lng }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setLatitude(lat);
    setLongitude(lng);
    setShowMapModal(false);
    console.log("✅ Coordinates saved in formData:", lat, lng);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSave = async () => {
          const token = localStorage.getItem("authToken");
    if (!token) navigate("/login");
  
      try {
        const savedAddress = await submitAddress(
          formData.type,
          formData.fullName,
          formData.phoneNumber,
          formData.flat,
          formData.area,
          formData.nearby,
          [formData.latitude, formData.longitude],
          token
        );
  
        const updatedFormData = {
          ...savedAddress,
          type: formData.type,
          id: savedAddress.id,
          isNewAddress: true, 
        };
  
        // ✅ OPTIONAL: Re-fetch address list from backend
        await loadAddresses();
  
        // Auto-select the newly saved address
        if (formPurpose === "pickup") {
          setSelectedPickup(formData.type);
          if (formData.type === "other") {
            setSelectedPickupOtherId(updatedFormData.id);
          }
          onSelectAddress(updatedFormData);
          console.log("haiii", updatedFormData);
        } 
  
        setFormVisible(false);
  
        setFormData({
          fullName: "",
          phoneNumber: "",
          flat: "",
          area: "",
          nearby: "",
          type: "",
          latitude: "",
          longitude: "",
        });
  
        alert("Address saved successfully!");
      } catch (error) {
        alert("Failed to save address. Please try again.");
        console.error(error);
      }
    };
//   const handleSave = () => {
//     const updated = { ...addressList };
//     const newAddress = { ...formData, isNew: true }; // ✅ Add isNew flag

//     if (formData.addressType === "other") {
//       updated.other = [...addressList.other, newAddress];
//       setAddressList(updated);
//       setSelectedPickup("other");
//       onSelectAddress([...addressList.other, newAddress]); // send full "other"
//     } else {
//       updated[formData.addressType] = newAddress;
//       setAddressList(updated);
//       setSelectedPickup(formData.addressType);
//       onSelectAddress(newAddress); // send single saved address
//     }

//     setFormVisible(false);
//     setFormData({
//       fullName: "",
//       phone: "",
//       flat: "",
//       street: "",
//       nearby: "",
//       addressType: "home",
//       pickupInstructions: "",
//       deliveryInstructions: "",
//     });
//   };

  const handleSelectPickup = (type, id = null) => {
    if (type === "other" && id != null) {
      const selectedAddr = addressList.Others.find((addr) => addr.id === id);
      setSelectedPickup("other");
      setSelectedPickupOtherId(id);
      console.log("hai", selectedAddr.id);
      onSelectAddress(selectedAddr);
      return;
    } else {
      const address =
        type === "home"
          ? addressList.Home
          : type === "work"
          ? addressList.Work
          : null;

      const isSelected = selectedPickup === type ? null : type;
      setSelectedPickup(isSelected);
      setSelectedPickupOtherId(null);
      onSelectAddress?.(isSelected ? address : null);
    }
  };


  return (
    <div className="max-w-5xl mx-auto px-4 py-2">
      <h2 className="font-medium text-[20px] mb-6">Select Delivery Address</h2>

      {/* Address buttons */}
      <div className="flex flex-wrap gap-4">
        {[
          {
             label: "HOME",
            type: "home",
            icon: <HomeOutlinedIcon fontSize="medium" />,
            disabled: !addressList.Home,
          },
          {
             label: "WORK",
            type: "work",
            icon: <WorkOutlineOutlinedIcon fontSize="medium" />,
            disabled: !addressList.Work,
          },
          {
             label: "OTHERS",
            type: "other",
            icon: <MapsHomeWorkOutlinedIcon fontSize="medium" />,
            disabled: addressList.Others.length === 0,
          },
          {
             label: "ADD",
            type: "add",
            icon: <AddLocationAltOutlinedIcon fontSize="medium" />,
            disabled: false,
          },
        ].map(({ type, icon, disabled,label }) => (
          <button
            key={type}
            type="button"
            disabled={disabled}
            className={`w-full sm:w-[48%] md:w-[22%] py-2 px-4 rounded-2xl flex items-center justify-center gap-2 text-[16px] transition 
           ${
              selectedPickup === type
                ? "bg-[#00ced1] text-white text-[20px]"
                : "bg-gray-300 text-[20px]"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#00bcbc]"}`}
            onClick={() =>
              !disabled &&
              (type === "add" ? (setFormPurpose("pickup"), setFormVisible(true)): handleSelectPickup(type))
            }
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {selectedPickup === "home" && addressList.Home && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Home.fullName}</p>
          <p className="text-gray-600">{addressList.Home.phoneNumber}</p>
          <p className="text-gray-600">
            {addressList.Home.flat}, {addressList.Home.area},{" "}
            {addressList.Home.nearby}
          </p>
        </div>
      )}

      {selectedPickup === "work" && addressList.Work && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Work.fullName}</p>
          <p className="text-gray-600">{addressList.Work.phoneNumber}</p>
          <p className="text-gray-600">
            {addressList.Work.flat}, {addressList.Work.area},{" "}
            {addressList.Work.nearby}
          </p>
        </div>
      )}

      {selectedPickup === "other" && addressList.Others.length > 0 && (
        <div className="mt-4 space-y-2">
          {addressList.Others.map((addr, index) => {
            const isSelected = selectedPickupOtherId === addr.id;
            return (
              <div
                key={addr.id || index}
                onClick={() => handleSelectPickup("other", addr.id)}
                className={`p-4 border  rounded-xl text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#EFFFFF] border-[#00ced1]"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <p className="font-semibold">{addr.fullName}</p>
                <p className="text-gray-600">{addr.phoneNumber}</p>
                <p className="text-gray-600">
                  {addr.flat}, {addr.area}, {addr.nearby}
                </p>
              </div>
            );
          })}
        </div>
      )}
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
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
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
                    name="area"
                    placeholder="Street, Locality"
                    value={formData.area}
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
                    {["home", "work", "other"].map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={handleInputChange}
                          className="accent-[#00ced1] w-2/3"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="w-1/3">Select Location</label>
                  <button
                    className="primary-btn mt-2"
                    onClick={() => {
                      setSelectedSource("map");
                      setShowMapModal(true);
                    }}
                  >
                    Mark Location
                  </button>
                </div>
      
                <MapModal
                  isOpen={showMapModal}
                  onClose={() => setShowMapModal(false)}
                  onLocationSelect={handleLocationSelect}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className=" bg-[#00ced1] text-white p-3 rounded-lg font-semibold hover:bg-black "
                  >
                    Save Address
                  </button>
                </div>
              </div>
            )}
    </div>
  );
};

export default Address;
