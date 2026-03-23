import React, { useState, useEffect } from "react";
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

  // 🔥 NEW: force re-render check
  useEffect(() => {
    console.log("📦 PaymentSelection Data:", location.state);
  }, [location.state]);

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

  // 🔥 SAFETY FALLBACKS (CRITICAL)
  const safeSeats = selectedSeats || bookingData.seats || [];
  const safeAmount = totalAmount || bookingData.totalAmount || 0;
  const safePassengers = passengers || [];

  const user = JSON.parse(localStorage.getItem("user"));

  const translations = {
    en: {
      route: `${from || "Route"} → ${to || ""}`, 
      method: "Choose Payment Method",
      upi: "UPI", 
      card: "Debit / Credit Card",
      cardNum: "Card Number", 
      expiry: "Expiry Date", 
      cvv: "CVV", 
      netbanking: "Net Banking",
      wallet: "Wallet", 
      payBtn: `PROCEED TO PAY ₹${safeAmount}`, 
      date: "Travel Date", 
      bus: "Bus", 
      seat: "Seat", 
      fare: "Total Fare",
      upiPlaceholder: "Enter UPI ID", 
      processing: "Processing Payment..."
    },
    mr: {
      route: `${from || "प्रवास"} → ${to || ""}`, 
      method: "पेमेंट पद्धत निवडा",
      upi: "UPI", 
      card: "डेबिट / क्रेडिट कार्ड",
      cardNum: "कार्ड नंबर", 
      expiry: "एक्सपायरी तारीख", 
      cvv: "सीव्हीव्ही", 
      netbanking: "नेट बँकिंग",
      wallet: "वॉलेट", 
      payBtn: `₹${safeAmount} भरण्यासाठी पुढे जा`, 
      date: "प्रवासाची तारीख", 
      bus: "बस", 
      seat: "सीट", 
      fare: "एकूण भाडे",
      upiPlaceholder: "UPI ID टाका", 
      processing: "पेमेंट सुरू आहे..."
    }
  };

  const t = translations[lang] || translations.en;
  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank"];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!activeMethod && !selectedBank) {
      alert("Select payment method!");
      return;
    }

    if (!safePassengers || safePassengers.length === 0) {
      alert("Passenger data missing!");
      return;
    }

    for (let p of safePassengers) {
      if (!p.name || !p.age) {
        alert("Fill all passenger details!");
        return;
      }
    }

    setIsProcessing(true);

    try {

      const passengerNames = safePassengers.map(p => p.name).join(", ");
      const passengerAges = safePassengers.map(p => p.age).join(", ");

      const payload = {
        bookingDetails: {
          bus_id: bus_id || busId || 1,
          user_id: user?.user_id || user?.id || 1,

          passenger_name: passengerNames,
          passenger_email: email || "guest@test.com",
          passenger_mobile: mobile || "0000000000",

          seats: safeSeats,
          total_amount: safeAmount,

          travel_date: travelDate || new Date().toISOString().split("T")[0],

          passenger_age: passengerAges,

          razorpayOrderId: "ORD_" + Date.now(),
          razorpayPaymentId: "PAY_" + Date.now()
        }
      };

      console.log("🔥 FINAL PAYLOAD:", payload);

      const response = await axios.post(`${API_BASE_URL}/api/verify-payment`, payload);

      if (response.data.success) {

        setTimeout(() => {
          setIsProcessing(false);

          navigate("/ticket-success", { 
            state: { 
              bookingDetails: { 
                from, 
                to, 
                busName, 
                selectedSeats: safeSeats,
                totalAmount: safeAmount,
                travelDate, 
                passengers: safePassengers,
                pnr: response.data.pnr 
              } 
            } 
          });

        }, 1500);

      } else {
        throw new Error("DB error");
      }

    } catch (error) {
      console.error("❌ Booking Error:", error);
      setIsProcessing(false);
      alert("Booking failed");
    }
  };

  return (
    <div className="real-pg-wrapper">
      {isProcessing && (
        <div className="payment-loader-overlay">
          <div className="loader-box">
            <div className="spinner"></div>
            <p>{t.processing}</p>
          </div>
        </div>
      )}

      <div className="real-pg-container">

        <div className="lang-header">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        {/* 🔥 FIXED SUMMARY UI */}
        <div className="summary-box">
          <div className="summary-route"><strong>{t.route}</strong></div>
          <p>{t.date}: {travelDate || "N/A"}</p>
          <p>{t.bus}: {busName || "N/A"}</p>
          <p>{t.seat}: {safeSeats.join(", ") || "None"}</p>
          <p>{t.fare}: ₹{safeAmount}</p>
        </div>

        <h4 style={{marginTop: "10px"}}>{t.method}</h4>

        <form onSubmit={handlePaymentSubmit}>

          <button type="button" onClick={() => setActiveMethod("upi")}>
            {t.upi}
          </button>

          <button type="button" onClick={() => setActiveMethod("card")}>
            {t.card}
          </button>

          <div style={{marginTop: "10px"}}>
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
          </div>

          <button type="submit" disabled={isProcessing}>
            {t.payBtn}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PaymentSelection;