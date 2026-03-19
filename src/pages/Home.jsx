import React, { useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // आजची तारीख डिफॉल्ट सेट केली आहे जेणेकरून पॉपुलर रूट्सवर क्लिक केल्यावर एरर येणार नाही
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  // पॉपुलर रूट्ससाठी कॉमन फंक्शन
  const handleRouteSearch = (source, destination) => {
    navigate(`/search?from=${source}&to=${destination}&date=${date}`);
  };

  return (
    <div className="home">
      {/* HERO SECTION */}
      <div className="hero">
        <h1>Book Bus Tickets Easily</h1>
        <p>Find and book your bus tickets in minutes!</p>

        <div className="search-box">
          <div className="input-group">
            <label>From</label>
            <input type="text" placeholder="Select Origin" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="input-group">
            <label>To</label>
            <input type="text" placeholder="Select Destination" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Journey Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-container">
        <div className="feature-card">
          <div className="icon">🛡️</div>
          <h3>Secure Booking</h3>
          <p>Safe & Reliable</p>
        </div>
        <div className="feature-card">
          <div className="icon">✅</div>
          <h3>Fast Confirmation</h3>
          <p>Instant E-Ticket</p>
        </div>
        <div className="feature-card">
          <div className="icon">🔄</div>
          <h3>Easy Cancellation</h3>
          <p>Hassle-Free Refunds</p>
        </div>
        <div className="feature-card">
          <div className="icon">🎧</div>
          <h3>24/7 Support</h3>
          <p>We're Here to Help</p>
        </div>
      </div>

      {/* POPULAR ROUTES - येथे दुरुस्ती केली आहे */}
      <div className="routes">
        <h2 className="section-title">Popular Routes</h2>
        <div className="route-list">
          {/* Mumbai to Pune क्लिक केल्यावर आता From Mumbai आणि To Pune च जाईल */}
          <div onClick={() => handleRouteSearch("mumbai", "pune")} className="route-item">
            Mumbai to Pune <span>›</span>
          </div>
          
          <div onClick={() => handleRouteSearch("delhi", "jaipur")} className="route-item">
            Delhi to Jaipur <span>›</span>
          </div>
          
          <div onClick={() => handleRouteSearch("bangalore", "hyderabad")} className="route-item">
            Bangalore to Hyderabad <span>›</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <span>About Us</span> • <span>Contact Us</span> • <span>Terms & Conditions</span>
        </div>
        <p>© 2026 BusBooking. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;