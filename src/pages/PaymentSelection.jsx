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

  const t = {
    route: `${from || "Route"} → ${to || ""}`,
    method: "Choose Payment Method",
    payBtn: `PROCEED TO PAY ₹${totalAmount || 0}`,
    processing: "Processing Payment..."
  };

  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda"];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Debug logs
    console.log("🔥 travelDate:", travelDate);
    console.log("🔥 selectedSeats:", selectedSeats);
    console.log("🔥 bookingData:", bookingData);

    // 🔥 Travel Date check
    if (!travelDate) {
        alert("Travel date missing!");
        return;
    }

    // 🔥 Seat check
    const finalSeats = (selectedSeats && selectedSeats.length > 0) 
        ? selectedSeats 
        : (bookingData.seats || []);

    if (!finalSeats || finalSeats.length === 0) {
        alert("Seats missing!");
        return;
    }

    // 🔥 Payment method check
    if (!activeMethod && !selectedBank) {
        alert("Please select a payment method!");
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

                seats: finalSeats,
                total_amount: totalAmount,
                travel_date: travelDate,

                razorpayOrderId: "DIRECT_ORD_" + Date.now(),
                razorpayPaymentId: "DIRECT_PAY_" + Date.now()
            }
        };

        console.log("🚀 FINAL PAYLOAD:", payload);

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
                          selectedSeats: finalSeats, 
                          totalAmount, 
                          travelDate, 
                          passengers,
                          pnr: response.data.pnr 
                        } 
                    } 
                });
            }, 1500);
        } else {
            throw new Error("Insert failed");
        }

    } catch (error) {
        console.error("❌ Booking Error:", error);
        setIsProcessing(false);
        alert("Booking failed!");
    }
  };

  return (
    <div className="pg-wrapper">

      {isProcessing && (
        <div className="loader">
          <div className="spinner"></div>
          <p>{t.processing}</p>
        </div>
      )}

      <div className="pg-container">

        <div className="summary">
          <h3>{t.route}</h3>
          <p>Date: {travelDate}</p>
          <p>Bus: {busName}</p>
          <p>Seats: {selectedSeats?.join(", ")}</p>
          <h2>₹{totalAmount}</h2>
        </div>

        <h4>{t.method}</h4>

        <form onSubmit={handlePaymentSubmit}>

          <button type="button" onClick={() => setActiveMethod("upi")} className={activeMethod==="upi"?"active":""}>
            UPI
          </button>

          <button type="button" onClick={() => setActiveMethod("card")} className={activeMethod==="card"?"active":""}>
            Card
          </button>

          <select value={selectedBank} onChange={(e)=>setSelectedBank(e.target.value)}>
            <option value="">Select Bank</option>
            {banks.map(b => <option key={b}>{b}</option>)}
          </select>

          <button type="submit" disabled={isProcessing}>
            {t.payBtn}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PaymentSelection;