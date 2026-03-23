import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // दुरुस्ती: BookingSummary कडून डेटा थेट state मध्ये येतोय, bookingDetails मध्ये नाही
  // म्हणून आपण दोन्ही चेक करूया जेणेकरून कोड फाटणार नाही
  const bookingDetails = location.state?.bookingDetails || location.state || null;

  // --- DEBUGGING ---
  useEffect(() => {
    console.log("Received Booking Details in PaymentPage:", bookingDetails);
  }, [bookingDetails]);

  // १. किंमत काढण्याचे सर्व शक्य मार्ग
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

  // २. लॉगिन असलेल्या युजरची माहिती मिळवणे
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // ३. पॅसेंजर फॉर्म स्टेट
  const [contactInfo, setContactInfo] = useState({
    fullName: loggedInUser ? loggedInUser.name : "",
    email: loggedInUser ? loggedInUser.email : "",
    mobile: loggedInUser ? (loggedInUser.mobile || bookingDetails?.formData?.mobile || "") : "",
  });

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  // डेटा नसेल तर एरर मेसेज दाखवा
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

  // डेटा मधून आवश्यक गोष्टी काढणे (selectedSeats पण चेक केले आहे)
  const { busName, seats, selectedSeats, busId } = bookingDetails;
  const finalSeats = seats || selectedSeats;

  const handlePayment = async () => {
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.mobile) {
      alert("कृपया सर्व माहिती भरा!");
      return;
    }

    // तुझ्या मागणीनुसार: इथून आपण आता PaymentSelection (/payment-selection) कडे जाणार आहोत
    // आपण डेटा पुढे पास करत आहोत
    navigate("/payment-selection", { 
      state: { 
        ...bookingDetails, 
        ...contactInfo,
        totalAmount: displayAmount,
        seats: finalSeats 
      } 
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

        <button className="pay-now-btn" onClick={handlePayment}>
          CONTINUE TO PAYMENT SELECTION ₹{displayAmount}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;