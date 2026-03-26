import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PaymentSelection.css";

const PaymentSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.bookingDetails || {};

  const {
    totalAmount,
    busName,
    from,
    to,
    selectedSeats,
    travelDate,
    passengers,
    email,
    mobile,
    busId,
    bus_id
  } = data;

  const finalAmount = totalAmount || 0;
  const safeSeats = selectedSeats || [];

  const [activeMethod, setActiveMethod] = useState("upi");
  const [selectedBank, setSelectedBank] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://bus-booking-backend-zd3f.onrender.com";

  // 🔥 DEBUG LOG (controlled)
  useEffect(() => {
    console.log("📦 PaymentSelection Data:", data);
  }, []);

  const handlePaymentSubmit = async () => {

    // 🔴 METHOD VALIDATION
    if (!activeMethod && !selectedBank) {
      alert("Select payment method!");
      return;
    }

    // 🔴 PASSENGER VALIDATION (STRONG)
    if (!passengers || passengers.length === 0) {
      alert("Passenger data missing!");
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];

      if (!p.name || !p.age) {
        alert(`Passenger ${i + 1} details incomplete`);
        return;
      }

      if (p.age < 1 || p.age > 100) {
        alert(`Invalid age for Passenger ${i + 1}`);
        return;
      }
    }

    // 🔴 SEAT VALIDATION
    if (!safeSeats || safeSeats.length === 0) {
      alert("No seats selected!");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        bookingDetails: {
          bus_id: bus_id || busId,
          user_id: user?.id || user?.user_id || 1,

          passenger_name: passengers.map(p => p.name).join(", "),
          passenger_age: passengers.map(p => p.age).join(", "),
          passenger_email: email || "guest@test.com",
          passenger_mobile: mobile || "0000000000",

          seats: safeSeats,
          total_amount: finalAmount,
          travel_date: travelDate || new Date().toISOString().split("T")[0],

          // 🔥 EXTRA DEBUG FIELDS (future proof)
          payment_method: activeMethod || selectedBank,
          payment_time: new Date().toISOString()
        }
      };

      console.log("🔥 FINAL PAYLOAD:", payload);

      const res = await axios.post(`${API_BASE_URL}/api/verify-payment`, payload);

      if (res.data.success) {

        setTimeout(() => {
          navigate("/ticket-success", {
            state: {
              bookingDetails: {
                ...data,
                selectedSeats: safeSeats,
                totalAmount: finalAmount,
                passengers,
                pnr: res.data.pnr
              }
            }
          });
        }, 1000);

      } else {
        throw new Error("Payment failed");
      }

    } catch (err) {
      console.error("❌ Booking Error:", err);
      alert("Booking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-wrapper">

      {/* 🔥 SUMMARY */}
      <div className="summary-card">
        <h3>{from} → {to}</h3>
        <p>Travel Date: {travelDate}</p>
        <p>Bus: {busName}</p>
        <p>Seats: {safeSeats.join(", ")}</p>
        <h4>Total Fare: ₹{finalAmount}</h4>
      </div>

      {/* 🔥 METHODS */}
      <div className="payment-box">

        {/* UPI */}
        <div className="method-card">
          <h4>UPI</h4>
          <div className="upi-options">
            <button onClick={() => setActiveMethod("phonepe")}>PhonePe</button>
            <button onClick={() => setActiveMethod("gpay")}>Google Pay</button>
            <button onClick={() => setActiveMethod("paytm")}>Paytm</button>
          </div>
        </div>

        {/* CARD */}
        <div className="method-card">
          <h4>Debit / Credit Card</h4>

          <input placeholder="Card Number" />
          <div className="card-row">
            <input placeholder="MM/YY" />
            <input placeholder="CVV" />
          </div>
        </div>

        {/* NET BANKING */}
        <div className="method-card">
          <h4>Net Banking</h4>

          <select onChange={(e) => {
            setSelectedBank(e.target.value);
            setActiveMethod("netbanking");
          }}>
            <option>Select Bank</option>
            <option>SBI</option>
            <option>HDFC</option>
            <option>ICICI</option>
            <option>AXIS</option>
          </select>
        </div>

        {/* WALLET */}
        <div className="method-card">
          <h4>Wallet</h4>

          <button onClick={() => setActiveMethod("amazonpay")}>Amazon Pay</button>
          <button onClick={() => setActiveMethod("paytmwallet")}>Paytm Wallet</button>
          <button onClick={() => setActiveMethod("mobikwik")}>MobiKwik</button>
        </div>

      </div>

      {/* 🔥 BUTTON */}
      <button
        className="pay-btn"
        onClick={handlePaymentSubmit}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : `PROCEED TO PAY ₹${finalAmount}`}
      </button>

    </div>
  );
};

export default PaymentSelection;