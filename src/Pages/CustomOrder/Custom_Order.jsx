import { useState } from "react";
import CustomCheckout from "../Components/CustomCheckout";
import "../../styles/Universal_Flow/CustomOrderStyles.css";
import Address from "../Components/Address";
import { useNavigate } from "react-router-dom";
import MapModal from "../Mappls/MapModal";
import {
  addAddressData,
  addItem,
  addShop,
  updateItem,
} from "../../services/Custom_Order/customOrderService";

const CustomOrder = () => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantityCount] = useState(1);
  const [numOfUnits, setQuantityValue] = useState("");
  const [unit, setUnit] = useState("gm");
  const [instructions, setInstructions] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null); // 'anywhere' or 'map'
  const [store, setStore] = useState("");
  const [place, setPlace] = useState("");
  const [showMapModal, setShowMapModal] = useState(false); // for modal
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isShopSaved, setIsShopSaved] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItemData, setEditItemData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(cartItems.length === 0);

  const handleAddToCart = async () => {
    if (!itemName) return alert("Please enter item name");

    const itemPayload = {
      itemName,
      quantity,
      numOfUnits,
      unit,
      instructions,
      itemImage: imageFile ? URL.createObjectURL(imageFile) : null,
      source: selectedSource,
      store: selectedSource === "map" ? store : null,
      place: selectedSource === "map" ? place : null,
    };

    const result = await addItem(itemPayload);

    if (result && Array.isArray(result.items)) {
      console.log("Item response", result);

      // Replace cart with the updated items
      setCartItems(result.items);

      // Clear input fields
      setItemName("");
      setQuantityCount(1);
      setQuantityValue("");
      setUnit("gm");
      setInstructions("");
      setImageFile(null);
      setStore("");
      setPlace("");
      document.getElementById("imageUpload").value = "";
    } else {
      alert("Failed to add item");
    }
  };

  const handleLocationSelect = ({ lat, lng }) => {
    // setStore(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    // setPlace("Custom selected location");
    setLatitude(lat);
    setLongitude(lng);
    setShowMapModal(false);
    console.log("Cordiantes in Custom order", lat, lng);
  };

  const handleSaveShop = async () => {
    if (!store || !place || latitude === null || longitude === null) {
      alert("Please select a location on map and fill in store and place.");
      return;
    }

    const payload = {
      latitude,
      longitude,
      shopName: store,
      place,
      buyFromAnyWhere: false,
    };

    const result = await addShop(payload);
    if (result === 200) {
      setIsShopSaved(true);
    }
    console.log("Shop save result:", result);
  };

  const handleDeleteItem = (itemId) => {
    console.log(itemId);
    const updatedItems = cartItems.filter((item) => item.itemId !== itemId);
    setCartItems(updatedItems);
  };

  const handleEditItem = (item) => {
    setEditItemData(item);
    setEditModalVisible(true);
  };

//   const handleSave = async () => {
//     const payload = {
//       selectedAddress,
//       instructions,
//     };
// console.log("ADDRESS DATa",payload.selectedAddress.type);
//     const response = await addAddressData(payload);
//     setSaveButtonClicked(true);
//     console.log(response);
//     setCartId(response?.cartId);
//     if (response?.cartId) {
//       navigate("/custom-checkout", {
//         state: {
//           cartId: response?.cartId, // ✅ pass it here
//           confirmationData: response, // if needed later
//         },
//       });
//     } else {
//       alert("Error in add addrss");
//     }
//     console.log(response?.cartId);
//   };


