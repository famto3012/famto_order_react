import React, { useState } from "react";
import "../../styles/Universal_Flow/CustomOrderStyles.css";

const CustomCheckout = ({ cartItems = [] }) => {
    const [selectedTip, setSelectedTip] = useState(20);
    const [customTip, setCustomTip] = useState("");
    const [isOtherSelected, setIsOtherSelected] = useState(false);

    // Simulate fixed charges (could be dynamic later)
    const deliveryCharge = 50;
    const surgeCharge = 30;
    const waitingCharge = 40;
    const discount = 10;
    const tax = 20;

    // Calculate item total (just showing number of items × 100 for demo)
    const itemsTotal = cartItems.length * 100;

    const total =
        itemsTotal +
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

            {/* Item List */}
            {cartItems.length > 0 ? (
                cartItems.map((item, idx) => (
                    <div className="checkout-item" key={idx}>
                        <img
                            src={item.imageUrl || "https://via.placeholder.com/100"}
                            alt={item.itemName}
                            className="checkout-img"
                        />

                        <div>
                            <p className="item-title">{item.itemName}</p>
                            <p className="item-desc">
                                Qty: {item.quantityCount} x {item.quantityValue} {item.unit}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No items added yet.</p>
            )}

            {/* Tip Section */}
            <div className="tag-options">
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
            <div className="bill-summary">
                <h5>Bill Summary</h5>
                <div className="bill-row">
                    <span>Item Total</span>
                    <span>₹{itemsTotal}</span>
                </div>
                <div className="bill-row">
                    <span>Delivery Charges</span>
                    <span>₹{deliveryCharge}</span>
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
                    <span>₹{waitingCharge}</span>
                </div>
                <div className="bill-row">
                    <span>Discount (Promo code)</span>
                    <span>-₹{discount}</span>
                </div>
                <div className="bill-row">
                    <span>Taxes & Fees</span>
                    <span>₹{tax}</span>
                </div>
                <div className="bill-row total">
                    <strong>Grand Total</strong>
                    <strong>₹{total}</strong>
                </div>
            </div>
        </div>
    );
};

export default CustomCheckout;
