import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState("en"); 
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    // 🔥 NEW: refresh state (manual reload)
    const [refresh, setRefresh] = useState(false);

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
            confirmCancel: "Do you really want to cancel this ticket?",
            serverError: "System error! Ticket cancellation failed.",
            refresh: "Refresh"
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
            confirmCancel: "तुम्हाला खात्री आहे का?",
            serverError: "सिस्टम एरर!",
            refresh: "रिफ्रेश"
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
            confirmCancel: "क्या आप पक्का करना चाहते हैं?",
            serverError: "सिस्टम एरर!",
            refresh: "रिफ्रेश"
        }
    };

    const t = translations[lang];

    // ✅ Date formatter (same logic, improved fallback)
    const formatDate = (dateStr) => {
        if (!dateStr) return "";

        const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;

        if (cleanDate.includes("-")) {
            const parts = cleanDate.split("-");
            if (parts[0].length === 4) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        return date.toLocaleDateString();
    };

    // 🔥 IMPROVED FETCH (error handling + retry safe)
    const fetchBookings = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const uid = user.user_id || user.id || 1;
            setLoading(true);

            const res = await axios.get(`${API_BASE_URL}/api/my-bookings/${uid}`);

            console.log("Bookings Data Received:", res.data);

            // 🔥 SAFE fallback (if API returns null)
            setBookings(Array.isArray(res.data) ? res.data : []);

        } catch (err) {
            console.error("Fetch Error:", err.response || err);

            // 🔥 IMPORTANT: handle 404 properly
            if (err.response?.status === 404) {
                setBookings([]); // no bookings instead of crash
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [refresh]); // 🔥 auto refresh support

    const handleCancelTicket = async (pnr) => {
        if (!window.confirm(t.confirmCancel)) return;

        try {
            const res = await axios.put(`${API_BASE_URL}/api/cancel-ticket/${pnr}`);

            if (res.data.success) {
                alert(res.data.message || "Cancelled successfully");

                // 🔥 REFRESH LIST
                setRefresh(prev => !prev);
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || t.serverError;
            alert(errorMsg);
        }
    };

    if (!user) {
        return (
            <div style={{ textAlign: "center", padding: "100px", fontSize: "24px" }}>
                {t.loginFirst}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "850px", margin: "40px auto", padding: "20px", fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: "#fbfcfd" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ color: "#1a202c", margin: 0, fontSize: "28px", fontWeight: "700" }}>{t.title}</h2>

                <div style={{ display: "flex", gap: "10px" }}>
                    <select 
                        value={lang} 
                        onChange={(e) => setLang(e.target.value)}
                        style={{ padding: "8px", borderRadius: "8px" }}
                    >
                        <option value="en">English</option>
                        <option value="mr">मराठी</option>
                        <option value="hi">हिन्दी</option>
                    </select>

                    {/* 🔥 MANUAL REFRESH BUTTON */}
                    <button onClick={() => setRefresh(prev => !prev)}>
                        {t.refresh}
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>{t.loading}</div>
            ) : bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "15px" }}>
                    <p>{t.noBookings}</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                    {bookings.map((b) => (
                        <div key={b.booking_id} style={{ 
                            border: "1px solid #e2e8f0", padding: "25px", borderRadius: "16px", backgroundColor: "#ffffff", 
                            display: "flex", justifyContent: "space-between"
                        }}>
                            <div>
                                <h3>{b.bus_name || "Bus Details"}</h3>
                                <p>{t.pnr}: {b.pnr}</p>
                                <p>{b.source} ➔ {b.destination}</p>

                                <span>
                                    {b.status === 'Cancelled' ? t.cancelled : t.confirmed}
                                </span>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <p>{t.date}: {formatDate(b.travel_date)}</p>
                                <p>{t.seats}: {b.seat_numbers}</p>
                                <p>₹{b.total_amount}</p>

                                {b.status !== "Cancelled" && (
                                    <button onClick={() => handleCancelTicket(b.pnr)}>
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