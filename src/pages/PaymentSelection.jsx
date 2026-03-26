import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PaymentSelection.css";

const PaymentSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://bus-booking-backend-zd3f.onrender.com";

  const bookingData = location.state || {};

  const {
    totalAmount,
    busName,
    from,
    to,
    selectedSeats,
    travelDate,
    busId,
    passengers,
    fullName,
    email,
    mobile,
  } = bookingData;

  const user = JSON.parse(localStorage.getItem("user"));

  const handlePayment = async () => {
    if (!passengers || passengers.length === 0) {
      alert("Passenger data missing!");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        bookingDetails: {
          bus_id: busId,
          user_id: user?.id || 1,
          passenger_name: passengers.map(p => p.name).join(", "),
          passenger_age: passengers.map(p => p.age).join(", "),
          passenger_email: email,
          passenger_mobile: mobile,
          seats: (selectedSeats || []).join(","), // FIX
          total_amount: totalAmount,
          travel_date: travelDate,
          razorpayOrderId: "ORD_" + Date.now(),
          razorpayPaymentId: "PAY_" + Date.now(),
        },
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/verify-payment`,
        payload
      );

      if (res.data.success) {
        navigate("/ticket-success", {
          state: {
            bookingDetails: {
              ...bookingData,
              pnr: res.data.pnr,
            },
          },
        });
      }
    } catch (err) {
      console.error(err);
      alert("Booking Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page">

      {/* 🔝 HEADER */}
      <div className="top-bar">
        <h2>BusBooking</h2>
        <div className="steps">
          <span>Search</span>
          <span>Select Bus</span>
          <span className="active">Payment</span>
        </div>
      </div>

      <h1 className="title">Complete Your Payment</h1>
      <p className="subtitle">Securely pay for your bus ticket booking.</p>

      <div className="payment-container">

        {/* LEFT SIDE */}
        <div className="payment-left">

          {/* TABS */}
          <div className="tabs">
            <button onClick={() => setActiveTab("card")} className={activeTab==="card"?"active":""}>Card</button>
            <button onClick={() => setActiveTab("upi")}>UPI</button>
            <button onClick={() => setActiveTab("wallet")}>Wallets</button>
          </div>

          {/* CARD FORM */}
          {activeTab === "card" && (
            <div className="card-box">
              <input placeholder="Card Number" />
              <div className="row">
                <input placeholder="MM/YY" />
                <input placeholder="CVV" />
              </div>
              <input placeholder="Card Holder Name" />
              <button className="pay-btn" onClick={handlePayment}>
                {isProcessing ? "Processing..." : `Pay ₹${totalAmount}`}
              </button>
            </div>
          )}

          {/* UPI */}
          {activeTab === "upi" && (
            <div className="card-box">
              <input placeholder="Enter UPI ID" />
              <button className="pay-btn" onClick={handlePayment}>
                Pay ₹{totalAmount}
              </button>
            </div>
          )}

          {/* WALLET */}
          {activeTab === "wallet" && (
            <div className="card-box">
              <p>Select Wallet</p>
              <button className="pay-btn" onClick={handlePayment}>
                Pay ₹{totalAmount}
              </button>
            </div>
          )}

        </div>

        {/* RIGHT SIDE (SUMMARY) */}
        <div className="payment-right">
          <h3>Fare Summary</h3>

          <p><strong>Bus:</strong> {busName}</p>
          <p><strong>Route:</strong> {from} → {to}</p>
          <p><strong>Seats:</strong> {selectedSeats?.join(", ")}</p>

          <hr />

          <p>Total Amount:</p>
          <h2>₹{totalAmount}</h2>

          <p className="secure">100% Secure Payment</p>
        </div>

      </div>
    </div>
  );
};

export default PaymentSelection;