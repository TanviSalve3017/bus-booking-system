import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

const Login = () => {
    const { t, i18n } = useTranslation(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // ✅ लोडिंग स्टेट ॲड केली
    const navigate = useNavigate();

    // ✅ Render आणि Localhost मॅनेजमेंट (ही लिंक असणे अनिवार्य आहे)
    const API_BASE_URL = window.location.hostname === "localhost" 
        ? "http://localhost:5001" 
        : "https://bus-booking-backend-zd3f.onrender.com";

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ✅ बदल: डायरेक्ट /api ऐवजी पूर्ण URL वापरली आहे जेणेकरून Netlify वर चालते
            const res = await axios.post(`${API_BASE_URL}/api/login`, { 
                email: email.trim(), // ✅ ईमेल मधील स्पेस काढण्यासाठी trim()
                password: password 
            });
            
            if (res.data.success) {
                // युजरचा पूर्ण ऑब्जेक्ट सेव्ह करा
                localStorage.setItem("user", JSON.stringify(res.data.user));
                
                // ✅ टोकन असेल तर तेही सेव्ह करा (सुरक्षिततेसाठी)
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                }

                alert(`${t('hi') || 'Welcome'}, ${res.data.user.name}!`);
                
                navigate("/");
                window.location.reload(); 
            } else {
                alert(t('login_failed') || "लॉगिन अयशस्वी!");
            }
        } catch (err) {
            console.error("🚨 Login Error:", err);
            
            // जर सर्व्हरवरून मेसेज आला असेल तर तो दाखवा
            const errorMsg = err.response?.data?.message || "ईमेल किंवा पासवर्ड चुकीचा आहे!";
            
            if (err.code === "ERR_NETWORK") {
                alert("सर्व्हरशी संपर्क होऊ शकला नाही. रेंडर सर्व्हर झोपला असू शकतो (Spinning up), १ मिनिटाने पुन्हा प्रयत्न करा.");
            } else {
                alert(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "80px auto", padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", backgroundColor: "#fff", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            
            {/* भाषा निवड */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                <select 
                    onChange={changeLanguage} 
                    value={i18n.language} 
                    style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #cbd5e0", cursor: "pointer", outline: "none" }}
                >
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिन्दी</option>
                </select>
            </div>

            <h2 style={{ textAlign: "center", color: "#2d3748", marginBottom: "10px" }}>{t('login')} 🔑</h2>
            <p style={{ textAlign: "center", color: "#718096", marginBottom: "25px", fontSize: "14px" }}>तुमच्या खात्यात प्रवेश करा</p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>{t('enter_email') || "ईमेल आयडी"}</label>
                    <input 
                        type="email" 
                        placeholder="example@mail.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", fontSize: "15px", outline: "none" }} 
                    />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>{t('set_password') || "पासवर्ड"}</label>
                    <input 
                        type="password" 
                        placeholder="******" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", fontSize: "15px", outline: "none" }} 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: "14px", 
                        backgroundColor: loading ? "#a0aec0" : "#3182ce", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "8px", 
                        cursor: loading ? "not-allowed" : "pointer", 
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginTop: "10px",
                        transition: "background 0.3s"
                    }}
                >
                    {loading ? "प्रक्रिया सुरू आहे..." : t('login')}
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "25px", color: "#4a5568", fontSize: "15px" }}>
                {t('no_account') || "खाते नाही?"} <Link to="/register" style={{ color: "#3182ce", fontWeight: "bold", textDecoration: "none" }}>{t('register')}</Link>
            </p>
        </div>
    );
};

export default Login;