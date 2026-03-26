import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; 
import html2canvas from "html2canvas";
import "../styles/TicketSuccess.css";

const TicketSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef();
  const [lang, setLang] = useState("en");

  const { bookingDetails } = location.state || {};

  useEffect(() => {
    console.log("Ticket Data Received:", bookingDetails);
  }, [bookingDetails]);

  // 🔥 AUTO REDIRECT SAFETY (NEW)
  useEffect(() => {
    if (!bookingDetails) {
      const timer = setTimeout(() => navigate("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingDetails, navigate]);

  // 🔥 SAFE DATA NORMALIZATION
  const safePassengers = bookingDetails?.passengers || [];
  const safeSeats = bookingDetails?.selectedSeats || bookingDetails?.seats || [];
  const safeFrom = bookingDetails?.from || "N/A";
  const safeTo = bookingDetails?.to || "N/A";
  const safeBus = bookingDetails?.busName || "Bus Not Available";
  const safeAmount = bookingDetails?.totalAmount || 0;
  const safeDate = bookingDetails?.travelDate || new Date().toISOString().split("T")[0];

  // 🔥 PNR FALLBACK (NEW)
  const safePNR = bookingDetails?.pnr || "TEMP" + Date.now();

  // 🔥 Dynamic time
  const departureTime = bookingDetails?.departureTime || "10:00 PM";
  const arrivalTime = bookingDetails?.arrivalTime || "06:00 AM";

  // 🔥 Gender formatter
  const formatGender = (g) => {
    if (!g) return "M";
    const val = g.toString().toLowerCase();
    if (val === "male" || val === "m") return "M";
    if (val === "female" || val === "f") return "F";
    return "M";
  };

  // 🔥 Passenger fallback
  const finalPassengerList = safePassengers.length > 0 
    ? safePassengers 
    : (safeSeats.length > 0 ? safeSeats.map((seat, index) => ({
        name: `Passenger ${index + 1}`,
        age: "--",
        gender: "M",
        seat: seat
      })) : []);

  // 🔥 TOTAL PASSENGER COUNT (NEW)
  const totalPassengers = finalPassengerList.length;

  // 🔥 Translations
  const translations = {
    en: {
      success: "Booking Successful!",
      subText: "Your ticket has been booked successfully.",
      pnr: "PNR NUMBER",
      busType: "Premium AC Sleeper | 2+1",
      passName: "Passenger Name",
      seat: "Seat",
      ageSex: "Age/Sex",
      date: "TRAVEL DATE",
      status: "STATUS",
      confirmed: "CONFIRMED",
      total: "Total Fare Paid",
      passengers: "Total Passengers",
      tc: "Terms & Conditions",
      tc1: "Please carry a valid Govt. ID proof during travel.",
      tc2: "Report 15 minutes before departure.",
      tc3: "Company not responsible for lost items.",
      btnPdf: "Download Ticket (PDF)",
      btnHome: "Back to Home"
    },
    mr: {
      success: "बुकिंग यशस्वी झाले!",
      subText: "तुमचे तिकीट यशस्वीरित्या बुक झाले आहे.",
      pnr: "पीएनआर नंबर",
      busType: "प्रीमियम एसी स्लीपर | २+१",
      passName: "प्रवाशाचे नाव",
      seat: "सीट",
      ageSex: "वय/लिंग",
      date: "प्रवासाची तारीख",
      status: "स्थिती",
      confirmed: "निश्चित",
      total: "एकूण भाडे",
      passengers: "प्रवासी संख्या",
      tc: "अटी आणि शर्ती",
      tc1: "ओळखपत्र सोबत ठेवा.",
      tc2: "१५ मिनिटे आधी या.",
      tc3: "सामानाची जबाबदारी नाही.",
      btnPdf: "PDF डाउनलोड करा",
      btnHome: "होम"
    }
  };

  const t = translations[lang] || translations.en;

  if (!bookingDetails) {
    return (
      <div className="error-container">
        <h3>Something went wrong!</h3>
        <p>Redirecting to home...</p>
      </div>
    );
  }

  // 🔥 IMPROVED PDF (MULTI PAGE SUPPORT)
  const handleDownloadPDF = async () => {
    const element = ticketRef.current;
    // html2canvas वापरून तिकीटाचा फोटो काढणे
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true, // QR कोड इमेजसाठी महत्वाचे
      logging: false 
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const imgWidth = 210; // A4 width
    const pageHeight = 295; // A4 height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // पहिली पेज जोडणे
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // जर तिकीट मोठे असेल तर नवीन पेजेस जोडणे
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Ticket_${safePNR}.pdf`);
  };

  return (
    <div className="ticket-page-wrapper">

      <div className="lang-selector-ticket" style={{ marginBottom: '20px' }}>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      <div className="success-header-top">
        <div className="check-icon">✓</div>
        <h2>{t.success}</h2>
        <p>{t.subText}</p>
      </div>

      <div className="ticket-main-container" ref={ticketRef}>

        <div className="ticket-top-strip">
          <div className="pnr-info">
            <span className="label">{t.pnr}</span>
            <h3 className="pnr-value">{safePNR}</h3>
          </div>
          <div className="qr-code-box">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${safePNR}`} 
              alt="QR Code" 
            />
          </div>
        </div>

        <div className="bus-branding">
          <h2>{safeBus}</h2>
          <p className="bus-type">{t.busType}</p>
        </div>

        <div className="journey-track">
          <div className="stop">
            <h4>{safeFrom}</h4>
            <p>{departureTime}</p>
          </div>
          <div className="bus-path">
            <div className="line"></div>
            <span className="bus-emoji">🚌</span>
            <div className="line"></div>
          </div>
          <div className="stop">
            <h4>{safeTo}</h4>
            <p>{arrivalTime}</p>
          </div>
        </div>

        <div className="ticket-divider"></div>

        <div className="passenger-section">
          <table className="passenger-table">
            <thead>
              <tr>
                <th>{t.passName}</th>
                <th>{t.seat}</th>
                <th>{t.ageSex}</th>
              </tr>
            </thead>
            <tbody>
              {finalPassengerList.map((p, index) => (
                <tr key={index}>
                  <td>{p.name}</td>
                  <td>{p.seat}</td>
                  <td>{p.age} / {formatGender(p.gender)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "15px", textAlign: "center", borderTop: "1px dashed #eee", paddingTop: "10px" }}>
          <strong>{t.passengers}: {totalPassengers}</strong>
        </div>

        <div className="travel-meta">
          <div className="meta-item">
            <span>{t.date}</span>
            <strong>{safeDate}</strong>
          </div>
          <div className="meta-item">
            <span>{t.status}</span>
            <span className="status-badge">{t.confirmed}</span>
          </div>
        </div>

        <div className="fare-footer">
          <span>{t.total}</span>
          <h3>₹{safeAmount}</h3>
        </div>

        <div className="ticket-instructions">
          <h4>{t.tc}</h4>
          <ul>
            <li>• {t.tc1}</li>
            <li>• {t.tc2}</li>
            <li>• {t.tc3}</li>
          </ul>
        </div>

      </div>

      <div className="action-buttons-fixed">
        <button className="download-btn-pdf" onClick={handleDownloadPDF}>
          {t.btnPdf}
        </button>
        <button className="back-home-btn" onClick={() => navigate("/")}>
          {t.btnHome}
        </button>
      </div>
    </div>
  );
};

export default TicketSuccess;