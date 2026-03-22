import React, { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import SeatLayout from "./SeatLayout";
import BookingSummary from "./BookingSummary"; 
import PaymentPage from "./PaymentPage"; 
import "../styles/BusList.css"; 
import busImg from "../assets/bus.image.png";

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busType, setBusType] = useState(""); 
  const [priceRange, setPriceRange] = useState(1000);
  const [operator, setOperator] = useState(""); 
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [busSeats, setBusSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const [isPaymentStep, setIsPaymentStep] = useState(false);

  const location = useLocation();
  const navigate = useNavigate(); 
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from") || "";
  const to = queryParams.get("to") || "";
  
  // 🔥 बदल १: URL मधून आलेली तारीख घेतली, जर नसेल तर आजची तारीख डिफॉल्ट ठेवली (हार्डकोडेड १० मार्च काढली)
  const travelDate = queryParams.get("date") || new Date().toISOString().split('T')[0];

  const toggleAmenity = (am) => {
    setSelectedAmenities(prev => 
      prev.includes(am) ? prev.filter(item => item !== am) : [...prev, am]
    );
  };

  // ✅ १. fetchBuses फंक्शन - हे आता फक्त आवश्यक असेल तेव्हाच कॉल होईल
  const fetchBuses = useCallback(async () => {
    if (!from || !to) return; // जर ठिकाण नसेल तर कॉल करू नका
    
    setLoading(true);
    try {
      const res = await api.get("/api/buses", {
        params: { 
          from: from.trim().toLowerCase(), 
          to: to.trim().toLowerCase(), 
          date: travelDate, // 🔥 बदल २: बॅकएंडला 'date' पॅरामीटर पाठवला जेणेकरून फिल्टर काम करेल
          busType: busType || undefined, 
          maxPrice: priceRange, 
          operator: operator || undefined, 
          amenities: selectedAmenities.length > 0 ? selectedAmenities.join(',') : undefined 
        }
      });
      
      // ✅ २. थेट नवीन डेटा सेट करा, ज्यामुळे ड्युप्लिकेट होणार नाहीत
      setBuses(res.data);
    } catch (e) { 
      console.error("Fetch error details:", e.response?.data || e.message); 
    } finally {
      setLoading(false);
    }
    // 🔥 बदल ३: travelDate ला dependency list मध्ये ऍड केले
  }, [from, to, travelDate, busType, priceRange, operator, selectedAmenities]);

  // ✅ ३. फक्त From, To आणि travelDate बदलल्यावरच सुरुवातीला डेटा आणा
  useEffect(() => { 
    fetchBuses(); 
  }, [from, to, travelDate, fetchBuses]); 

  const handleSelectSeat = async (busId) => {
    if (selectedBusId === busId) {
      setSelectedBusId(null);
      setSelectedSeats([]);
      return;
    }
    try {
      const res = await api.get(`/api/seats/${busId}`);
      setBusSeats(res.data);
      setSelectedBusId(busId);
      setSelectedSeats([]);
    } catch (e) { 
        console.error("Error fetching seats:", e.response?.data || e.message); 
    }
  };

  const toggleSeatSelection = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) return prev.filter(s => s !== seatNumber);
      if (prev.length >= 6) {
        alert("भावा, एका वेळी फक्त ६ सीट्स बुक करता येतात!");
        return prev;
      }
      return [...prev, seatNumber];
    });
  };

  const onBookingConfirm = (data) => {
    const selectedBus = buses.find(b => b.bus_id === selectedBusId);
    const completeData = {
      busId: selectedBusId,
      busName: selectedBus?.operator_name || "Luxury Travels",
      from: from,
      to: to,
      travelDate: travelDate, // ✅ ही तारीख आता पेमेंट पेजवर बरोबर जाईल
      seats: selectedSeats,
      totalFare: data.totalAmount, 
      totalAmount: data.totalAmount, 
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      boardingPoint: data.boardingPoint,
      droppingPoint: data.droppingPoint
    };
    
    navigate("/payment", { state: { bookingDetails: completeData } });
  };

  return (
    <div className="bus-list-page-wrapper">
      {isPaymentStep ? (
        <PaymentPage />
      ) : (
        <>
          <aside className="filters-sidebar-modern">
            <h2 className="filter-heading">Filters</h2>
            
            <div className="filter-section">
              <p className="section-label">Bus Type</p>
              <div className="options-stack-vertical">
                {["AC Sleeper", "Non-AC Seater", "AC Seater"].map(t => (
                  <label key={t} className="custom-check-label">
                    <input type="radio" name="type" checked={busType === t} onChange={() => setBusType(t)} /> 
                    <span className="check-text">{t}</span>
                  </label>
                ))}
              </div>
              <span onClick={() => setBusType("")} className="clear-text" style={{cursor: "pointer", color: "#d84e55"}}>Clear All</span>
            </div>

            <div className="filter-section">
              <p className="section-label">Max Price: <span className="price-val">₹{priceRange}</span></p>
              <input type="range" min="200" max="5000" step="50" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="slider" />
            </div>

            <div className="filter-section">
              <p className="section-label">Amenities</p>
              <div className="options-stack-vertical">
                {["WiFi", "AC", "Charging Point", "Blanket"].map(am => (
                  <label key={am} className="custom-check-label">
                    <input type="checkbox" checked={selectedAmenities.includes(am)} onChange={() => toggleAmenity(am)} /> 
                    <span className="check-text">{am}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <p className="section-label">Operator</p>
              <select className="operator-select" value={operator} onChange={(e) => setOperator(e.target.value)}>
                <option value="">All Operators</option>
                <option value="Shivneri Private Luxury">Shivneri Private Luxury</option>
                <option value="Neeta Travels">Neeta Travels</option>
                <option value="Red Prime">Red Prime</option>
                <option value="Purple Metrolink">Purple Metrolink</option>
                <option value="VRL Travels">VRL Travels</option>
                <option value="MSRTC Hirkani">MSRTC Hirkani</option>
                <option value="Khurana Travels">Khurana Travels</option>
                <option value="National Travels">National Travels</option>
                <option value="Prasanna Purple">Prasanna Purple</option>
                <option value="Saini Travels">Saini Travels</option>
                <option value="Chintamani Travels">Chintamani Travels</option>
              </select>
            </div>
            {/* ✅ Apply Filters बटण दाबल्यावरच नवीन डेटा येईल */}
            <button className="apply-btn-red" onClick={fetchBuses}>Apply Filters</button>
          </aside>

          <main className="bus-results-container">
            <h2 className="route-title">{from.toUpperCase()} to {to.toUpperCase()}</h2>
            <p className="selected-date-display">Journey Date: {travelDate}</p> {/* ✅ युजरला तारीख दिसावी म्हणून */}
            {loading ? ( <p className="status-msg">Finding buses...</p> ) : (
              buses.length > 0 ? (
                // ✅ ४. Key म्हणून bus.bus_id वापरला आहे जेणेकरून ड्युप्लिकेट रेंडर होणार नाहीत
                buses.map((bus, index) => (
                  <div key={bus.bus_id || index} className="modern-bus-card-wrapper">
                    <div className="bus-card-main">
                      <div className="bus-info-left">
                        <h2 className="operator-name">{bus.operator_name}</h2>
                        <p className="bus-model-name" style={{margin: "0", color: "#d84e55", fontWeight: "bold"}}>{bus.bus_name}</p>
                        <p className="bus-type-text">{bus.bus_type}</p>
                        <div className="timeline-row">
                          <div className="time-box">
                            <span className="time-main">{bus.departure_time?.slice(0, 5)}</span>
                            <span className="city-sub">{from}</span>
                          </div>
                          <div className="arrow-divider">
                            <span>→</span>
                            <small>Duration</small>
                          </div>
                          <div className="time-box">
                            <span className="time-main">{bus.arrival_time?.slice(0, 5)}</span>
                            <span className="city-sub">{to}</span>
                          </div>
                        </div>
                        <div className="rating-row">
                          <span className="star-icons">⭐⭐⭐⭐</span>
                          <span className="rating-num">{bus.rating}</span>
                        </div>
                      </div>
                      <div className="bus-action-right">
                        <img src={busImg} alt="bus" className="bus-card-img" />
                        <div className="price-tag">₹{bus.price_per_seat}</div>
                        <button className="select-seat-btn" onClick={() => handleSelectSeat(bus.bus_id)}>
                          {selectedBusId === bus.bus_id ? "Close" : "Select Seat"}
                        </button>
                      </div>
                    </div>

                    {selectedBusId === bus.bus_id && (
                      <div className="seat-drawer">
                        <div className="drawer-content">
                            <SeatLayout 
                              busSeats={busSeats} 
                              selectedSeats={selectedSeats} 
                              toggleSeatSelection={toggleSeatSelection} 
                            />
                          {selectedSeats.length > 0 && (
                              <BookingSummary
                                selectedSeats={selectedSeats} 
                                price={bus.price_per_seat} 
                                onConfirm={onBookingConfirm} 
                                from={from}
                                to={to}
                                busName={bus.operator_name} 
                                busId={bus.bus_id}      
                                travelDate={travelDate}    
                              />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : ( <p className="status-msg">No buses found for this route on {travelDate}.</p> )
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default BusList;