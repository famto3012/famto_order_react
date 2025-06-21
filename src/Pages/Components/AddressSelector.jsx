import { useState } from "react";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import { useEffect } from "react";
import {
  fetchCustomerAddress,
  submitAddress,
} from "../../services/Pick_Drop/pickdropService";
import MapModal from "../Mappls/MapModal";

const AddressSelector = ({
  onPickupSelect = () => {},
  onDropSelect = () => {},
  onPickupInstructionChange = () => {},
  onDeliveryInstructionChange = () => {},
}) => {
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [selectedPickupOtherId, setSelectedPickupOtherId] = useState(null);
  const [selectedDropOtherId, setSelectedDropOtherId] = useState(null);
  const [formPurpose, setFormPurpose] = useState(null); // "pickup" or "drop"

  const [showMapModal, setShowMapModal] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  const [formVisible, setFormVisible] = useState(false);
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
  const [instructionData, setInstructionData] = useState({
    instructionInPickup: "",
    instructionInDelivery: "",
  });
  const loadAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

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

  // useEffect(() => {
  //   const loadAddresses = async () => {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) return;
  //     const res = await fetchCustomerAddress(token);
  //     console.log(res);

  //     const formatted = {
  //       Home: res.homeAddress
  //         ? {
  //             fullName: res.homeAddress.fullName,
  //             phone: res.homeAddress.phoneNumber,
  //             flat: res.homeAddress.flat,
  //             street: res.homeAddress.area,
  //             nearby: res.homeAddress.landmark,
  //             addressType: "home",
  //           }
  //         : null,
  //       Work: res.workAddress
  //         ? {
  //             fullName: res.workAddress.fullName,
  //             phone: res.workAddress.phoneNumber,
  //             flat: res.workAddress.flat,
  //             street: res.workAddress.area,
  //             nearby: res.workAddress.landmark,
  //             addressType: "work",
  //           }
  //         : null,
  //       Others:
  //         res.otherAddress?.map((addr) => ({
  //           id: addr._id || addr.id, // Use _id directly if available
  //           fullName: addr.fullName,
  //           phone: addr.phoneNumber,
  //           flat: addr.flat,
  //           street: addr.area,
  //           nearby: addr.landmark,
  //           addressType: "other",
  //         })) || [],
  //     };
  //     setAddressList(formatted);
  //   };
  //   loadAddresses();
  // }, []);

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

  const handleSelectPickup = (type, id = null) => {
    if (type === "other" && id != null) {
      const selectedAddr = addressList.Others.find((addr) => addr.id === id);
      setSelectedPickup("other");
      setSelectedPickupOtherId(id);
      console.log("hai", selectedAddr.id);
      onPickupSelect(selectedAddr);
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
      setSelectedDrop(isSelected === selectedDrop ? null : selectedDrop);
      onPickupSelect?.(isSelected ? address : null);
    }
  };

  const handleSelectDrop = (type, id = null) => {
    if (type === selectedPickup && id === selectedPickupOtherId) return;

    if (type === "other" && id != null) {
      const selectedAddr = addressList.Others.find((addr) => addr.id === id);
      setSelectedDrop("other");
      setSelectedDropOtherId(id);
      onDropSelect(selectedAddr);
      return;
    } else {
      const address =
        type === "home"
          ? addressList.Home
          : type === "work"
          ? addressList.Work
          : null;

      const isSelected = selectedDrop === type ? null : type;
      setSelectedDrop(isSelected);
      setSelectedDropOtherId(null);
      onDropSelect?.(isSelected ? address : null);
    }
  };

  const handleInstructionChange = (e) => {
    const { name, value } = e.target;
    setInstructionData({ ...instructionData, [name]: value });

    // Notify parent about instructions
    if (name === "instructionInPickup") {
      onPickupInstructionChange(value);
    }
    if (name === "instructionInDelivery") {
      onDeliveryInstructionChange(value);
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("User not authenticated.");
      return;
    }

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
        onPickupSelect(updatedFormData);
        console.log("haiii", updatedFormData);
      } else if (formPurpose === "drop") {
        setSelectedDrop(formData.type);
        if (formData.type === "other") {
          setSelectedDropOtherId(updatedFormData.id);
        }
        onDropSelect(updatedFormData);
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

  // const handleSave = async () => {
  //   const token = localStorage.getItem("authToken");
  //   if (!token) {
  //     alert("User not authenticated.");
  //     return;
  //   }

  //   const updatedFormData = {
  //     ...formData,
  //     coordinates: [formData.latitude, formData.longitude],
  //   };

  //   try {
  //     await submitAddress(
  //       formData.addressType,
  //       formData.fullName,
  //       formData.phone,
  //       formData.flat,
  //       formData.street,
  //       formData.nearby,
  //       [formData.latitude, formData.longitude],
  //       token
  //     );

  //     // Save locally for UI update
  //     setAddressList((prev) => {
  //       if (formData.addressType === "other") {
  //         return { ...prev, Others: [...prev.Others, updatedFormData] };
  //       } else {
  //         return { ...prev, [formData.addressType]: updatedFormData };
  //       }
  //     });

  //     onPickupSelect?.(updatedFormData);
  //     setFormVisible(false);
  //     setSelectedPickup(formData.addressType);

  //     // Reset form
  //     setFormData({
  //       fullName: "",
  //       phone: "",
  //       flat: "",
  //       street: "",
  //       nearby: "",
  //       addressType: "home",
  //       latitude: "",
  //       longitude: "",
  //     });

  //     console.log("Saved address to backend and local state:", updatedFormData);
  //   } catch (error) {
  //     alert("Failed to save address. Please try again.");
  //     console.error(error);
  //   }
  // };

  const handleNewPickAddress = (updatedFormData) => {
    setPickAndDropData({
      ...pickAndDropData,
      newPickupAddress: updatedFormData,
      pickUpAddressType: null,
      pickUpAddressOtherAddressId: null,
    });
  };

  const handleToggleNewPickAddress = () => {
    setPickAndDropData({
      ...pickAndDropData,
      pickUpAddressType: null,
      pickUpAddressOtherAddressId: null,
    });
    setPickAddressType(null);
    setPickAddressId(null);
    setClearSignal(true);
  };
  return (
    <div className="max-w-7xl mx-auto mt-12 ">
      <p className="font-[600] mb-5 text-[24px] ">Pick Up</p>
      {/* Buttons Row */}
      <div className="flex  items-center justify-between ">
        {[
          {
            label: "HOME",
            type: "home",
            icon:(
               <HomeOutlinedIcon className="hidden md:inline text-2xl" />
            ),
          },
          {
            label: "WORK",
            type: "work",
            icon: (
              <WorkOutlineOutlinedIcon className="hidden md:inline text-2xl" />
            ),
          },
          {
            label: "OTHERS",
            type: "other",
            icon: (
              <MapsHomeWorkOutlinedIcon className="hidden md:inline text-2xl" />
            ),
          },
          {
            label: "ADD",
            type: "add",
            icon: (
              <>
                <AddLocationAltOutlinedIcon className="hidden md:inline text-xl" />{" "}
              </>
            ),
          },
        ].map(({ type, icon, label }) => (
          <button
            key={type}
            type="button"
            className={`py-2 px-4 flex flex-row items-center justify-center gap-2 rounded-lg  text-md md:text-[20px] transition ${
              selectedPickup === type
                ? "bg-[#00ced1] text-white "
                : "bg-gray-300"
            }
             ${type === "add" ? "w-[50px] md:w-[20%]" : "w-[25%] md:w-[20%]"}
            `}
            onClick={() =>
              type === "add"
                ? (setFormPurpose("pickup"), setFormVisible(true))
                : handleSelectPickup(type)
            }
          >
               <span className={`${type === "add" ? "inline" : "hidden md:inline"}`}>{icon}</span> <span className={`${type === "add" ? "hidden md:inline" : "inline"}`}>{label}</span>
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

      <input
        type="text"
        name="instructionInPickup"
        placeholder="Instructions to Pick up"
        value={instructionData.instructionInPickup}
        onChange={handleInstructionChange}
        className="w-full p-4 border border-gray-300 rounded my-8"
      />
      {selectedPickup && (
        <div>
          <p className="font-[600] mb-5 text-[24px]">Drop</p>
          <div className="flex items-center justify-between">
            {[
              {
                label: "HOME",
                type: "home",
                icon:(
               <HomeOutlinedIcon className="hidden md:inline text-2xl" />
                ),
              },
              {
                label: "WORK",
                type: "work",
                icon: (
              <WorkOutlineOutlinedIcon className="hidden md:inline text-2xl" />
            ),
              },
              {
                label: "OTHERS",
                type: "other",
                icon: (
              <MapsHomeWorkOutlinedIcon className="hidden md:inline text-2xl" />
            ),
              },
              {
                label: "ADD",
                type: "add",
              icon: (
              <>
                <AddLocationAltOutlinedIcon className="hidden md:inline text-xl" />{" "}
              </>
            ),
              },
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                type="button"
                className={`py-2 px-4 flex flex-row items-center justify-center gap-2 rounded-lg  text-md md:text-[20px] transition ${
                  selectedDrop === type
                    ? "bg-[#00ced1] text-white "
                    : "bg-gray-300"
                }
               ${type === "add" ? "w-[50px] md:w-[20%]" : "w-[25%] md:w-[20%]"}
                `}
                onClick={() =>
                  type === "add"
                    ? (setFormPurpose("drop"), setFormVisible(true))
                    : handleSelectDrop(type)
                }
              >
               <span className={`${type === "add" ? "inline" : "hidden md:inline"}`}>{icon}</span> <span className={`${type === "add" ? "hidden md:inline" : "inline"}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDrop === "home" && addressList.Home && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Home.fullName}</p>
          <p className="text-gray-600">{addressList.Home.phoneNumber}</p>
          <p className="text-gray-600">
            {addressList.Home.flat}, {addressList.Home.area},{" "}
            {addressList.Home.nearby}
          </p>
        </div>
      )}

      {selectedDrop === "work" && addressList.Work && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Work.fullName}</p>
          <p className="text-gray-600">{addressList.Work.phoneNumber}</p>
          <p className="text-gray-600">
            {addressList.Work.flat}, {addressList.Work.area},{" "}
            {addressList.Work.nearby}
          </p>
        </div>
      )}

      {selectedDrop === "other" && addressList.Others.length > 0 && (
        <div className="mt-4 space-y-2">
          {addressList.Others.map((addr) => {
            const isDisabled = addr.id === selectedPickupOtherId;
            const isSelected = selectedDropOtherId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() =>
                  !isDisabled && handleSelectDrop("other", addr.id)
                }
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

      {selectedPickup && (
        <input
          type="text"
          name="instructionInDelivery"
          placeholder="Instructions to Delivery"
          value={instructionData.instructionInDelivery}
          onChange={handleInstructionChange}
          className="w-full p-4 border border-gray-300 rounded my-8"
        />
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

export default AddressSelector;

// const handleSave = () => {
//   setAddressList((prev) => {
//     if (formData.addressType === "other") {
//       return { ...prev, Others: [...prev.Others, formData] };
//     } else {
//       return { ...prev, [formData.addressType]: formData };
//     }
//   });
//   onPickupSelect?.(formData);
//   setFormVisible(false);
//   setSelectedPickup(formData.addressType);
//   setFormData({
//     fullName: "",
//     phone: "",
//     flat: "",
//     street: "",
//     nearby: "",
//     addressType: "home",
//   });
//   console.log(
//     formData.fullName,
//     formData.phone,
//     formData.flat,
//     formData.nearby,
//     formData.street,
//     formData.addressType,
//   );
//   console.log("Saving:", formData.latitude, formData.longitude);

// };

// const handleSelectPickup = (type) => {
//   const address =
//     type === "home"
//       ? addressList.Home
//       : type === "work"
//       ? addressList.Work
//       : addressList.Others[0]; // you can allow choosing specific one if multiple

//   const isSelected = selectedPickup === type ? null : type;
//   setSelectedPickup(isSelected);
//   setSelectedDrop(isSelected === selectedDrop ? null : selectedDrop);
//   onPickupSelect?.(isSelected ? address : null);
// };

// const handleSelectDrop = (type) => {
//   if (type === selectedPickup) return;
//   const address =
//     type === "home"
//       ? addressList.Home
//       : type === "work"
//       ? addressList.Work
//       : addressList.Others[0];

//   const isSelected = selectedDrop === type ? null : type;
//   setSelectedDrop(isSelected);
//   onDropSelect?.(isSelected ? address : null);
// };
