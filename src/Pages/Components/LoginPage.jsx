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
        localStorage.setItem("refreshToken", data.refreshToken);
     navigate(-1);
  
      // Handle success - save token or redirect
      alert("Login successful!",data.token);
      console.log('Logged in',data.token);
     
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



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import BASE_URL from "../../BaseURL";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../../config/firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";

// const LoginPage = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [referralCode, setReferralCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [verificationId, setVerificationId] = useState("");
//   const [otpLoading, setOtpLoading] = useState(false);
//   const navigate = useNavigate();

//   // Initialize reCAPTCHA verifier
//   const setupRecaptcha = () => {
//     try {
//       if (!window.recaptchaVerifier) {
//         window.recaptchaVerifier = new RecaptchaVerifier(
//           auth,
//           "recaptcha-container",
//           {
//             size: "invisible",
//             callback: () => {
//               console.log("reCAPTCHA solved");
//             },
//             "expired-callback": () => {
//               console.log("reCAPTCHA expired");
//             },
//           }
//         );
//       }
//     } catch (error) {
//       console.error("Error setting up reCAPTCHA:", error);
//       setError("Failed to initialize verification. Please refresh and try again.");
//     }
//   };

//   // Clean up reCAPTCHA on component unmount
//   useEffect(() => {
//     return () => {
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//         window.recaptchaVerifier = null;
//       }
//     };
//   }, []);

//   const sendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       setupRecaptcha();
//       const phoneNumberWithCountryCode = `+91${phoneNumber}`; // Adjust country code as needed
//       const appVerifier = window.recaptchaVerifier;
      
//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         phoneNumberWithCountryCode,
//         appVerifier
//       );
      
//       setVerificationId(confirmationResult.verificationId);
//       setShowOTPInput(true);
//       setError("");
//     } catch (err) {
//       console.error("Error sending OTP:", err);
//       setError("Failed to send OTP. Please try again.");
//       // Reset reCAPTCHA on error
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//         window.recaptchaVerifier = null;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOTP = async (e) => {
//     e.preventDefault();
//     setOtpLoading(true);
//     setError("");

//     try {
//       const credential = PhoneAuthProvider.credential(verificationId, otp);
//       const result = await signInWithCredential(auth, credential);
      
//       // Get Firebase ID token
//       const idToken = await result.user.getIdToken();
      
//       // Now authenticate with your backend
//       const latitude = 8.495721;
//       const longitude = 76.995264;
      
//       const payload = {
//         phoneNumber,
//         referralCode,
//         latitude,
//         longitude,
//         firebaseToken: idToken // Send Firebase token to backend for verification
//       };

//       const response = await axios.post(`${BASE_URL}/customers/authenticate`, payload);
//       const data = response.data;

//       // Store token in local storage
//       localStorage.setItem("authToken", data.token);
//       navigate(-1);
      
//       alert("Login successful!");
      
//     } catch (err) {
//       console.error("Error verifying OTP:", err);
//       setError(err.response?.data?.message || "Invalid OTP. Please try again.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const resendOTP = async () => {
//     setLoading(true);
//     setError("");
//     setOtp("");

//     try {
//       // Clear previous reCAPTCHA
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//       }
      
//       setupRecaptcha();
//       const phoneNumberWithCountryCode = `+91${phoneNumber}`;
//       const appVerifier = window.recaptchaVerifier;
      
//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         phoneNumberWithCountryCode,
//         appVerifier
//       );
      
//       setVerificationId(confirmationResult.verificationId);
//       alert("OTP resent successfully!");
//     } catch (err) {
//       console.error("Error resending OTP:", err);
//       setError("Failed to resend OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goBack = () => {
//     setShowOTPInput(false);
//     setOtp("");
//     setError("");
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-400 to-teal-600">
//       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl flex flex-col md:flex-row">
//         {/* Left side - form */}
//         <div className="flex-1 flex flex-col justify-center p-6">
//           {!showOTPInput ? (
//             <>
//               <h2 className="text-2xl font-semibold text-center mb-6">Login / Sign up</h2>
//               <form onSubmit={sendOTP} className="space-y-4">
//                 <input
//                   type="tel"
//                   placeholder="Phone Number *"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   required
//                   maxLength="10"
//                   pattern="[0-9]{10}"
//                   className="w-full p-3 rounded-md bg-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Referral Code"
//                   value={referralCode}
//                   onChange={(e) => setReferralCode(e.target.value)}
//                   className="w-full p-3 rounded-md bg-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 />
//                 {error && <p className="text-red-500 text-sm">{error}</p>}
//                 <button
//                   type="submit"
//                   className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 rounded-full transition duration-300 disabled:opacity-50"
//                   disabled={loading}
//                 >
//                   {loading ? "Sending OTP..." : "Send OTP"}
//                 </button>
//               </form>
//             </>
//           ) : (
//             <>
//               <div className="flex items-center mb-6">
//                 <button
//                   onClick={goBack}
//                   className="mr-3 text-cyan-600 hover:text-cyan-700 transition duration-300"
//                 >
//                   ← Back
//                 </button>
//                 <h2 className="text-2xl font-semibold">Verify OTP</h2>
//               </div>
              
//               <div className="mb-4">
//                 <p className="text-gray-600 text-sm">
//                   We've sent a verification code to +91{phoneNumber}
//                 </p>
//               </div>

//               <form onSubmit={verifyOTP} className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Enter 6-digit OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                   maxLength="6"
//                   pattern="[0-9]{6}"
//                   className="w-full p-3 rounded-md bg-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center text-lg tracking-widest"
//                 />
                
//                 {error && <p className="text-red-500 text-sm">{error}</p>}
                
//                 <button
//                   type="submit"
//                   className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-3 rounded-full transition duration-300 disabled:opacity-50"
//                   disabled={otpLoading || otp.length !== 6}
//                 >
//                   {otpLoading ? "Verifying..." : "Verify OTP"}
//                 </button>

//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={resendOTP}
//                     className="text-cyan-600 hover:text-cyan-700 text-sm underline disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? "Resending..." : "Resend OTP"}
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
          
//           {/* Hidden reCAPTCHA container */}
//           <div id="recaptcha-container"></div>
//         </div>

//         {/* Right side - illustration */}
//         <div className="flex-1 hidden md:flex items-center justify-center">
//           <img
//             src={showOTPInput ? "/order/otp-verify.png" : "/order/login.png"}
//             alt={showOTPInput ? "OTP Verification" : "Login Illustration"}
//             className="max-w-full h-auto"
//             onError={(e) => {
//               // Fallback if specific OTP image doesn't exist
//               e.target.src = "/order/login.png";
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// LoginPage.displayName = "LoginPage";
// export default LoginPage;