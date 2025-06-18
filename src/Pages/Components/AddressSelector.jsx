import { useState } from "react";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import { useEffect } from "react";
import { fetchCustomerAddress } from "../../services/Pick_Drop/pickdropService";

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

  const [formVisible, setFormVisible] = useState(false);
  const [addressList, setAddressList] = useState({
    Home: null,
    Work: null,
    Others: [],
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
  const [instructionData, setInstructionData] = useState({
    instructionInPickup: "",
    instructionInDelivery: "",
  });
  useEffect(() => {
    const loadAddresses = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await fetchCustomerAddress(token);
      console.log(res);

      const formatted = {
        Home: res.homeAddress
          ? {
              fullName: res.homeAddress.fullName,
              phone: res.homeAddress.phoneNumber,
              flat: res.homeAddress.flat,
              street: res.homeAddress.area,
              nearby: res.homeAddress.landmark,
              addressType: "home",
            }
          : null,
        Work: res.workAddress
          ? {
              fullName: res.workAddress.fullName,
              phone: res.workAddress.phoneNumber,
              flat: res.workAddress.flat,
              street: res.workAddress.area,
              nearby: res.workAddress.landmark,
              addressType: "work",
            }
          : null,
        Others:
          res.otherAddress?.map((addr) => ({
            id: addr._id || addr.id, // Use _id directly if available
            fullName: addr.fullName,
            phone: addr.phoneNumber,
            flat: addr.flat,
            street: addr.area,
            nearby: addr.landmark,
            addressType: "other",
          })) || [],
      };
      setAddressList(formatted);
    };
    loadAddresses();
  }, []);

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
  const handleSave = () => {
    setAddressList((prev) => {
      if (formData.addressType === "other") {
        return { ...prev, Others: [...prev.Others, formData] };
      } else {
        return { ...prev, [formData.addressType]: formData };
      }
    });
    onPickupSelect?.(formData);
    setFormVisible(false);
    setSelectedPickup(formData.addressType);
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
    console.log(
      formData.fullName,
      formData.phone,
      formData.flat,
      formData.nearby,
      formData.street,
      formData.addressType
    );
  };
  const handleNewPickAddress = (data) => {
    setPickAndDropData({
      ...pickAndDropData,
      newPickupAddress: data,
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
    <div className="max-w-6xl mx-auto mt-12 ">
      <p className="font-[600] mb-5 text-[24px] ">Pick Up</p>
      {/* Buttons Row */}
      <div className="flex items-center justify-between  ">
        {[
          {
            label: "HOME",
            type: "home",
            icon: <HomeOutlinedIcon fontSize="large" />,
          },
          {
            label: "WORK",
            type: "work",
            icon: <WorkOutlineOutlinedIcon fontSize="large" />,
          },
          {
            label: "OTHERS",
            type: "other",
            icon: <MapsHomeWorkOutlinedIcon fontSize="large" />,
          },
          {
            label: "ADD",
            type: "add",
            icon: <AddLocationAltOutlinedIcon fontSize="large" />,
          },
        ].map(({ type, icon, label }) => (
          <button
            key={type}
            type="button"
            className={`py-3 px-20 rounded-lg  transition ${
              selectedPickup === type
                ? "bg-[#00ced1] text-white text-[20px]"
                : "bg-gray-300 text-[20px]"
            }`}
            onClick={() =>
              type === "add" ? setFormVisible(true) : handleSelectPickup(type)
            }
          >
            {icon} {label}
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
              {["home", "work", "other"].map((type) => (
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

      {selectedPickup === "home" && addressList.Home && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Home.fullName}</p>
          <p className="text-gray-600">{addressList.Home.phone}</p>
          <p className="text-gray-600">
            {addressList.Home.flat}, {addressList.Home.street},{" "}
            {addressList.Home.nearby}
          </p>
        </div>
      )}

      {selectedPickup === "work" && addressList.Work && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Work.fullName}</p>
          <p className="text-gray-600">{addressList.Work.phone}</p>
          <p className="text-gray-600">
            {addressList.Work.flat}, {addressList.Work.street},{" "}
            {addressList.Work.nearby}
          </p>
        </div>
      )}

      {selectedPickup === "other" && addressList.Others.length > 0 && (
        <div className="mt-4 space-y-2">
          {addressList.Others.map((addr,index) => {
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
                <p className="text-gray-600">{addr.phone}</p>
                <p className="text-gray-600">
                  {addr.flat}, {addr.street}, {addr.nearby}
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
          <div className="flex items-center justify-between  ">
            {[
              {
                label: "HOME",
                type: "home",
                icon: <HomeOutlinedIcon fontSize="large" />,
              },
              {
                label: "WORK",
                type: "work",
                icon: <WorkOutlineOutlinedIcon fontSize="large" />,
              },
              {
                label: "OTHERS",
                type: "other",
                icon: <MapsHomeWorkOutlinedIcon fontSize="large" />,
              },
              {
                label: "ADD",
                type: "add",
                icon: <AddLocationAltOutlinedIcon fontSize="large" />,
              },
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                type="button"
                className={`py-3 px-20 rounded-lg transition ${
                  selectedDrop === type
                    ? "bg-[#00ced1] text-white text-[20px]"
                    : "bg-gray-300 text-[20px]"
                }`}
                onClick={() =>
                  type === "add" ? setFormVisible(true) : handleSelectDrop(type)
                }
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      )}
      {selectedDrop === "home" && addressList.Home && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Home.fullName}</p>
          <p className="text-gray-600">{addressList.Home.phone}</p>
          <p className="text-gray-600">
            {addressList.Home.flat}, {addressList.Home.street},{" "}
            {addressList.Home.nearby}
          </p>
        </div>
      )}

      {selectedDrop === "work" && addressList.Work && (
        <div className="mt-4 p-4 bg-[#EFFFFF] border border-[#00ced1] rounded-xl text-left">
          <p className="font-semibold">{addressList.Work.fullName}</p>
          <p className="text-gray-600">{addressList.Work.phone}</p>
          <p className="text-gray-600">
            {addressList.Work.flat}, {addressList.Work.street},{" "}
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
                <p className="text-gray-600">{addr.phone}</p>
                <p className="text-gray-600">
                  {addr.flat}, {addr.street}, {addr.nearby}
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
    </div>
  );
};

export default AddressSelector;
