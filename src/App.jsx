import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Pick_Drop from "./Pages/PickAndDrop/Pick_Drop";
import Home_Delivery from "./Pages/Universal_Flow/Home_Delivery";
import Checkout from "./Pages/Components/Checkout";
import MerchantLists from "./Pages/Universal_Flow/MerchantLists";
import LoginPage from "./Pages/Components/LoginPage";
import ProductList from "./Pages/Universal_Flow/ProductList";
import CheckoutPage from "./Pages/Universal_Flow/CheckoutPage";
import Custom_Order from "./Pages/CustomOrder/Custom_Order";
import Order_Confirm from "./Pages/Universal_Flow/Order_Confirm";
import CustomCheckout from "./Pages/Components/CustomCheckout";
import OrdersPage from "./Pages/OrdersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pick-drop" element={<Pick_Drop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/home-delivery" element={<Home_Delivery />} />
        <Route path="/merchants" element={<MerchantLists />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/custom-order" element={<Custom_Order />} />
        <Route path="/checkout-page" element={<CheckoutPage />} />
        <Route path="/order-confirm" element={<Order_Confirm />} />
        <Route path="/custom-checkout" element={<CustomCheckout />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;