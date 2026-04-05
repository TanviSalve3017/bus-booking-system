import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "", 
        mobile: "" 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Render आणि Localhost मॅनेजमेंट (URL Fixed with Quotes and Colon)
    const API_BASE_URL = window.location.hostname === "localhost" 
        ? "http://localhost:5001" 
        : "https://bus-booking-backend-zd3f.onrender.com";

    const handleRegister = async (e) => {
        e.preventDefault();

        // १. बेसिक ट्रिमिंग
        const cleanName = formData.name.trim();
        const cleanEmail = formData.email.trim();

        // २. ईमेल व्हॅलिडेशन
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            alert(t('invalid_email') || "Please enter a valid email ID.");
            return;
        }

        // ३. मोबाईल नंबर व्हॅलिडेशन (१० अंकी)
        if (formData.mobile.length !== 10) {
            alert(t('invalid_mobile') || "Please enter a 10-digit mobile number.");
            return;
        }

        // ४. पासवर्ड स्ट्रेंथ व्हॅलिडेशन
        if (formData.password.length < 6) {
            alert(t('weak_password') || "The password must be at least 6 characters long.");
            return;
        }

        // ५. Confirm Password मॅच होणे गरजेचे आहे
        if (formData.password !== formData.confirmPassword) {
            alert(t('password_mismatch') || "The passwords don't match!");
            return;
        }

        setLoading(true);
        try {
            // ✅ API ला कॉल
            const res = await axios.post(`${API_BASE_URL}/api/register`, {
                name: cleanName,
                email: cleanEmail,
                password: formData.password,
                mobile: formData.mobile
            });
            
            if (res.data.success) {
                alert(t('register_success_alert') || "Registration successful! Login now.");
                navigate("/login");
            }
        } catch (err) {
            console.error("Registration Error:", err);
            
            const serverMsg = err.response?.data?.message;
            let errorMsg = t('registration_failed') || "Registration failed!";

            if (serverMsg === "Email already exists") {
                errorMsg = t('email_exists_alert') || "This email is already registered!";
            } else if (err.response?.data?.error) {
                errorMsg = `Error: ${err.response.data.error}`;
            } else if (err.code === "ERR_NETWORK") {
                errorMsg = "सर्व्हरशी संपर्क होऊ शकला नाही. कृपया बॅकएंड चालू असल्याची खात्री करा (Render ला वेळ लागू शकतो).";
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
        <div style={{ maxWidth: "450px", margin: "60px auto", padding: "30px", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", backgroundColor: "#fff", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
            
            {/* भाषा निवड */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                <select 
                    onChange={changeLanguage} 
                    value={i18n.language}
                    style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "14px", cursor: "pointer", outline: "none" }}
                >
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिन्दी</option>
                </select>
            </div>

            <h2 style={{ textAlign: "center", color: "#2d3748", marginBottom: "10px", fontSize: "24px" }}>{t('register')} 🚌</h2>
            <p style={{ textAlign: "center", color: "#718096", marginBottom: "25px", fontSize: "14px" }}>तुमचा प्रवास आजच सुरू करा!</p>
            
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568", marginBottom: "5px", display: "block" }}>{t('full_name') || "पूर्ण नाव"}</label>
                    <input 
                        type="text" 
                        placeholder="उदा. राहुल पाटील" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", boxSizing: "border-box", fontSize: "15px" }} 
                    />
                </div>
                
                <div>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568", marginBottom: "5px", display: "block" }}>{t('enter_email') || "ईमेल आयडी"}</label>
                    <input 
                        type="email" 
                        placeholder="example@mail.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", boxSizing: "border-box", fontSize: "15px" }} 
                    />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568", marginBottom: "5px", display: "block" }}>{t('set_password') || "पासवर्ड"}</label>
                        <input 
                            type="password" 
                            placeholder="******" 
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", boxSizing: "border-box", fontSize: "15px" }} 
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568", marginBottom: "5px", display: "block" }}>{t('confirm_password') || "पुष्टी करा"}</label>
                        <input 
                            type="password" 
                            placeholder="******" 
                            required 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", boxSizing: "border-box", fontSize: "15px" }} 
                        />
                    </div>
                </div>
                
                <div>
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568", marginBottom: "5px", display: "block" }}>{t('mobile_number') || "मोबाईल नंबर"}</label>
                    <input 
                        type="number" 
                        placeholder="९८XXXXXXXX" 
                        required 
                        value={formData.mobile}
                        onChange={(e) => {
                            if (e.target.value.length <= 10) {
                                setFormData({...formData, mobile: e.target.value})
                            }
                        }} 
                        style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e0", boxSizing: "border-box", fontSize: "15px" }} 
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: "14px", 
                        backgroundColor: loading ? "#a0aec0" : "#48bb78", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "8px", 
                        cursor: loading ? "not-allowed" : "pointer", 
                        fontWeight: "bold", 
                        fontSize: "16px", 
                        marginTop: "10px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease"
                    }}
                >
                    {loading ? (t('processing') || "प्रक्रिया सुरू आहे...") : t('register')}
                </button>
            </form>
            
            <p style={{ textAlign: "center", marginTop: "25px", color: "#4a5568", fontSize: "15px" }}>
                {t('already_have_account')} <Link to="/login" style={{ color: "#38a169", textDecoration: "none", fontWeight: "bold" }}>{t('login')}</Link>
            </p>
        </div>
    );
};

export default Register;