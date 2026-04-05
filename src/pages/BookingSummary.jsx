import React, { useState, useEffect } from "react";
import "../styles/BookingSummary.css";
import { useTranslation } from "react-i18next"; 
import { useNavigate } from "react-router-dom"; 
import PaymentSelection from "./PaymentSelection"; 

const BookingSummary = ({ selectedSeats = [], price = 0, onConfirm, from, to, busName, busId, travelDate }) => {
  const { t, i18n } = useTranslation(); 
  const navigate = useNavigate(); 
  const [step, setStep] = useState(1); 
  const [insurance, setInsurance] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });
  const [otp, setOtp] = useState(""); 
  const [showPayment, setShowPayment] = useState(false); 

  // १. पॅसेंजर स्टेट - प्रवाशांची माहिती साठवण्यासाठी
  const [passengers, setPassengers] = useState([]);

  // २. जेव्हा selectedSeats बदलतील, तेव्हा प्रवाशांची रिकामी फील्ड्स तयार करणे
  useEffect(() => {
    if (selectedSeats && selectedSeats.length > 0) {
      setPassengers(selectedSeats.map(seat => ({ seat, name: "", age: "", gender: "M" })));
    }
  }, [selectedSeats]);

  const [formData, setFormData] = useState({
    email: "", mobile: "", boardingPoint: from, droppingPoint: to
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const seatRate = Number(price) || 0;
  const basePrice = seatRate * selectedSeats.length;
  const gst = Math.round(basePrice * 0.05);
  const insurancePrice = insurance ? 15 * selectedSeats.length : 0;
  const totalAmount = basePrice + gst + insurancePrice;

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault(); 
    if (!termsAccepted) {
      alert(t('accept_terms_alert') || "कृपया नियम आणि अटी मान्य करा!");
      return;
    }

    // --- नवीन FEMALE LOGIC सुरुवात (Line 74 च्या आसपास) ---
    // आपण निवडलेल्या सीट्सपैकी कोणत्या महिलांसाठी आहेत ते शोधूया
    // (टीप: बसच्या डेटाबेसमधून 'reserved_for' माहिती आपण 'passengers' सोबत पडताळून पाहू शकतो)
    
    const maleOnFemaleSeat = passengers.some(p => {
        // जर प्रवाशाचे लिंग 'M' (Male) असेल...
        // आणि त्याने निवडलेली सीट 'L1', 'L2', '1A' इ. पैकी असेल जी महिलांसाठी राखीव आहे
        const femaleReservedSeats = ['L1', 'L2', '1A', '1B', 'L12', '2A']; // तुझ्या SQL नुसार
        return p.gender === 'M' && femaleReservedSeats.includes(p.seat);
    });

    if (maleOnFemaleSeat) {
        alert("Sorry! Some of the seats you selected are reserved for women only. Please select a general seat.");
        return;
    }
    // --- नवीन FEMALE LOGIC संपले ---

    const isIncomplete = passengers.some(p => p.name.trim() === "" || p.age === "");
    if (isIncomplete) {
      alert("कृपया सर्व प्रवाशांची माहिती पूर्ण भरा!");
      return;
    }
    setStep(2); 
  };

  const handleFinalConfirm = (e) => {
    e.preventDefault(); 
    if (otp.length !== 4) {
      alert(t('enter_valid_otp') || "कृपया ४ अंकी योग्य OTP टाका!");
      return;
    }
    
    // नेव्हिगेट करताना सर्व डेटा (पॅसेंजर्ससह) पाठवणे
   const finalBookingDetails = {
      totalAmount: totalAmount, 
      busName: busName, 
      from: from, 
      to: to, 
      selectedSeats: selectedSeats, 
      busId: busId,
      travelDate: travelDate || "2026-03-17", 
      passengers: passengers, // यामध्ये प्रत्येक प्रवाशाचे नाव, वय आणि लिंग (M/F) आहेच.
      formData: formData,
      pnr: "PNR" + Math.floor(100000 + Math.random() * 900000)
    };

    console.log("Data being sent to Ticket:", finalBookingDetails);

    navigate("/payment", { 
      state: { bookingDetails: finalBookingDetails } 
    });
  };

  const handlePaymentComplete = (paymentId) => {
    const finalBookingData = {
      busId: busId,
      busName: busName,
      seats: selectedSeats,
      totalAmount: totalAmount,
      price_per_seat: seatRate,
      passengers: passengers,
      contact: formData,
      from: from,
      to: to,
      paymentId: paymentId 
    };
    onConfirm(finalBookingData); 
  };

  const openPolicy = (e, type) => {
    e.preventDefault();
    if (type === 'terms') {
      setModalContent({
        title: `📜 ${t('terms')}`, 
        text: t('terms_text') || "1. Tickets are non-transferable. 2. Original ID proof is mandatory during travel."
      });
    } else if (type === 'insurance') {
      setModalContent({
        title: `🛡️ ${t('insurance')}`, 
        text: t('insurance_text') || "1. Accidental insurance coverage up to ₹5,00,000."
      });
    } else {
      setModalContent({
        title: `🚫 ${t('cancellation_policy')}`, 
        text: t('cancellation_text') || "1. 70% refund if cancelled 24 hours before."
      });
    }
    setShowModal(true);
  };

  if (showPayment) {
    return (
      <div className="payment-step-wrapper anim-fade">
        <PaymentSelection 
          totalAmount={totalAmount}
          busName={busName}
          from={from}
          to={to}
          onPaymentSuccess={handlePaymentComplete}
        />
        <button className="back-to-summary-btn" onClick={() => setShowPayment(false)}>
          ← {t('back') || 'Go Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="premium-booking-card" key={i18n.language}>
      <div className="stepper-wrapper">
        <div className={`step-node ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`step-bar ${step === 2 ? "active" : ""}`}></div>
        <div className={`step-node ${step === 2 ? "active" : ""}`}>2</div>
      </div>

      <div className="glass-timer">
        <span className="icon">⏳</span> {t('seats_locked')} <span className="time-val">{formatTime(timeLeft)}</span>
      </div>

      <h2 className="main-title">{t('fare_summary')}</h2>

      <div className="fare-breakdown-card">
        <div className="fare-item">
          <span className="label">{t('base_fare')} ({selectedSeats.length} {t('seats')})</span>
          <span className="value">₹{basePrice}</span>
        </div>
        <div className="fare-item">
          <span className="label">{t('gst')}</span>
          <span className="value">₹{gst}</span>
        </div>
        <div className="fare-item">
          <span className="label">{t('insurance')} <small>₹15/seat</small></span>
          <span className="value">₹{insurancePrice}</span>
        </div>
        <div className="total-divider"></div>
        <div className="total-row">
          <span className="total-label">{t('total_amount')}</span>
          <span className="total-val">₹{totalAmount}</span>
        </div>
      </div>

      {step === 1 ? (
        <form className="form-slide-in" onSubmit={handleSubmitStep1}>
          <section className="input-section">
            <h5 className="section-head">👤 {t('contact_details')}</h5>
            <div className="input-grid">
              <input 
                type="tel" 
                required 
                pattern="[0-9]{10}" 
                placeholder={t('enter_mobile')} 
                className="modern-field" 
                onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
              />
              <input 
                type="email" 
                required 
                placeholder={t('enter_email')} 
                className="modern-field" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </section>

          <section className="input-section">
            <h5 className="section-head">📍 {t('boarding')} & {t('dropping')}</h5>
            <div className="input-grid">
              <select className="modern-field" readOnly disabled>
                <option>{t('boarding')} at {from}</option>
              </select>
              <select className="modern-field" readOnly disabled>
                <option>{t('dropping')} at {to}</option>
              </select>
            </div>
          </section>

          <section className="input-section">
            <h5 className="section-head">👥 {t('passenger_details')}</h5>
            <div className="passengers-scroll-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {passengers.length > 0 ? passengers.map((p, idx) => (
                <div key={idx} className="p-card-premium-v2">
                  <div className="p-card-header">
                    <span className="p-seat-tag">{t('seats')} {p.seat}</span>
                    <span className="p-label">{t('adult')} {idx + 1}</span>
                  </div>
                  
                  <div className="p-card-body">
                    <div className="input-with-icon">
                      <i className="user-icon">👤</i>
                      <input 
                        type="text" 
                        required
                        minLength="3"
                        placeholder={t('enter_name')} 
                        className="p-input-field name-field"
                        value={p.name}
                        onChange={(e) => handlePassengerChange(idx, "name", e.target.value)}
                      />
                    </div>

                    <div className="p-details-row">
                      <div className="age-box">
                        <input 
                          type="number" 
                          required
                          min="1"
                          max="100"
                          placeholder={t('age')} 
                          className="p-input-field age-field"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(idx, "age", e.target.value)}
                        />
                      </div>

                      <div className="gender-toggle-container">
                        <button 
                          type="button"
                          className={`gender-btn ${p.gender === 'M' ? 'selected male' : ''}`}
                          onClick={() => handlePassengerChange(idx, "gender", "M")}
                        >{t('male')}</button>
                        <button 
                          type="button"
                          className={`gender-btn ${p.gender === 'F' ? 'selected female' : ''}`}
                          onClick={() => handlePassengerChange(idx, "gender", "F")}
                        >{t('female')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <p style={{textAlign: 'center', padding: '10px'}}>{t('please_select_seats') || 'कृपया आधी जागा निवडा'}</p>
              )}
            </div>
          </section>

          <div className="policy-stack-vertical">
            <div className="check-item-row">
              <input type="checkbox" id="insurance" checked={insurance} onChange={() => setInsurance(!insurance)} />
              <label htmlFor="insurance">
                {t('secure_trip')} 
                <span className="view-benefits-link" onClick={(e) => openPolicy(e, 'insurance')}> ({t('view_benefits')})</span>
              </label>
            </div>
            <div className="check-item-row">
              <input type="checkbox" id="terms" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
              <label htmlFor="terms">
                {t('agree_text')} <span className="link" onClick={(e) => openPolicy(e, 'terms')}>{t('terms')}</span> & <span className="link" onClick={(e) => openPolicy(e, 'policy')}>{t('cancellation_policy')}</span>
              </label>
            </div>
          </div>

          <button type="submit" className="primary-btn-premium">
            {t('proceed_otp')}
          </button>
        </form>
      ) : (
        <form className="otp-view anim-fade" onSubmit={handleFinalConfirm}>
          <div className="otp-icon-wrap">
              <div className="otp-shield">🛡️</div>
          </div>
          <h3 className="otp-title">{t('otp_verification')}</h3>
          <p className="otp-subtitle">{t('sent_to')} +91 {formData.mobile}</p>
          
          <div className="otp-input-container">
            <input 
              type="text" 
              required 
              maxLength="4" 
              pattern="[0-9]{4}"
              placeholder="0 0 0 0" 
              className="motha-otp-field" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-btn-premium">
            {t('verify_pay')} ₹{totalAmount}
          </button>

          <div className="edit-info-box" onClick={() => setStep(1)}>
            <span>✏️ {t('edit_info')}</span>
          </div>
        </form>
      )}

      {showModal && (
        <div className="policy-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="policy-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalContent.title}</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>{modalContent.text}</p>
            </div>
            <button className="modal-btn" onClick={() => setShowModal(false)}>{t('got_it') || 'समजले'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;