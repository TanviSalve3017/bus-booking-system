import React, { useState } from "react";
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

  const [activeMethod, setActiveMethod] = useState("upi");
  const [selectedBank, setSelectedBank] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://bus-booking-backend-zd3f.onrender.com";

  const handlePaymentSubmit = async () => {
    if (!passengers || passengers.length === 0) {
      alert("Passenger data missing!");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        bookingDetails: {
          bus_id: bus_id || busId,
          user_id: user?.id || 1,
          passenger_name: passengers.map(p => p.name).join(", "),
          passenger_age: passengers.map(p => p.age).join(", "),
          passenger_email: email,
          passenger_mobile: mobile,
          seats: selectedSeats,
          total_amount: finalAmount,
          travel_date: travelDate
        }
      };

      const res = await axios.post(`${API_BASE_URL}/api/verify-payment`, payload);

      if (res.data.success) {
        navigate("/ticket-success", {
          state: {
            bookingDetails: {
              ...data,
              pnr: res.data.pnr
            }
          }
        });
      } else {
        throw new Error();
      }

    } catch (err) {
      console.error(err);
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
        <p>Seats: {selectedSeats?.join(", ")}</p>
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

          <select onChange={(e) => setSelectedBank(e.target.value)}>
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

          <button>Amazon Pay</button>
          <button>Paytm Wallet</button>
          <button>MobiKwik</button>
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