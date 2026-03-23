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

  const translations = {
    en: {
      route: `${from || "Route"} → ${to || ""}`, method: "Choose Payment Method", upi: "UPI", card: "Debit / Credit Card",
      cardNum: "Card Number", expiry: "Expiry Date", cvv: "CVV", netbanking: "Net Banking",
      wallet: "Wallet", payBtn: `PROCEED TO PAY ₹${totalAmount || 0}`, date: "Travel Date", bus: "Bus", seat: "Seat", fare: "Total Fare",
      upiPlaceholder: "Enter UPI ID (e.g. user@abc)", processing: "Processing Payment... Please wait"
    },
    mr: {
      route: `${from || "प्रवास"} → ${to || ""}`, method: "पेमेंट पद्धत निवडा", upi: "UPI", card: "डेबिट / क्रेडिट कार्ड",
      cardNum: "कार्ड नंबर", expiry: "एक्सपायरी तारीख", cvv: "सीव्हीव्ही", netbanking: "नेट बँकिंग",
      wallet: "वॉलेट", payBtn: `₹${totalAmount || 0} भरण्यासाठी पुढे जा`, date: "प्रवासाची तारीख", bus: "बस", seat: "सीट", fare: "एकूण भाडे",
      upiPlaceholder: "UPI ID टाका (उदा. user@abc)", processing: "पेमेंट प्रक्रिया सुरू आहे... कृपया थांबा"
    },
    hi: {
      route: `${from || "यात्रा"} → ${to || ""}`, method: "भुगतान विधि चुनें", upi: "UPI", card: "डेबिट / क्रेडिट कार्ड",
      cardNum: "कार्ड नंबर", expiry: "समाप्ति तिथि", cvv: "सीवीवी", netbanking: "नेट बैंकिंग",
      wallet: "वॉलेट", payBtn: `₹${totalAmount || 0} भुगतान के लिए आगे बढ़ें`, date: "यात्रा की तिथि", bus: "बस", seat: "सीट", fare: "कुल किराया",
      upiPlaceholder: "UPI ID दर्ज करें (जैसे user@abc)", processing: "भुगतान संसाधित हो रहा है... कृपया प्रतीक्षा करें"
    }
  };

  const t = translations[lang] || translations.en;
  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda"];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!activeMethod && !selectedBank) {
        alert("Please select payment method!");
        return;
    }

    // 🔥 EXTRA VALIDATION (NEW)
    if (!selectedSeats || selectedSeats.length === 0) {
        alert("Seats missing!");
        return;
    }

    if (!passengers || passengers.length === 0) {
        alert("Passenger data missing!");
        return;
    }

    setIsProcessing(true);

    try {

        const payload = {
            bookingDetails: {
                bus_id: bus_id || busId || 1,
                user_id: user?.user_id || user?.id || 1,

                passenger_name: fullName || "Guest User",
                passenger_email: email || "guest@test.com",
                passenger_mobile: mobile || "0000000000",

                seats: selectedSeats,
                total_amount: totalAmount || 0,

                // 🔥 IMPORTANT FIX
                travel_date: travelDate || new Date().toISOString().split("T")[0],

                // 🔥 MULTI PASSENGER SUPPORT
                passengers: passengers,

                razorpayOrderId: "DIRECT_ORD_" + Date.now(),
                razorpayPaymentId: "DIRECT_PAY_" + Date.now()
            }
        };

        console.log("FINAL PAYLOAD:", payload);

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
                          selectedSeats, 
                          totalAmount, 
                          travelDate, 
                          passengers,
                          pnr: response.data.pnr 
                        } 
                    } 
                });
            }, 2000);
        } else {
            throw new Error("Database insertion failed");
        }

    } catch (error) {
        console.error("Booking Error:", error.response?.data || error.message);
        setIsProcessing(false);
        alert("Booking failed! Check backend.");
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
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <div className="summary-box">
          <div className="summary-route"><strong>{t.route}</strong></div>
          <div className="summary-grid">
            <div className="left-info">
              <p>{t.date}: {travelDate || "Selected Date"}</p>
              <p>{t.bus}: {busName || "Not Specified"}</p>
              <p>{t.seat}: {selectedSeats?.join(", ") || "None"}</p>
            </div>
            <div className="right-fare">
              <span>{t.fare}: <strong>₹{totalAmount || 0}</strong></span>
            </div>
          </div>
        </div>

        <h4 className="payment-title-text">{t.method}</h4>

        <form onSubmit={handlePaymentSubmit}>
          {/* बाकी तुझा UI जसाच्या तसा आहे — काही delete नाही */}
          <button type="submit" className="payment-proceed-btn" disabled={isProcessing}>
            {isProcessing ? "..." : t.payBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentSelection;