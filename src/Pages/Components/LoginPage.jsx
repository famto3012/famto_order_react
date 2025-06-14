import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../BaseURL";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {

        const latitude = 8.495721;
        const longitude = 76.995264;
        
      const payload = {
        phoneNumber,
        referralCode,
        latitude,
        longitude
      };
      const response = await axios.post(`${BASE_URL}/customers/authenticate`, payload);

      const data = response.data;

      // Store token in local storage
        localStorage.setItem("authToken", data.token);
     navigate(-1);
  
      // Handle success - save token or redirect
      alert("Login successful!",data.success);
     
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl flex flex-col md:flex-row">
        {/* Left side - form */}
        <div className="flex-1 flex flex-col justify-center p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">Login / Sign up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number *"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-gray-200 placeholder-gray-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Refferel Code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-200 placeholder-gray-600 focus:outline-none"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 rounded-full transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Right side - illustration */}
        <div className="flex-1 hidden md:flex items-center justify-center">
          <img
            src="/order/login.png"
            alt="Login Illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

LoginPage.displayName = "LoginPage";
export default LoginPage;