import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Pick_Drop from "./Pages/PickAndDrop/Pick_Drop";
import Home_Delivery from "./Pages/Universal_Flow/Home_Delivery";

function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pick-drop" element={<Pick_Drop />} />
      <Route path="/home-delivery" element={<Home_Delivery />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;