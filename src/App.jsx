import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Navbar from "./pages/Navbar"; 
import Home from "./pages/Home";
import Search from "./pages/Search";
import PaymentPage from "./pages/PaymentPage"; 
import TicketSuccess from "./pages/TicketSuccess"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import MyBookings from "./pages/MyBookings"; 
import PaymentSelection from "./pages/PaymentSelection"; 
import AdminDashboard from "./pages/AdminDashboard";

// १. सामान्य युजरसाठी प्रोटेक्शन (आधीचेच)
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// २. खास ॲडमिनसाठी नवीन लॉजिक (AdminRoute)
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // जर युजर लॉगिन नसेल किंवा त्याचा रोल 'Admin' नसेल, तर त्याला होमवर पाठवा
  if (!user || user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <Navbar /> 
      
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          
          {/* Admin Dashboard Route (फक्त ॲडमिनसाठी) */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          <Route 
            path="/payment-selection" 
            element={
              <ProtectedRoute>
                <PaymentSelection />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/ticket-success" 
            element={
              <ProtectedRoute>
                <TicketSuccess />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Home />} /> 
        </Routes>
      </div>
    </>
  );
}

export default App;