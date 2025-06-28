import React, { useState } from "react";
import { fetchVariants } from "../../../services/Universal_Flow/universalService";
import { useCart } from "../../../context/CartContext";

const ProductCard = ({ product }) => {
  const { cart, addToCart, increment, decrement, merchantId } = useCart();
  const item = cart[product.productId];
  const quantity = item?.quantity || 0;

  const [showDialog, setShowDialog] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const customize = async () => {
    setShowDialog(true);
    setLoadingVariants(true);
    try {
      const result = await fetchVariants(product.productId);
      setVariants(result.data?.[0].variantTypes || []);
    } catch (error) {
      console.error("Failed to load variants:", error);
    } finally {
      setLoadingVariants(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start shadow-sm">
        <div className="relative w-full md:w-52 h-40">
          <img
            src={product.productImageURL}
            alt={product.productName}
            className="w-full h-full object-cover rounded-lg"
          />
          {product.inventory ? (
            quantity > 0 ? (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-5 bg-white px-6 py-1 rounded-full shadow">
                <button
                  className="text-red-600 text-xl font-bold"
                  onClick={() =>
                    decrement(product.productId, item?.variantTypeId)
                  }
                >
                  −
                </button>
                <span className="font-semibold">{quantity}</span>
                <button
                  className="text-green-600 text-xl font-bold"
                  onClick={() =>
                    increment(product.productId, item?.variantTypeId, merchantId , product)
                  }
                >
                  ＋
                </button>
              </div>
            ) : (
              <button
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00CED1] text-white px-10 py-1 text-sm rounded-full shadow-lg"
                onClick={
                  product.variantAvailable
                    ? customize
                    : () => addToCart(product, merchantId)
                }
              >
                {product.variantAvailable ? "Customize" : "Add"}
              </button>
            )
          ) : (
            <div className="absolute -bottom-2 left-1/2 transform  -translate-x-1/2 text-sm bg-red-100 text-gray-600 px-5 w-4/5 py-1 items-center flex justify-center text-center whitespace-nowrap rounded-full shadow">
              Not Available
            </div>
          )}
        </div>

        <div className="space-y-5 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold pt-8">
              {product.productName}
            </h2>
            <div
              className={`w-3 h-3 rounded-full ${
                product.type === "Veg" ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
          <div className="flex flex-row gap-3 text-xl items-center">
            {product.inventory ? (
              product.discountPrice != null ? (
                <>
                  <span className="line-through text-gray-500">
                    ₹ {product.price}
                  </span>
                  <h2 className="text-green-600 font-semibold">
                    ₹ {product.discountPrice}
                  </h2>
                </>
              ) : (
                <h2 className="text-black font-semibold">₹ {product.price}</h2>
              )
            ) : null}
          </div>
          <p>{product.longDescription || product.description}</p>
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Select a Variant</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            {loadingVariants ? (
              <p className="text-center">Loading variants...</p>
            ) : variants.length > 0 ? (
              <ul className="space-y-3">
                {variants.map((variant) => (
                  <li
                    key={variant._id}
                    className="border p-3 rounded-md flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      addToCart({
                        productId: product.productId,
                        productName: variant.typeName,
                        price: variant.price,
                        variantTypeId: variant._id,
                      });
                      setShowDialog(false);
                    }}
                  >
                    <span>{variant.typeName}</span>
                    <span className="font-semibold">₹ {variant.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No variants available
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
