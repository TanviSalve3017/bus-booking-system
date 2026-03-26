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

  // ✅ १. डायनॅमिक URL लॉजिक (लोकल आणि रेंडर दोन्हीसाठी)
  const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5001" 
    : "https://bus-booking-backend-zd3f.onrender.com";

  // Booking details मधून सर्व डेटा व्यवस्थित बाहेर काढणे
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

  const translations = {
    en: {
      route: `${from || "Route"} → ${to || ""}`, method: "Choose Payment Method", upi: "UPI", card: "Debit / Credit Card",
      cardNum: "Card Number", expiry: "Expiry Date", cvv: "CVV", netbanking: "Net Banking",
      wallet: "Wallet", payBtn: `PROCEED TO PAY ₹${totalAmount || 0}`, date: "Travel Date", bus: "Bus", seat: "Seat", fare: "Total Fare",
      upiPlaceholder: "Enter UPI ID (e.g. user@abc)", processing: "Processing Payment... Please wait"
    },
    mr: {
      route: `${from || "प्रवास"} → ${to || ""}`, method: "पेमेंट पद्धत निवडा", upi: "UPI", card: "डेबिट / क्रेडिट कार्ड",
      cardNum: "कार्ड नंबर", expiry: "एक्सपायरी तारीख", cvv: "सीव्हीव्ही", netbanking: "नेट बँकिंग",
      wallet: "वॉलेट", payBtn: `₹${totalAmount || 0} भरण्यासाठी पुढे जा`, date: "प्रवासाची तारीख", bus: "बस", seat: "सीट", fare: "एकूण भाडे",
      upiPlaceholder: "UPI ID टाका (उदा. user@abc)", processing: "पेमेंट प्रक्रिया सुरू आहे... कृपया थांबा"
    },
    hi: {
      route: `${from || "यात्रा"} → ${to || ""}`, method: "भुगतान विधि चुनें", upi: "UPI", card: "डेबिट / क्रेडिट कार्ड",
      cardNum: "कार्ड नंबर", expiry: "समाप्ति तिथि", cvv: "सीवीवी", netbanking: "नेट बैंकिंग",
      wallet: "वॉलेट", payBtn: `₹${totalAmount || 0} भुगतान के लिए आगे बढ़ें`, date: "यात्रा की तिथि", bus: "बस", seat: "सीट", fare: "कुल किराया",
      upiPlaceholder: "UPI ID दर्ज करें (जैसे user@abc)", processing: "भुगतान संसाधित हो रहा है... कृपया प्रतीक्षा करें"
    }
  };

  const t = translations[lang] || translations.en;
  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda"];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!activeMethod && !selectedBank) {
        alert(lang === "mr" ? "कृपया एक पेमेंट पद्धत निवडा!" : "Please select a payment method!");
        return;
    }

    setIsProcessing(true);

    try {
        // ✅ पेलोड फिक्स: सर्व कीज (Keys) बॅकेंडच्या अपेक्षेप्रमाणे आहेत
        const payload = {
            bookingDetails: {
                busId: busId || bus_id,
                user_id: user?.user_id || user?.id || 1,
                fullName: fullName || "Guest User",
                email: email || "guest@test.com",
                mobile: mobile || "0000000000",
                passengers: passengers || [], 
                seats: (selectedSeats && selectedSeats.length > 0) ? selectedSeats : ["1A"],
                totalAmount: totalAmount || 0, 
                travelDate: travelDate || new Date().toISOString().split("T")[0],
                razorpayOrderId: "DIRECT_ORD_" + Date.now(),
                razorpayPaymentId: "DIRECT_PAY_" + Date.now()
            }
        };

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
                            selectedSeats, 
                            totalAmount, 
                            travelDate, 
                            passengers: passengers,
                            pnr: response.data.pnr 
                        } 
                    } 
                });
            }, 2000);
        } else {
            throw new Error("Database insertion failed");
        }

    } catch (error) {
        console.error("Booking Error:", error);
        setIsProcessing(false);
        alert("तांत्रिक अडचण! डेटाबेसमध्ये बुकिंग सेव्ह होऊ शकले नाही.");
    }
  };

  return (
    <div className="real-pg-wrapper">
      {isProcessing && (
        <div className="payment-loader-overlay">
          <div className="loader-box">
            <div className="spinner"></div>
            <p>{t.processing}</p>
          </div>
        </div>
      )}

      <div className="real-pg-container">
        <div className="lang-header">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="mr">मराठी</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <div className="summary-box">
          <div className="summary-route"><strong>{t.route}</strong></div>
          <div className="summary-grid">
            <div className="left-info">
              <p>{t.date}: {travelDate || "Selected Date"}</p>
              <p>{t.bus}: {busName || "Not Specified"}</p>
              <p>{t.seat}: {selectedSeats?.join(", ") || "None"}</p>
            </div>
            <div className="right-fare">
              <span>{t.fare}: <strong>₹{totalAmount || 0}</strong></span>
            </div>
          </div>
        </div>

        <h4 className="payment-title-text">{t.method}</h4>

        <form onSubmit={handlePaymentSubmit}>
          <div className={`method-box ${activeMethod.startsWith('upi') ? 'selected-box' : ''}`}>
            <div className="method-label">{t.upi}</div>
            <div className="upi-button-group">
              <button type="button" onClick={() => setActiveMethod("upi-phonepe")} className={`upi-item ${activeMethod === "upi-phonepe" ? "active-btn" : ""}`}>
                <img src="https://img.icons8.com/color/24/phone-pe.png" alt="p"/> PhonePe
              </button>
              <button type="button" onClick={() => setActiveMethod("upi-gpay")} className={`upi-item ${activeMethod === "upi-gpay" ? "active-btn" : ""}`}>
                <img src="https://img.icons8.com/color/24/google-logo.png" alt="g"/> Google Pay
              </button>
              <button type="button" onClick={() => setActiveMethod("upi-paytm")} className={`upi-item ${activeMethod === "upi-paytm" ? "active-btn" : ""}`}>
                <img src="https://img.icons8.com/color/24/paytm.png" alt="pt"/> Paytm
              </button>
            </div>
            {activeMethod.startsWith('upi') && (
              <div className="upi-input-field animated-fade">
                <input type="text" placeholder={t.upiPlaceholder} required autoComplete="off" />
              </div>
            )}
          </div>

          <div className={`method-box ${activeMethod === 'card' ? 'selected-box' : ''}`} onClick={() => setActiveMethod("card")}>
            <div className="method-label">{t.card}</div>
            <div className="card-input-container">
              <div className="full-input">
                <input type="text" placeholder={t.cardNum} required maxLength="16" pattern="\d*" title="फक्त १६ अंकी कार्ड नंबर टाका" autoComplete="off" />
              </div>
              <div className="split-input">
                <input type="text" placeholder={t.expiry} required maxLength="5" pattern="\d\d/\d\d" title="MM/YY फॉरमॅट मध्ये टाका" autoComplete="off" />
                <input type="password" placeholder={t.cvv} required maxLength="3" pattern="\d*" autoComplete="new-password" />
              </div>
              <div className="card-support-icons">
                <img src="https://img.icons8.com/color/32/visa.png" alt="v" />
                <img src="https://img.icons8.com/color/32/mastercard.png" alt="m" />
                <img src="https://img.icons8.com/color/32/rupay.png" alt="r" />
              </div>
            </div>
          </div>

          <div className={`method-box ${selectedBank ? 'selected-box' : ''}`}>
            <div className="method-label">{t.netbanking}</div>
            <div className="nb-body">
              <img src="https://img.icons8.com/ios-filled/24/bank.png" alt="b" />
              <select className="nb-select" required value={selectedBank} onChange={(e) => {setSelectedBank(e.target.value); setActiveMethod("netbanking")}}>
                <option value="">Select Your Bank </option>
                {banks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
              </select>
            </div>
          </div>

          <div className={`method-box ${activeMethod.startsWith('wal') ? 'selected-box' : ''}`}>
            <div className="method-label">{t.wallet}</div>
            <div className="wallet-list">
              <div className={`wallet-option ${activeMethod === "wal-amazon" ? "active-wallet" : ""}`} onClick={() => setActiveMethod("wal-amazon")}>
                <img src="https://img.icons8.com/color/24/amazon-pay.png" alt="ap"/> Amazon Pay
              </div>
              <div className={`wallet-option ${activeMethod === "wal-paytm" ? "active-wallet" : ""}`} onClick={() => setActiveMethod("wal-paytm")}>
                <img src="https://img.icons8.com/color/24/wallet.png" alt="pw"/> Paytm Wallet
              </div>
              <div className={`wallet-option ${activeMethod === "wal-mobi" ? "active-wallet" : ""}`} onClick={() => setActiveMethod("wal-mobi")}>
                <img src="https://img.icons8.com/color/24/mobi-kwik.png" alt="mk"/> MobiKwik
              </div>
            </div>
          </div>

          <button type="submit" className="payment-proceed-btn" disabled={isProcessing}>
            {isProcessing ? "..." : t.payBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentSelection;