import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState("en"); 
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    // ✅ १. डायनॅमिक URL लॉजिक (लोकल आणि रेंडर दोन्हीसाठी)
    const API_BASE_URL = window.location.hostname === "localhost" 
        ? "http://localhost:5001" 
        : "https://bus-booking-backend-zd3f.onrender.com";

    const translations = {
        en: {
            title: "My Bookings 🎫",
            loginFirst: "Please login first!",
            loading: "Loading History...",
            noBookings: "You haven't booked any tickets yet.",
            pnr: "PNR",
            status: "Booking Status",
            confirmed: "Confirmed ✅",
            cancelled: "Cancelled ❌",
            date: "Journey Date",
            seats: "Seats Reserved",
            total: "Total Amount Paid",
            cancelBtn: "Cancel Ticket",
            confirmCancel: "Do you really want to cancel this ticket? The refund will be processed as per policy.",
            serverError: "System error! Ticket cancellation failed."
        },
        mr: {
            title: "माझी बुकिंग्स 🎫",
            loginFirst: "कृपया आधी लॉगिन करा!",
            loading: "इतिहास लोड होत आहे...",
            noBookings: "तुम्ही अजून एकही तिकीट बुक केलेले नाही.",
            pnr: "PNR क्रमांक",
            status: "स्थिती",
            confirmed: "निश्चित (Confirmed) ✅",
            cancelled: "रद्द (Cancelled) ❌",
            date: "प्रवासाची तारीख",
            seats: "आरक्षित जागा",
            total: "एकूण भरलेले शुल्क",
            cancelBtn: "तिकीट रद्द करा",
            confirmCancel: "तुम्हाला खात्री आहे की तुम्हाला हे तिकीट रद्द करायचे आहे? परतावा पॉलिसीनुसार मिळेल.",
            serverError: "सिस्टम एरर! तिकीट रद्द होऊ शकले नाही."
        },
        hi: {
            title: "मेरी बुकिंग 🎫",
            loginFirst: "कृपया पहले लॉगिन करें!",
            loading: "इतिहास लोड हो रहा है...",
            noBookings: "आपने अभी तक कोई टिकट बुक नहीं किया है।",
            pnr: "पीएनआर नंबर",
            status: "स्थिति",
            confirmed: "पुष्टि (Confirmed) ✅",
            cancelled: "रद्द (Cancelled) ❌",
            date: "यात्रा की तिथि",
            seats: "आरक्षित सीटें",
            total: "कुल भुगतान",
            cancelBtn: "टिकट रद्द करें",
            confirmCancel: "क्या आप वाकई इस टिकट को रद्द करना चाहते हैं? रिफंड पॉलिसी के अनुसार दिया जाएगा।",
            serverError: "सिस्टम एरर! टिकट रद्द नहीं किया जा सका।"
        }
    };

    const t = translations[lang];

    // --- FIX: Manual Date Formatter (Timezone सुरक्षित) ---
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        
        if (dateStr.includes("-") && !dateStr.includes("T")) {
            const [year, month, day] = dateStr.split("-");
            return `${day}/${month}/${year}`;
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const fetchBookings = () => {
        if (user) {
            const uid = user.user_id || user.id;
            setLoading(true);
            // ✅ २. इथे API_BASE_URL वापरला आहे
            axios.get(`${API_BASE_URL}/api/my-bookings/${uid}`)
                .then(res => {
                    setBookings(res.data);
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelTicket = (pnr) => {
        if (window.confirm(t.confirmCancel)) {
            // ✅ ३. इथे सुद्धा API_BASE_URL वापरला आहे
            axios.put(`${API_BASE_URL}/api/cancel-ticket/${pnr}`)
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message); 
                        fetchBookings(); 
                    }
                })
                .catch(err => {
                    const errorMsg = err.response?.data?.message || t.serverError;
                    alert(errorMsg);
                });
        }
    };

    if (!user) return <div style={{ textAlign: "center", padding: "100px", fontSize: "24px" }}>{t.loginFirst}</div>;

    return (
        <div style={{ maxWidth: "850px", margin: "40px auto", padding: "20px", fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: "#fbfcfd" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ color: "#1a202c", margin: 0, fontSize: "28px", fontWeight: "700" }}>{t.title}</h2>
                <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value)}
                    style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#fff", cursor: "pointer", outline: "none" }}
                >
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिन्दी</option>
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "50px", color: "#4a5568" }}>{t.loading}</div>
            ) : bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "15px" }}>
                    <p style={{ fontSize: "20px", color: "#718096" }}>{t.noBookings}</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                    {bookings.map((b) => (
                        <div key={b.booking_id} style={{ 
                            border: "1px solid #e2e8f0", padding: "25px", borderRadius: "16px", backgroundColor: "#ffffff", 
                            display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
                        }}>
                            <div style={{ flex: 2 }}>
                                <h3 style={{ margin: "0 0 10px 0", color: "#2b6cb0", fontSize: "22px" }}>{b.bus_name}</h3>
                                <div style={{ marginBottom: "12px" }}>
                                    <span style={{ backgroundColor: "#edf2f7", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                                        {t.pnr}: {b.pnr}
                                    </span>
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: "600", textTransform: "capitalize" }}>
                                    {b.source} <span style={{ color: "#3182ce" }}>➔</span> {b.destination}
                                </div>
                                <div style={{ marginTop: "15px" }}>
                                    <span style={{ 
                                        padding: "6px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700",
                                        backgroundColor: b.status === 'Cancelled' ? "#fff5f5" : "#f0fff4",
                                        color: b.status === 'Cancelled' ? "#c53030" : "#2f855a",
                                        border: `1px solid ${b.status === 'Cancelled' ? "#feb2b2" : "#9ae6b4"}`
                                    }}>
                                        {b.status === 'Cancelled' ? t.cancelled : t.confirmed}
                                    </span>
                                </div>
                            </div>

                            <div style={{ textAlign: "right", flex: 1 }}>
                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ margin: "0", color: "#718096", fontSize: "13px" }}>{t.date}</p>
                                    <p style={{ margin: "2px 0", fontWeight: "600" }}>
                                        {formatDate(b.travel_date)}
                                    </p>
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ margin: "0", color: "#718096", fontSize: "13px" }}>{t.seats}</p>
                                    <p style={{ margin: "2px 0", fontWeight: "600" }}>{b.seat_numbers}</p>
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <p style={{ margin: "0", color: "#718096", fontSize: "13px" }}>{t.total}</p>
                                    <p style={{ margin: "2px 0", fontSize: "20px", fontWeight: "800" }}>₹{b.total_amount}</p>
                                </div>
                                
                                {b.status !== "Cancelled" && (
                                    <button onClick={() => handleCancelTicket(b.pnr)} 
                                        style={{ backgroundColor: "#fff", color: "#e53e3e", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", border: "1.5px solid #e53e3e", fontWeight: "600" }}
                                    >
                                        {t.cancelBtn}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;