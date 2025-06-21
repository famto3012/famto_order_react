import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchVehicleCharges,
  submitPickDropRequest,
  submitUpdateItemRequest,
} from "../../services/Pick_Drop/pickdropService";

const categories = [
  { name: "Documents & Parcels", image: "/order/documents_parcels.jpg" },
  { name: "Foods & Groceries", image: "/order/food_groceries.png" },
  { name: "Clothing & Laundry", image: "/order/laundry.jpeg" },
  { name: "Medical Supplies", image: "/order/medical_supplies.jpg" },
  { name: "Personal Items", image: "/order/personal_items.png" },
  { name: "Gifts & Flowers", image: "/order/gift_flowers.jpeg" },
  { name: "Electronics", image: "/order/electronics.jpg" },
  { name: "Books & Stationary", image: "/order/books_stationery.jpg" },
  { name: "Online Orders", image: "/order/online_orders.jpg" },
  { name: "Pet Supplies", image: "/order/pet_supplies.jpg" },
  { name: "Automotive Parts", image: "/order/automative_parts.jpg" },
  { name: "Others", image: "/order/household.jpg" },
];

export default function CategoryGrid({
  onSavePackage,
  pickupAddress,
  dropAddress,
  pickupInstructions,
  deliveryInstructions,
  onCartIdReceived,
  savedPackages,
  onEditCategoryIdClear,
  editCategoryId,
  onDeleteCategoryIdClear,
  deletedCategoryId,
  vehicleChargesCallback,
  isNewPickupAddress,
  isNewDropAddress,
}) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
  });
  const [savedData, setSavedData] = useState({});
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [modalImage, setModalImage] = useState("");

  useEffect(() => {
    if (editCategoryId !== null) {
      setSelectedItem(editCategoryId);
      setFormData(
        savedPackages[editCategoryId] || {
          length: "",
          width: "",
          height: "",
          weight: "",
        }
      );
      setModalImage(categories[editCategoryId].image);
      setOpen(true);
      onEditCategoryIdClear();
    }
  }, [editCategoryId]);

  useEffect(() => {
    const handleDelete = async () => {
      if (deletedCategoryId !== null) {
        const updatedData = { ...savedData };
        delete updatedData[deletedCategoryId];
        setSavedData(updatedData);

        // Notify parent
        if (onSavePackage) {
          onSavePackage(updatedData);
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("You're not logged in.");
          return;
        }

        try {
          // Convert updated savedData to array
          const itemsArray = Object.values(updatedData).map((item) => ({
            itemName: item.name || "Unnamed Item",
            length: item.length ?? "0",
            width: item.width ?? "0",
            height: item.height ?? "0",
            unit: "cm",
            weight: item.weight ?? "0",
          }));

          // ❗ Avoid calling API with empty cart
          if (itemsArray.length === 0) {
            alert("No items left in cart. Please add a package.");
            onDeleteCategoryIdClear();
            return;
          }

          console.log("🟡 Items sent to update after delete:", itemsArray);

          // 🔄 Update items in backend
          const response = await submitUpdateItemRequest(itemsArray, token);

          if (response?.updatedCart?._id) {
            // Send updated cart ID to parent
            onCartIdReceived?.(response.updatedCart._id);

            // Re-fetch vehicle charges
            const charges = await fetchVehicleCharges(
              response.updatedCart._id
            );

            vehicleChargesCallback?.(charges);
          }

          alert("Item deleted and charges updated.");
        } catch (error) {
          console.error("Error while deleting:", error);
          alert("Failed to update cart after deleting item.");
        }

        onDeleteCategoryIdClear();
      }
    };

    handleDelete();
  }, [deletedCategoryId]);

  // useEffect(() => {
  //   if (deletedCategoryId !== null) {
  //     const updatedData = { ...savedData };
  //     delete updatedData[deletedCategoryId];
  //     setSavedData(updatedData);
  //     if (onSavePackage) {
  //       onSavePackage(updatedData);
  //     }
  //     onDeleteCategoryIdClear();
  //   }
  // }, [deletedCategoryId]);

  const handleOpen = (index) => {
    setSelectedItem(index);
    setModalImage(categories[index].image);
    setFormData(
      savedData[index] || { length: "", width: "", height: "", weight: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You're not logged in.");
      return;
    }

    const updatedData = {
      ...savedData,
      [selectedItem]: {
        ...formData,
        image: categories[selectedItem].image,
        name: categories[selectedItem].name,
      },
    };

    const selectedPackage = updatedData[selectedItem];

    try {
      if (!hasSubmittedOnce) {
        // 🟢 First item being saved: use pick & drop request
        const formDataToSend = new FormData();
        formDataToSend.append("pickUpAddressType", pickupAddress.type || "");
        if (pickupAddress.type === "other") {
          formDataToSend.append(
            "pickUpAddressOtherAddressId",
            pickupAddress.id || ""
          );
        }
        // Only include newPickupAddress fields if it's a new address (no id)
        if (pickupAddress?.isNewAddress) {
          formDataToSend.append(
            "newPickupAddress[fullName]",
            pickupAddress.fullName
          );
          formDataToSend.append(
            "newPickupAddress[phoneNumber]",
            pickupAddress.phoneNumber
          );
          formDataToSend.append("newPickupAddress[flat]", pickupAddress.flat);
          formDataToSend.append("newPickupAddress[area]", pickupAddress.area);
          formDataToSend.append(
            "newPickupAddress[landmark]",
            pickupAddress.landmark
          );
          formDataToSend.append(
            "newPickupAddress[coordinates][0]",
            pickupAddress.coordinates?.[0] || ""
          );
          formDataToSend.append(
            "newPickupAddress[coordinates][1]",
            pickupAddress.coordinates?.[1] || ""
          );
        }
        formDataToSend.append("instructionInPickup", pickupInstructions || "");
        formDataToSend.append("deliveryAddressType", dropAddress.type || "");
        if (dropAddress.type === "other") {
          formDataToSend.append(
            "deliveryAddressOtherAddressId",
            dropAddress.id || ""
          );
        }
        formDataToSend.append(
          "instructionInDelivery",
          deliveryInstructions || ""
        );
        if (dropAddress?.isNewAddress) {
          formDataToSend.append(
            "newDeliveryAddress[fullName]",
            dropAddress.fullName
          );
          formDataToSend.append(
            "newDeliveryAddress[phoneNumber]",
            dropAddress.phoneNumber
          );
          formDataToSend.append("newDeliveryAddress[flat]", dropAddress.flat);
          formDataToSend.append("newDeliveryAddress[area]", dropAddress.area);
          formDataToSend.append(
            "newDeliveryAddress[landmark]",
            dropAddress.landmark
          );
          formDataToSend.append(
            "newDeliveryAddress[coordinates][0]",
            dropAddress.coordinates?.[0] || ""
          );
          formDataToSend.append(
            "newDeliveryAddress[coordinates][1]",
            dropAddress.coordinates?.[1] || ""
          );
        }
        const item = {
          itemName: selectedPackage.name,
          length: selectedPackage.length,
          width: selectedPackage.width,
          height: selectedPackage.height,
          weight: selectedPackage.weight,
        };
        formDataToSend.append("item", JSON.stringify(item));

        const response = await submitPickDropRequest(formDataToSend, token);
        if (response?.cartId) {
          onCartIdReceived && onCartIdReceived(response.cartId);

          const charges = await fetchVehicleCharges(response.cartId);
          if (vehicleChargesCallback) {
            vehicleChargesCallback?.(charges); // Send to parent
          }
        }

        setHasSubmittedOnce(true);
        console.log("pickdrop", response.cartId);
        console.log("pickdrop", pickupAddress.fullName);
        console.log("pickdrop", pickupAddress.phoneNumber);
        console.log("pickdrop", pickupAddress.flat);
        console.log("pickdrop", pickupAddress.area);
        console.log("id", pickupAddress.id);
        console.log("pickdrop", pickupAddress);
        console.log("pickdrop", pickupAddress.landmark);
        console.log("pickdrop", pickupAddress.coordinates[0]);
        console.log("pickdrop", pickupAddress.coordinates[1]);
        //  console.log("Pick & Drop Submitted:", formDataToSend);
        console.log("🟡 Submitting the following FormData:");
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}:`, value);
        }
        // alert("Pick & Drop Request Submitted");
      } else {
        // 🟡 Subsequent save/edit
        const itemsArray = Object.values(updatedData).map((item) => ({
          itemName: item.name,
          length: item.length,
          width: item.width,
          height: item.height || "",
          unit: "cm",
          weight: item.weight,
        }));

        const response = await submitUpdateItemRequest(itemsArray, token);
        if (response?.updatedCart?._id) {
          onCartIdReceived?.(response.updatedCart._id);

          const charges = await fetchVehicleCharges(
            response.updatedCart._id
          );
          if (vehicleChargesCallback) {
            vehicleChargesCallback?.(charges); // Send to parent
          }
        }
        console.log("update", response.updatedCart._id);

        alert("Item updated successfully");
      }

      setSavedData(updatedData); // Save changes002.

      if (onSavePackage) {
        onSavePackage(updatedData);
      }
      setOpen(false);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to save item.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid-cols-1 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:grid-cols-4  space-y-7">
      {categories.map((category, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            sx={{
              borderRadius: "30px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            }}
            className="text-center shadow-2xl cursor-pointer mx-auto w-[300px] md:w-[250px]"
            onClick={() => handleOpen(index)}
          >
            <CardContent>
              <motion.img
                src={category.image}
                alt={category.name}
                className="mx-auto h-24"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <p className="mt-4 font-semibold text-[14px]">{category.name}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <AnimatePresence>
        {open && (
          <Dialog
            open={open}
            onClose={handleClose}
            className="backdrop-blur-lg"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-lg p-6 shadow-2xl"
              >
                <DialogTitle className="text-center">
                  Enter Package Details
                </DialogTitle>
                <DialogContent className="flex flex-row gap-5">
                  <motion.img
                    src={modalImage}
                    alt="Selected Item"
                    className="mx-auto h-40 rounded-lg mb-4"
                    initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <div className="flex flex-col space-y-5">
                    <input
                      type="number"
                      name="length"
                      placeholder="Length"
                      value={formData.length}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      name="width"
                      placeholder="Width"
                      value={formData.width}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      name="height"
                      placeholder="Height"
                      value={formData.height}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      name="weight"
                      placeholder="Weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded"
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} sx={{ color: "black" }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                      backgroundColor: "#00ced1",
                      color: "white",
                      "&:hover": { backgroundColor: "#009ea0" },
                    }}
                  >
                    Save
                  </Button>
                </DialogActions>
              </motion.div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

// const handleSave = async () => {

//   const token = localStorage.getItem("authToken");
//   if (!token) return;
//   const updatedData = {
//     ...savedData,
//     [selectedItem]: {
//       ...formData,
//       image: categories[selectedItem].image,
//       name: categories[selectedItem].name,
//     },
//   };
//   setSavedData(updatedData);

//   const selectedPackage = updatedData[selectedItem];

//   const formDataToSend = new FormData();

//   // Pickup address
//   formDataToSend.append("pickUpAddressType", pickupAddress.addressType);
//   formDataToSend.append("pickUpAddressOtherAddressId","");
// formDataToSend.append("newPickupAddress[fullName]", "");
// formDataToSend.append("newPickupAddress[phoneNumber]", "");
// formDataToSend.append("newPickupAddress[flat]", "");
// formDataToSend.append("newPickupAddress[area]", "");
// formDataToSend.append("newPickupAddress[landmark]", "");
// formDataToSend.append("newPickupAddress[coordinates][0]", "");
// formDataToSend.append("newPickupAddress[coordinates][1]", "");
//   formDataToSend.append("addNewPickupToAddressBook", "");
//   formDataToSend.append("instructionInPickup",pickupInstructions);
//   formDataToSend.append("voiceInstructionInPickup", "");

//   // Delivery address
//   formDataToSend.append("deliveryAddressType",dropAddress.addressType);
//   formDataToSend.append("deliveryAddressOtherAddressId", "");
//   formDataToSend.append("newDeliveryAddress[fullName]", "");
//   formDataToSend.append("newDeliveryAddress[phoneNumber]", "");
//   formDataToSend.append("newDeliveryAddress[flat]", "");
//   formDataToSend.append("newDeliveryAddress[area]", "");
//   formDataToSend.append("newDeliveryAddress[landmark]", "");
//   formDataToSend.append("newDeliveryAddress[coordinates][0]", "");
//   formDataToSend.append("newDeliveryAddress[coordinates][1]", "");
//   formDataToSend.append("addNewDeliveryToAddressBook", "");
//   formDataToSend.append("instructionInDelivery", deliveryInstructions);
//   formDataToSend.append("voiceInstructionInDelivery", "");

//   // Schedule
//   formDataToSend.append("startDate", "");
//   formDataToSend.append("endDate", "");
//   formDataToSend.append("time", "");

//   // Package item
//   const item = {
//     itemName: selectedPackage.name,
//     length: selectedPackage.length,
//     width: selectedPackage.width,
//     height: selectedPackage.height,
//     weight: selectedPackage.weight,
//   };

//   formDataToSend.append("item", JSON.stringify(item));

//   // 🔗 Make API call
//   try {
//     const response = await submitPickDropRequest(formDataToSend, token);
//     console.log("Pick & Drop Submitted:", response);
//       // 👈 adjust this based on actual API response shape
//  if (response?.cartId) {
//   onCartIdReceived(response.cartId);
//   console.log(response.cartId);
//   // make sure you passed this as a prop
// }
//     console.log("🟡 Submitting the following FormData:");
//    for (let [key, value] of formDataToSend.entries()) {
//   console.log(`${key}:`, value);
// }

//     alert("Pick & Drop Request Submitted Successfully");
//   } catch (error) {
//     console.error("Error submitting:", error);
//         console.log("🟡 Submitting the following FormData:");
// for (let [key, value] of formDataToSend.entries()) {
//   console.log(`${key}:`, value);
//   console.log(pickupAddress);
//   console.log(dropAddress);

// }
//     alert("Submission Failed");
//   }
//    if (onSavePackage) {
//         onSavePackage(updatedData);
//     }
//   setOpen(false);
// };
