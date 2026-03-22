import React, { useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  // ✅ १. तारीख रिकामी राहू नये म्हणून 'today' व्हेरिएबल तयार केले
  const today = new Date().toISOString().split('T')[0];
  
  // ✅ २. डिफॉल्ट स्टेटमध्ये आजची तारीख दिली आहे
  const [date, setDate] = useState(today);

  const handleSearch = () => {
    // ✅ ३. व्हॅलिडेशन: जर युजरने तारीख चुकून डिलीट केली तर ती पुन्हा आजची तारीख सेट होईल
    const searchDate = date || today;

    if (!from || !to) {
      alert("Please fill all fields");
      return;
    }

    // ✅ ४. URL बरोबर जावी आणि स्पेसमुळे एरर येऊ नये म्हणून trim() आणि encodeURIComponent वापरले आहे
    const query = new URLSearchParams({
      from: from.trim().toLowerCase(),
      to: to.trim().toLowerCase(),
      date: searchDate
    }).toString();

    navigate(`/search?${query}`);
  };

  // पॉपुलर रूट्ससाठी कॉमन फंक्शन
  const handleRouteSearch = (source, destination) => {
    const searchDate = date || today;
    
    const query = new URLSearchParams({
      from: source.toLowerCase(),
      to: destination.toLowerCase(),
      date: searchDate
    }).toString();

    navigate(`/search?${query}`);
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
            <input 
              type="text" 
              placeholder="Select Origin" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label>To</label>
            <input 
              type="text" 
              placeholder="Select Destination" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label>Journey Date</label>
            <input 
              type="date" 
              value={date} 
              // ✅ ५. मिनिमम तारीख आजची ठेवली आहे जेणेकरून मागील तारखेचे बुकिंग होणार नाही
              min={today}
              onChange={(e) => setDate(e.target.value)} 
            />
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

      {/* POPULAR ROUTES */}
      <div className="routes">
        <h2 className="section-title">Popular Routes</h2>
        <div className="route-list">
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