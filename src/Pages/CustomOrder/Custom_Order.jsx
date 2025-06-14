import { useState } from "react";
import CustomCheckout from "../Components/CustomCheckout";
import "../../styles/Universal_Flow/CustomOrderStyles.css";
import Address from "../Components/Address";
import { useNavigate } from "react-router-dom";
import MapModal from "../Mappls/MapModal";

const CustomOrder = () => {
    const [itemName, setItemName] = useState("");
    const [quantityCount, setQuantityCount] = useState(1);
    const [quantityValue, setQuantityValue] = useState("");
    const [unit, setUnit] = useState("gm");
    const [instructions, setInstructions] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null); // 'anywhere' or 'map'
    const [store, setStore] = useState("");
    const [place, setPlace] = useState("");
    const [showMapModal, setShowMapModal] = useState(false); // for modal
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!itemName) return alert("Please enter item name");

        const newItem = {
            itemName,
            quantityCount,
            quantityValue,
            unit,
            instructions,
            imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
            source: selectedSource,
            store: selectedSource === "map" ? store : null,
            place: selectedSource === "map" ? place : null,
        };

        setCartItems([...cartItems, newItem]);

        // Clear fields
        setItemName("");
        setQuantityCount(1);
        setQuantityValue("");
        setUnit("gm");
        setInstructions("");
        setImageFile(null);
        setStore("");
        setPlace("");

        document.getElementById("imageUpload").value = "";
    };

    const handleLocationSelect = ({ lat, lng }) => {
        setStore(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
        setPlace("Custom selected location");
        setShowMapModal(false);
    };

    return (
        <div className="custom-order-container">
            <div className="order-section">
                {selectedSource === null && (
                    <div className="flex flex-col justify-center items-center mb-4">
                        <button
                            className="primary-btn"
                            onClick={() => {
                                setSelectedSource("anywhere");
                                setStore("");
                                setPlace("");
                            }}
                        >
                            Buy From Anywhere
                        </button>
                        <button
                            className="primary-btn mt-2"
                            onClick={() => setSelectedSource("map")}
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
                        <div className="text-black text-lg font-semibold mb-2">Buy From Map</div>
                        <button onClick={() => setShowMapModal(true)}>
                            Select Location on Map
                        </button>
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

                        <div className="flex justify-center mt-4">
                            <button className="bg-teal-600 text-white px-4 py-2 rounded-xl w-1/2">
                                Save
                            </button>
                        </div>
                    </div>
                )}

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
                        value={quantityCount}
                        onChange={(e) => setQuantityCount(e.target.value)}
                    />
                </div>

                <div className="form-group quantity-group">
                    <label>Quantity</label>
                    <input
                        type="text"
                        value={quantityValue}
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

                <div className="action-buttons">
                    <button className="secondary-btn" onClick={handleAddToCart}>
                        Save Items
                    </button>
                </div>

                <Address />

                <input
                    type="text"
                    placeholder="Instructions"
                    className="instruction-box"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                />
            </div>

            <CustomCheckout cartItems={cartItems} />

            <MapModal
                isOpen={showMapModal}
                onClose={() => setShowMapModal(false)}
                onLocationSelect={handleLocationSelect}
            />
        </div>
    );
};

export default CustomOrder;
