import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", mobile: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Render ची लिंक आणि Localhost दोन्ही मॅनेज करण्यासाठी लॉजिक
    const API_BASE_URL = window.location.hostname === "localhost" 
        ? "http://localhost:5001" 
        : "https://bus-reservation-system-backend-j.onrender.com";

    const handleRegister = async (e) => {
        e.preventDefault();

        // मोबाईल नंबर व्हॅलिडेशन (१० अंकी)
        if (formData.mobile.length !== 10) {
            alert(t('invalid_mobile') || "कृपया १० अंकी मोबाईल नंबर टाका.");
            return;
        }

        setLoading(true);
        try {
            // ✅ API ला कॉल करताना आपण आता डायनॅमिक URL वापरत आहोत
            const res = await axios.post(`${API_BASE_URL}/api/register`, formData);
            
            if (res.data.success) {
                alert(t('register_success_alert') || "नोंदणी यशस्वी! आता लॉगिन करा.");
                navigate("/login");
            }
        } catch (err) {
            console.error("Registration Error:", err);
            
            // ✅ बॅकएंडवरून येणारा अचूक एरर मेसेज युजरला दाखवणे
            const serverMsg = err.response?.data?.message;
            let errorMsg = t('registration_failed') || "नोंदणी अयशस्वी!";

            if (serverMsg === "Email already exists") {
                errorMsg = t('email_exists_alert') || "हा ईमेल आधीच नोंदणीकृत आहे!";
            } else if (err.response?.data?.error) {
                errorMsg = `Error: ${err.response.data.error}`;
            }

            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div style={{ maxWidth: "450px", margin: "60px auto", padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
            
            {/* भाषेचा ड्रॉपडाऊन */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                <select 
                    onChange={changeLanguage} 
                    value={i18n.language}
                    style={{ padding: "5px", borderRadius: "4px", border: "1px solid #cbd5e0", fontSize: "12px", cursor: "pointer" }}
                >
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिन्दी</option>
                </select>
            </div>

            <h2 style={{ textAlign: "center", color: "#2d3748", marginBottom: "20px" }}>{t('register')} 🚌</h2>
            
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input 
                    type="text" 
                    placeholder={t('full_name') || "पूर्ण नाव"} 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0" }} 
                />
                
                <input 
                    type="email" 
                    placeholder={t('enter_email') || "ईमेल आयडी"} 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0" }} 
                />
                
                <input 
                    type="password" 
                    placeholder={t('set_password') || "पासवर्ड सेट करा"} 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0" }} 
                />
                
                <input 
                    type="number" 
                    placeholder={t('mobile_number') || "मोबाईल नंबर"} 
                    required 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
                    style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0" }} 
                />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: "12px", 
                        backgroundColor: loading ? "#a0aec0" : "#48bb78", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px", 
                        cursor: loading ? "not-allowed" : "pointer", 
                        fontWeight: "bold", 
                        fontSize: "16px", 
                        marginTop: "10px" 
                    }}
                >
                    {loading ? (t('processing') || "प्रक्रिया सुरू आहे...") : t('register')}
                </button>
            </form>
            
            <p style={{ textAlign: "center", marginTop: "20px", color: "#4a5568" }}>
                {t('already_have_account')} <Link to="/login" style={{ color: "#48bb78", textDecoration: "none", fontWeight: "bold" }}>{t('login')}</Link>
            </p>
        </div>
    );
};

export default Register;