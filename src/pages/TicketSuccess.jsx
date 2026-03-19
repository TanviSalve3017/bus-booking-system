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

  // Translations Object
  const translations = {
    en: {
      success: "Booking Successful!",
      subText: "Your ticket has been booked successfully.",
      pnr: "PNR NUMBER",
      busType: "Premium AC Sleeper | 2+1",
      passName: "Passenger Name",
      seat: "Seat",
      ageSex: "Age/Sex",
      noPass: "No Passenger Information Available",
      date: "TRAVEL DATE",
      status: "STATUS",
      confirmed: "CONFIRMED",
      total: "Total Fare Paid",
      tc: "Terms & Conditions",
      tc1: "Please carry a valid Govt. ID proof during travel.",
      tc2: "Report at the boarding point 15 minutes before departure.",
      tc3: "Management is not responsible for loss of personal belongings.",
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
      noPass: "प्रवाशांची माहिती उपलब्ध नाही",
      date: "प्रवासाची तारीख",
      status: "स्थिती",
      confirmed: "निश्चित (Confirmed)",
      total: "एकूण भरलेले भाडे",
      tc: "अटी आणि शर्ती",
      tc1: "प्रवासादरम्यान कृपया वैध सरकारी ओळखपत्र सोबत ठेवा.",
      tc2: "बस सुटण्यापूर्वी १५ मिनिटे आधी बोर्डिंग पॉईंटवर पोहोचा.",
      tc3: "वैयक्तिक वस्तूंच्या चोरीला किंवा हरवल्यास कंपनी जबाबदार नसेल.",
      btnPdf: "तिकीट डाउनलोड करा (PDF)",
      btnHome: "मुख्य पृष्ठावर जा"
    },
    hi: {
      success: "बुकिंग सफल रही!",
      subText: "आपका टिकट सफलतापूर्वक बुक हो गया है।",
      pnr: "पीएनआर नंबर",
      busType: "प्रीमियम एसी स्लीपर | 2+1",
      passName: "यात्री का नाम",
      seat: "सीट",
      ageSex: "आयु/लिंग",
      noPass: "यात्री की जानकारी उपलब्ध नहीं है",
      date: "यात्रा की तिथि",
      status: "स्थिति",
      confirmed: "पुष्टि (Confirmed)",
      total: "कुल भुगतान किया गया किराया",
      tc: "नियम एवं शर्तें",
      tc1: "यात्रा के दौरान कृपया एक वैध सरकारी आईडी साथ रखें।",
      tc2: "प्रस्थान से 15 मिनट पहले बोर्डिंग पॉइंट पर रिपोर्ट करें।",
      tc3: "निजी सामान के गुम होने के लिए प्रबंधन जिम्मेदार नहीं है।",
      btnPdf: "टिकट डाउनलोड करें (PDF)",
      btnHome: "होम पेज पर जाएं"
    }
  };

  const t = translations[lang];

  if (!bookingDetails) {
    return (
      <div className="error-container">
        <h3>Something went wrong!</h3>
        <p>Unable to fetch booking details.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const element = ticketRef.current;
    html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Ticket_${bookingDetails.pnr}.pdf`);
    });
  };

  return (
    <div className="ticket-page-wrapper">
      {/* Language Selector */}
      <div className="lang-selector-ticket" style={{ marginBottom: '20px' }}>
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }}>
          <option value="en">English</option>
          <option value="mr">मराठी</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      <div className="success-header-top">
        <div className="check-icon">✓</div>
        <h2>{t.success}</h2>
        <p>{t.subText}</p>
      </div>

      <div className="ticket-main-container" ref={ticketRef}>
        {/* Top Strip */}
        <div className="ticket-top-strip">
          <div className="pnr-info">
            <span className="label">{t.pnr}</span>
            <h3 className="pnr-value">{bookingDetails.pnr || "N/A"}</h3>
          </div>
          <div className="qr-code-box">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${bookingDetails.pnr}`} 
              alt="QR Code" 
            />
          </div>
        </div>

        {/* Bus Details */}
        <div className="bus-branding">
          <h2>{bookingDetails.busName}</h2>
          <p className="bus-type">{t.busType}</p>
        </div>

        {/* Journey Path */}
        <div className="journey-track">
          <div className="stop">
            <h4>{bookingDetails.from}</h4>
            <p>10:00 PM</p>
          </div>
          <div className="bus-path">
            <div className="line"></div>
            <span className="bus-emoji">🚌</span>
            <div className="line"></div>
          </div>
          <div className="stop">
            <h4>{bookingDetails.to}</h4>
            <p>06:00 AM</p>
          </div>
        </div>

        <div className="ticket-divider">
          <div className="cut-left"></div>
          <div className="cut-right"></div>
        </div>

        {/* Passenger Table */}
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
              {bookingDetails.passengers && bookingDetails.passengers.length > 0 ? (
                bookingDetails.passengers.map((p, index) => (
                  <tr key={index}>
                    <td>{p.name}</td>
                    <td className="seat-no">{p.seat}</td>
                    <td>{p.age} / {p.gender === 'male' || p.gender === 'M' ? 'M' : 'F'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    {t.noPass}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="travel-meta">
          <div className="meta-item">
            <span className="label">{t.date}</span>
            <strong>{bookingDetails.travelDate}</strong>
          </div>
          <div className="meta-item">
            <span className="label">{t.status}</span>
            <span className="status-badge">{t.confirmed}</span>
          </div>
        </div>

        <div className="fare-footer">
          <span>{t.total}</span>
          <h3>₹{bookingDetails.totalAmount}</h3>
        </div>

        {/* Terms and Conditions Section */}
        <div className="ticket-instructions">
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>{t.tc}</h4>
          <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
            <li>• {t.tc1}</li>
            <li>• {t.tc2}</li>
            <li>• {t.tc3}</li>
          </ul>
        </div>
      </div>

      {/* Buttons */}
      <div className="action-buttons-fixed">
        <button className="btn-download" onClick={handleDownloadPDF}>
          {t.btnPdf}
        </button>
        <button className="btn-home" onClick={() => navigate("/")}>
          {t.btnHome}
        </button>
      </div>
    </div>
  );
};

export default TicketSuccess;