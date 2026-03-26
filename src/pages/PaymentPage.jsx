import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingDetails = location.state?.bookingDetails || location.state || null;

  useEffect(() => {
    console.log("Received Booking Details in PaymentPage:", bookingDetails);
  }, [bookingDetails]);

  const getAmount = () => {
    if (!bookingDetails) return 0;
    
    if (bookingDetails.totalAmount > 0) return bookingDetails.totalAmount;
    if (bookingDetails.totalFare > 0) return bookingDetails.totalFare;
    if (bookingDetails.price > 0) return bookingDetails.price;

    const perSeatPrice = bookingDetails.price_per_seat || bookingDetails.bus_price || 0;
    const seatCount = bookingDetails.seats?.length || bookingDetails.selectedSeats?.length || 1;
    
    return perSeatPrice * seatCount;
  };

  const displayAmount = getAmount();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [contactInfo, setContactInfo] = useState({
    fullName: loggedInUser ? loggedInUser.name : "",
    email: loggedInUser ? loggedInUser.email : "",
    mobile: loggedInUser ? (loggedInUser.mobile || bookingDetails?.formData?.mobile || "") : "",
  });

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  // 🔥 Passenger Logic
  const { busName, seats, selectedSeats, busId, travelDate, from, to } = bookingDetails || {};
  const finalSeats = seats || selectedSeats || [];

  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    if (finalSeats && finalSeats.length > 0) {
      setPassengers(prev => {
        if (prev.length === finalSeats.length) return prev;
        return finalSeats.map(seat => ({
          name: "",
          age: "",
          gender: "Male",
          seat: seat
        }));
      });
    }
  }, [finalSeats]);

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // 🔥 NEW: Debugging
  useEffect(() => {
    console.log("🧪 Seats:", finalSeats);
    console.log("🧪 Passengers:", passengers);
    console.log("🧪 Amount:", displayAmount);
  }, [finalSeats, passengers, displayAmount]);

  if (!bookingDetails) {
    return (
      <div className="payment-main-container">
        <div className="payment-card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "white" }}>डेटा सापडला नाही! (Information not available)</h3>
          <button onClick={() => navigate("/")} className="pay-now-btn">होमवर जा</button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    // १. व्हॅलिडेशन: कॉन्टॅक्ट माहिती
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.mobile) {
      alert("कृपया सर्व माहिती भरा!");
      return;
    }

    // २. व्हॅलिडेशन: बस आणि सीट माहिती
    if (!busId) {
      alert("Bus ID missing!");
      return;
    }

    if (!finalSeats || finalSeats.length === 0) {
      alert("No seats selected!");
      return;
    }

    // ३. व्हॅलिडेशन: प्रत्येक पॅसेंजरची माहिती
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.age) {
        alert(`पॅसेंजर ${i + 1} ची माहिती अपूर्ण आहे!`);
        return;
      }
      if (p.age < 1 || p.age > 100) {
        alert(`पॅसेंजर ${i + 1} चे वय अयोग्य आहे!`);
        return;
      }
    }

    // ४. डेटा एकत्र करणे (Normalize Data)
    const finalBookingData = {
      busId: busId,
      seats: finalSeats,
      selectedSeats: finalSeats,
      fullName: contactInfo.fullName,
      email: contactInfo.email,
      mobile: contactInfo.mobile,
      totalAmount: displayAmount,
      travelDate: travelDate || bookingDetails.travel_date || null,
      passengers: passengers, 
      from: from || "N/A",
      to: to || "N/A",
      busName: busName || "N/A"
    };

    console.log("🚀 FINAL DATA SENT TO PAYMENT SELECTION:", finalBookingData);

    // ५. नेव्हिगेशन (फक्त एकदाच कॉल केला आहे)
    navigate("/payment-selection", { 
      state: { bookingDetails: finalBookingData } 
    });
  };

  return (
    <div className="payment-main-container">
      <div className="payment-card">
        <h2 className="pay-title">Final Booking Summary</h2>

        <div className="booking-summary-box">
          <div className="summary-row">
            <span>Bus:</span>
            <strong>{busName || "N/A"}</strong>
          </div>
          <div className="summary-row">
            <span>Route:</span>
            <strong>{from || "N/A"} → {to || "N/A"}</strong>
          </div>
          <div className="summary-row">
            <span>Seats:</span>
            <strong>{finalSeats?.join(", ") || "None"}</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total Amount:</span>
            <strong className="price-tag">₹{displayAmount}</strong>
          </div>
        </div>

        <div className="passenger-form-section">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={contactInfo.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={contactInfo.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="text" name="mobile" value={contactInfo.mobile} onChange={handleChange} required />
          </div>
        </div>

        <div className="passenger-section">
          <h3>Passenger Details</h3>

          {passengers.map((p, index) => (
            <div key={index} className="passenger-input-row" style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              <p><strong>Seat: {p.seat}</strong></p>

              <input
                type="text"
                placeholder="Name"
                className="p-input"
                value={p.name}
                onChange={(e) => updatePassenger(index, "name", e.target.value)}
              />

              <input
                type="number"
                placeholder="Age"
                className="p-input"
                value={p.age}
                onChange={(e) => updatePassenger(index, "age", e.target.value)}
              />

              <select
                className="p-input"
                value={p.gender}
                onChange={(e) => updatePassenger(index, "gender", e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          ))}
        </div>

        <button className="pay-now-btn" onClick={handlePayment}>
          CONTINUE TO PAYMENT SELECTION ₹{displayAmount}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;