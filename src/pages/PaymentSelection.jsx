import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../styles/PaymentSelection.css";

const PaymentSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  
  const [activeMethod, setActiveMethod] = useState(""); 
  const [selectedBank, setSelectedBank] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5001" 
    : "https://bus-booking-backend-zd3f.onrender.com";

  const bookingData = location.state?.bookingDetails || location.state || {}; 

  const { 
    totalAmount, 
    busName, 
    from, 
    to, 
    selectedSeats, 
    travelDate,
    busId, 
    bus_id, 
    fullName,
    email,
    mobile,
    passengers 
  } = bookingData;

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 DEBUG (VERY IMPORTANT)
  console.log("🔥 Booking Data:", bookingData);

  const translations = {
    en: {
      route: `${from || "Route"} → ${to || ""}`,
      method: "Choose Payment Method",
      payBtn: `PROCEED TO PAY ₹${totalAmount || 0}`,
      date: "Travel Date",
      bus: "Bus",
      seat: "Seat",
      fare: "Total Fare",
      processing: "Processing Payment..."
    }
  };

  const t = translations[lang] || translations.en;
  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank"];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // 🔥 STRONG VALIDATIONS
    if (!travelDate) {
      alert("Travel date missing!");
      return;
    }

    if (!selectedSeats || selectedSeats.length === 0) {
      alert("Seats missing!");
      return;
    }

    if (!activeMethod && !selectedBank) {
      alert("Select payment method!");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        bookingDetails: {
          bus_id: bus_id || busId || 1,
          user_id: user?.user_id || user?.id || 1,

          passenger_name: fullName || "Guest",
          passenger_email: email || "test@test.com",
          passenger_mobile: mobile || "0000000000",

          seats: selectedSeats,
          total_amount: totalAmount,

          // 🔥 CRITICAL FIX
          travel_date: travelDate,

          payment_method: activeMethod || selectedBank,

          razorpayOrderId: "ORD_" + Date.now(),
          razorpayPaymentId: "PAY_" + Date.now()
        }
      };

      console.log("🚀 Payload:", payload);

      const response = await axios.post(`${API_BASE_URL}/api/verify-payment`, payload);

      if (response.data.success) {
        navigate("/ticket-success", { 
          state: { 
            bookingDetails: { 
              ...bookingData,
              pnr: response.data.pnr 
            } 
          } 
        });
      } else {
        throw new Error();
      }

    } catch (error) {
      console.error("❌ Booking Error:", error);
      alert("Booking failed!");
    }

    setIsProcessing(false);
  };

  return (
    <div className="real-pg-wrapper">

      {isProcessing && <div className="loader">Processing...</div>}

      <div className="real-pg-container">

        <div className="summary-box">
          <strong>{from} → {to}</strong>
          <p>{t.date}: {travelDate}</p>
          <p>{t.bus}: {busName}</p>
          <p>{t.seat}: {selectedSeats?.join(", ")}</p>
          <p>₹{totalAmount}</p>
        </div>

        <h3>{t.method}</h3>

        <form onSubmit={handlePaymentSubmit}>

          {/* UPI */}
          <div onClick={() => setActiveMethod("upi")} className="method">
            UPI
          </div>

          {/* CARD */}
          <div onClick={() => setActiveMethod("card")} className="method">
            Card
          </div>

          {/* NETBANKING */}
          <select 
            value={selectedBank}
            onChange={(e) => {
              setSelectedBank(e.target.value);
              setActiveMethod("netbanking");
            }}
          >
            <option value="">Select Bank</option>
            {banks.map(b => <option key={b}>{b}</option>)}
          </select>

          {/* WALLET */}
          <div onClick={() => setActiveMethod("wallet")} className="method">
            Wallet
          </div>

          <button type="submit">
            {t.payBtn}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PaymentSelection;