const handleSave = async () => {
  console.log("Selected Address", selectedAddress);

  try {
    const formDataToSend = new FormData();

    // Always required
    formDataToSend.append("deliveryAddressType", selectedAddress?.type || "");

    // Only if type is "other"
    if (selectedAddress?.type === "other") {
      if (selectedAddress?.id && !selectedAddress?.isNewAddress) {
        formDataToSend.append("deliveryAddressOtherAddressId", selectedAddress.id);
      } else {
        formDataToSend.append("newDeliveryAddress[fullName]", selectedAddress?.fullName || "");
        formDataToSend.append("newDeliveryAddress[phoneNumber]", selectedAddress?.phoneNumber || "");
        formDataToSend.append("newDeliveryAddress[flat]", selectedAddress?.flat || "");
        formDataToSend.append("newDeliveryAddress[area]", selectedAddress?.area || "");
        formDataToSend.append("newDeliveryAddress[landmark]", selectedAddress?.landmark || "");
        formDataToSend.append("newDeliveryAddress[coordinates][0]", selectedAddress?.coordinates?.[0] || "");
        formDataToSend.append("newDeliveryAddress[coordinates][1]", selectedAddress?.coordinates?.[1] || "");
      }
    }

    // Instructions are always optional
    formDataToSend.append("instructionInDelivery", instructions || "");

    // Debug log
    console.log("=== FormData Contents ===");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await addAddressData(formDataToSend);
    setSaveButtonClicked(true);
    console.log("Response:", response);
    setCartId(response?.cartId);

    if (response?.cartId) {
      navigate("/custom-checkout", {
        state: {
          cartId: response?.cartId,
          confirmationData: response,
        },
      });
    } else {
      alert("Error in adding address.");
    }
  } catch (error) {
    console.error("Save failed:", error);
    alert("Failed to save address.");
  }
};



  const handleAnywhereShopSave = async () => {
    const payload = {
      buyFromAnyWhere: true,
    };

    const result = await addShop(payload);
    console.log("Anywhere shop save result:", result);
  };

  return (
    <div className="custom-order-container flex flex-col md:flex-row">
      <div className="order-section">
        {selectedSource === null && (
          <div className="flex flex-row gap-6 justify-center items-center mb-4">
            <button
              className="primary-btn"
              onClick={() => {
                handleAnywhereShopSave();
                setSelectedSource("anywhere");
              }}
            >
              Buy From Anywhere
            </button>
            <button
              className="primary-btn mt-2"
              onClick={() => {
                setSelectedSource("map");
                setShowMapModal(true);
              }}
            >
              Buy From Map
            </button>
          </div>
        )}

        {selectedSource === "anywhere" && (
          <div className="bg-gray-400 p-4 my-2 rounded-md text-white">
            Buy From Anywhere
          </div>
        )}

        {selectedSource === "map" && (
          <div className="bg-gray-200 p-4 my-2 rounded-md text-white">
            <div className="text-black text-lg font-semibold mb-2">
              Buy From Map
            </div>
            {/* <div className="flex justify-center">
                        <button onClick={() => setShowMapModal(true)} className="bg-[#00ced1] p-3 rounded-full flex items-center justify-center">
                            Select Location on Map
                        </button>
                        </div> */}
            <div className="form-group mt-2">
              <label className="text-black block mb-1">Store Name</label>
              <input
                type="text"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                placeholder="Enter store name"
                className="w-full text-black bg-transparent border-none outline-none"
              />
            </div>

            <div className="form-group mt-2">
              <label className="text-black block mb-1">Place</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Enter place/location"
                className="w-full text-black bg-transparent border-none outline-none"
              />
            </div>

            {!isShopSaved && (
              <div className="flex justify-center mt-4">
                <button
                  className="bg-teal-600 text-white px-4 py-2 rounded-xl w-1/2"
                  onClick={handleSaveShop}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label>Number of Qnty</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantityCount(e.target.value)}
            />
          </div>

          <div className="form-group quantity-group">
            <label>Quantity</label>
            <input
              type="text"
              value={numOfUnits}
              onChange={(e) => setQuantityValue(e.target.value)}
              placeholder="Enter Quantity"
            />
            <span className="unit">{unit}</span>
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              id="imageUpload"
            />
          </div>

          <div className="action-buttons flex">
            <button className="secondary-btn" onClick={handleAddToCart}>
              Save Items
            </button>
          </div>
        </div>

        {cartItems.map((item, idx) => (
          <div className="checkout-item" key={item.itemId || idx}>
            <img
              src={item.itemImage || "https://i.sstatic.net/y9DpT.jpg"}
              alt={item.itemName}
              className="checkout-img"
            />
            <div className="flex-grow">
              <p className="item-title">{item.itemName}</p>
              <p className="item-desc">
                Qty: {item.numOfUnits} x {item.quantity} {item.unit}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => onEdit(item)} title="Edit">
                ✏️
              </button>
              <button
                onClick={() => handleDeleteItem(item.itemId)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <Address onSelectAddress={(selectedAddress) => setSelectedAddress(selectedAddress)} />

        <input
          type="text"
          placeholder="Instructions"
          className="instruction-box"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <div className="flex justify-center mt-6">
          <button
            className="bg-[#00ced1] p-4 rounded-full text-lg"
            onClick={() => {
              handleSave();
            }}
          >
            Save Details
          </button>
        </div>
      </div>

      {/* <CustomCheckout
                cartItems={cartItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                cartId={cartId}
            /> */}

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelect={handleLocationSelect}
      />

      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Item</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={editItemData.itemName}
                onChange={(e) =>
                  setEditItemData({ ...editItemData, itemName: e.target.value })
                }
                placeholder="Item Name"
                className="w-full border p-2"
              />
              <input
                type="number"
                value={editItemData.quantity}
                onChange={(e) =>
                  setEditItemData({ ...editItemData, quantity: e.target.value })
                }
                placeholder="Quantity"
                className="w-full border p-2"
              />
              <input
                type="text"
                value={editItemData.numOfUnits}
                onChange={(e) =>
                  setEditItemData({
                    ...editItemData,
                    numOfUnits: e.target.value,
                  })
                }
                placeholder="No of Units"
                className="w-full border p-2"
              />
              <input
                type="text"
                value={editItemData.unit}
                onChange={(e) =>
                  setEditItemData({ ...editItemData, unit: e.target.value })
                }
                placeholder="Unit (e.g. gm, pcs)"
                className="w-full border p-2"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  const payload = {
                    itemName: editItemData.itemName,
                    quantity: editItemData.quantity,
                    numOfUnits: editItemData.numOfUnits,
                    unit: editItemData.unit,
                    instructions: editItemData.instructions || "",
                  };

                  const success = await updateItem(
                    editItemData.itemId,
                    payload
                  );
                  if (success) {
                    setCartItems((prev) =>
                      prev.map((item) =>
                        item.itemId === editItemData.itemId
                          ? { ...item, ...payload }
                          : item
                      )
                    );
                    setEditModalVisible(false);
                  } else {
                    alert("Failed to update item.");
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrder;
