import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

const Login = () => {
    const { t, i18n } = useTranslation(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // ✅ हे लॉजिक ॲड केलं आहे: लोकलहोस्ट असेल तर ५००१ आणि नेटलिफाय असेल तर रेंडरची लिंक
    const API_BASE_URL = window.location.hostname === "localhost" 
        ? "http://localhost:5001" 
        : "https://bus-reservation-system-backend-j.onrender.com";

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // ✅ "http://localhost:5001" ऐवजी आता `${API_BASE_URL}` वापरलं आहे
            const res = await axios.post(`${API_BASE_URL}/api/login`, { email, password });
            
            if (res.data.success) {
                // युजरचा पूर्ण ऑब्जेक्ट सेव्ह करा
                localStorage.setItem("user", JSON.stringify(res.data.user));
                
                alert(`${t('hi') || 'Welcome'}, ${res.data.user.name}!`);
                
                navigate("/");
                window.location.reload(); 
            } else {
                alert("लॉगिन अयशस्वी!");
            }
        } catch (err) {
            console.error("🚨 Login Error:", err);
            alert("ईमेल किंवा पासवर्ड चुकीचा आहे!");
        }
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "80px auto", padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                <select onChange={changeLanguage} value={i18n.language} style={{ padding: "5px", borderRadius: "4px", border: "1px solid #cbd5e0" }}>
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिन्दी</option>
                </select>
            </div>
            <h2 style={{ textAlign: "center", color: "#2d3748" }}>{t('login')} 🔑</h2>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* placeholder मध्ये पण translate लॉजिक वापरलं आहे */}
                <input type="email" placeholder={t('enter_email') || "Email"} required onChange={(e) => setEmail(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0" }} />
                <input type="password" placeholder={t('set_password') || "Password"} required onChange={(e) => setPassword(e.target.value)} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0" }} />
                <button type="submit" style={{ padding: "12px", backgroundColor: "#3182ce", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                    {t('login')}
                </button>
            </form>
            <p style={{ textAlign: "center", marginTop: "20px" }}>
                {t('no_account')} <Link to="/register" style={{ color: "#3182ce", fontWeight: "bold" }}>{t('register')}</Link>
            </p>
        </div>
    );
};

export default Login;