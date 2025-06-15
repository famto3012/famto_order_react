import React, { useState } from "react";
import "../../styles/Universal_Flow/CustomOrderStyles.css";

const CustomCheckout = ({ cartItems = [], onEdit, onDelete }) => {
    const [selectedTip, setSelectedTip] = useState(20);
    const [customTip, setCustomTip] = useState("");
    const [isOtherSelected, setIsOtherSelected] = useState(false);

    // Simulate fixed charges (could be dynamic later)
    const deliveryCharge = 50;
    const surgeCharge = 30;
    const waitingCharge = 40;
    const discount = 10;
    const tax = 20;

    

    const total =
        deliveryCharge +
        surgeCharge +
        waitingCharge +
        (isOtherSelected ? Number(customTip || 0) : selectedTip) +
        tax -
        discount;

    const handleTipChange = (tip) => {
        setIsOtherSelected(false);
        setSelectedTip(tip);
        setCustomTip("");
    };

    return (
        <div className="checkout-box">
            <h4>Checkout</h4>

            {cartItems.map((item, idx) => (
                <div className="checkout-item" key={item.itemId || idx}>
                    <img
                        src={item.itemImageURL || "https://via.placeholder.com/100"}
                        alt={item.itemName}
                        className="checkout-img"
                    />
                    <div className="flex-grow">
                        <p className="item-title">{item.itemName}</p>
                        <p className="item-desc">
                            Qty: {item.numOfUnits} x {item.quantity} {item.unit}
                        </p>
                    </div>
                    {/* <div className="flex gap-2 items-center">
                        <button onClick={() => onEdit(item)} title="Edit">
                            ✏️
                        </button>
                        <button onClick={() => onDelete(item.itemId)} title="Delete">
                            🗑️
                        </button>
                    </div> */}
                </div>
            ))}


            {/* Tip Section */}
            <div className="tag-options flex flex-col gap-2 sm:flex-row">
                <button onClick={() => handleTipChange(10)}>₹10</button>
                <button onClick={() => handleTipChange(20)}>₹20</button>
                <button onClick={() => handleTipChange(50)}>₹50</button>
                <button
                    onClick={() => {
                        setIsOtherSelected(true);
                        setSelectedTip(0);
                    }}
                >
                    Other
                </button>
            </div>

            {isOtherSelected && (
                <input
                    type="number"
                    placeholder="Enter tip amount"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    className="tip-input"
                />
            )}

            {/* Bill Summary */}
            <div className="bill-summary flex flex-col">
                <h5>Bill Summary</h5>
                <div className="bill-row flex flex-col">
                    <span>Item Total</span>
                    <span className="bill-data">will be updated soon</span>
                </div>
                <div className="bill-row">
                    <span>Delivery Charges</span>
                    <span className="bill-data"> ₹ will be updated soon</span>
                </div>
                <div className="bill-row">
                    <span>Surge Charges</span>
                    <span>₹{surgeCharge}</span>
                </div>
                <div className="bill-row">
                    <span>Adding Tip</span>
                    <span>
                        ₹{isOtherSelected ? Number(customTip || 0) : selectedTip}
                    </span>
                </div>
                <div className="bill-row">
                    <span>Waiting Charges</span>
                    <span>₹ will be updated soon</span>
                </div>
                <div className="bill-row">
                    <span>Discount (Promo code)</span>
                    <span>-₹{discount}</span>
                </div>
                <div className="bill-row">
                    <span>Taxes & Fees</span>
                    <span>₹ will be updated soon</span>
                </div>
                <div className="bill-row total">
                    <strong>Grand Total</strong>
                    <strong>₹ will be updated soon</strong>
                </div>
            </div>
          
        </div>

    );

};

export default CustomCheckout;
