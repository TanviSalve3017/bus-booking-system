import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // १. i18n इंपोर्ट करा

const Navbar = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(); // २. t आणि i18n हुक्स

    // localStorage मधून लॉगिन असलेला युजर मिळवा
    const user = JSON.parse(localStorage.getItem("user"));

    // लॉगआउट फंक्शन
    const handleLogout = () => {
        localStorage.removeItem("user");
        alert("तुम्ही यशस्वीरित्या लॉगआउट झाला आहात!");
        navigate("/login");
        window.location.reload();
    };

    // ३. भाषा बदलण्याचे फंक्शन
    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <nav style={{
            backgroundColor: "#2c3e50", 
            padding: "15px 8%", 
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
        }}>
            {/* Logo Section */}
            <Link to="/" style={{ 
                color: "white", 
                textDecoration: "none", 
                fontSize: "24px", 
                fontWeight: "bold", 
                display: "flex", 
                alignItems: "center", 
                gap: "12px" 
            }}>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/1042/1042261.png" 
                    alt="logo" 
                    style={{width: "38px", filter: "invert(1)"}} 
                /> 
                <span style={{letterSpacing: "1px"}}>{t('app_name')}</span>
            </Link>

            {/* Navigation Links & Language Switcher */}
            <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
                
                {/* ४. भाषा निवडण्याचा ड्रॉपडाऊन */}
                <select 
                    onChange={changeLanguage} 
                    value={i18n.language}
                    style={{
                        backgroundColor: "#34495e",
                        color: "white",
                        border: "1px solid #5d6d7e",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        outline: "none",
                        fontSize: "14px"
                    }}
                >
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                    <option value="hi">हिन्दी</option>
                </select>

                <Link to="/" style={linkStyle}>{t('home') || 'Home'}</Link>
                
                {user ? (
                    <>
                        {/* ✅ ५. ADMIN CHECK: जर रोल 'Admin' असेल तरच हे बटन दिसेल */}
                        {user.role === 'Admin' && (
                            <Link to="/admin" style={{ ...linkStyle, color: "#ffc107", fontWeight: "bold" }}>
                                {t('admin_dashboard') || 'Admin Dashboard 🚀'}
                            </Link>
                        )}

                        <Link to="/my-bookings" style={linkStyle}>{t('my_bookings') || 'My Bookings'}</Link>
                        
                        <span style={{ ...linkStyle, color: "#48bb78", fontWeight: "bold" }}>
                            {t('hi') || 'Hi'}, {user.name}
                        </span>
                        <button 
                            onClick={handleLogout}
                            style={{
                                ...buttonStyle,
                                backgroundColor: "#e53935",
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#c62828"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#e53935"}
                        >
                            {t('logout') || 'Logout'}
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>{t('login') || 'Login'}</Link>
                        <Link to="/register">
                            <button 
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: "#e53935",
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#c62828"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#e53935"}
                            >
                                {t('register') || 'Register'}
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
    transition: "0.3s"
};

const buttonStyle = {
    color: "white",
    border: "none",
    padding: "10px 22px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.3s ease",
    boxShadow: "0 2px 6px rgba(229, 57, 53, 0.3)"
};

export default Navbar;