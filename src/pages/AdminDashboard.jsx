import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ १. तुझी Render बॅकएंड लिंक
const API_BASE_URL = "https://bus-booking-backend-zd3f.onrender.com";

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  
  // ✅ १. स्टेट्स
  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState([]); // ✅ युजर्ससाठी नवीन स्टेट
  const [loading, setLoading] = useState(true);

  // ✅ २. नवीन बससाठी स्टेट्स (Modal Logic)
  const [showModal, setShowModal] = useState(false);
  const [newBus, setNewBus] = useState({
    bus_name: "",
    source: "",
    destination: "",
    bus_type: "AC Sleeper",
    price_per_seat: "",
    travel_date: "",
  });

  useEffect(() => {
    fetchAdminData();
    fetchUsers(); // ✅ युजर्स फेच करण्यासाठी कॉल
  }, []);

  const fetchAdminData = async () => {
    try {
      // ✅ localhost बदलून API_BASE_URL वापरले आहे
      const busRes = await axios.get(`${API_BASE_URL}/api/buses`);
      setBuses(busRes.data);

      const bookingRes = await axios.get(`${API_BASE_URL}/api/admin-stats`);
      setStats(bookingRes.data);

      const recentRes = await axios.get(`${API_BASE_URL}/api/admin/recent-bookings`);
      setRecentBookings(recentRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setLoading(false);
    }
  };

  // ✅ ३. युजर्स फेच करण्याचे लॉजिक
  const fetchUsers = async () => {
    try {
      // ✅ localhost बदलून API_BASE_URL वापरले आहे
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ ४. युजर ब्लॉक/अनब्लॉक करण्याचे लॉजिक
  const handleToggleBlock = async (userId, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    if (window.confirm(`तुम्हाला खात्री आहे की या युजरला ${action} करायचे आहे?`)) {
      try {
        // ✅ localhost बदलून API_BASE_URL वापरले आहे
        await axios.put(`${API_BASE_URL}/api/admin/users/toggle-block/${userId}`, {
          is_blocked: !currentStatus
        });
        alert(`युजर यशस्वीरित्या ${action} झाला!`);
        fetchUsers(); // टेबल रिफ्रेश करा
      } catch (err) {
        alert("An error occurred while updating status!");
      }
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      // ✅ localhost बदलून API_BASE_URL वापरले आहे
      const response = await axios.post(`${API_BASE_URL}/api/add-bus`, newBus);
      if (response.data) {
        alert("The bus was successfully added! 🚀");
        setShowModal(false); 
        fetchAdminData(); 
        setNewBus({ bus_name: "", source: "", destination: "", bus_type: "AC Sleeper", price_per_seat: "", travel_date: "" });
      }
    } catch (err) {
      console.error("Error adding bus:", err);
      alert("An error occurred while adding the bus!");
    }
  };

  const handleDeleteBus = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        // ✅ localhost बदलून API_BASE_URL वापरले आहे
        await axios.delete(`${API_BASE_URL}/api/buses/${id}`);
        alert("The bus was successfully deleted!");
        fetchAdminData();
      } catch (err) {
        alert("An error occurred while deleting!");
      }
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading data from Render... (Please wait 1 min)</div>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>🚀 Admin Dashboard</h1>
        <p>Manage all buses, bookings, and users from here.</p>
      </header>

      {/* --- STATS SECTION --- */}
      <div style={statsContainer}>
        <div style={statCard("#3498db")}>
          <h3>Total Buses</h3>
          <p>{buses.length}</p>
        </div>
        <div style={statCard("#e67e22")}>
          <h3>Total Bookings</h3>
          <p>{stats.bookingCount || 0}</p>
        </div>
        <div style={statCard("#2ecc71")}>
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue || 0}</p>
        </div>
      </div>

      {/* --- RECENT BOOKINGS SECTION --- */}
      <div style={{...tableSection, marginBottom: "40px"}}>
        <h2>Recent Bookings (Latest 10)</h2>
        <table style={tableStyle}>
          <thead style={theadRow}>
            <tr>
              <th>PNR</th>
              <th>Passenger Name</th>
              <th>Bus ID</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length > 0 ? recentBookings.map((bk) => (
              <tr key={bk.booking_id} style={tbodyRow}>
                <td><strong>{bk.pnr}</strong></td>
                <td>{bk.passenger_name}</td>
                <td>#{bk.bus_id}</td>
                <td>{bk.seat_numbers}</td>
                <td>₹{bk.total_amount}</td>
                <td>
                  <span style={{
                    backgroundColor: bk.status === 'Confirmed' ? '#2ecc71' : '#e74c3c',
                    color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                  }}>
                    {bk.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No recent bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ ५. नवीन USER MANAGEMENT SECTION --- */}
      <div style={{...tableSection, marginBottom: "40px"}}>
        <h2>Registered Users</h2>
        <table style={tableStyle}>
          <thead style={theadRow}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((u) => (
              <tr key={u.id} style={tbodyRow}>
                <td>#{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <b style={{ color: u.is_blocked ? "#e74c3c" : "#2ecc71" }}>
                    {u.is_blocked ? "Blocked" : "Active"}
                  </b>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggleBlock(u.id, u.is_blocked)}
                    style={{
                      ...deleteBtnStyle,
                      backgroundColor: u.is_blocked ? "#2ecc71" : "#e74c3c",
                      minWidth: "80px"
                    }}
                  >
                    {u.is_blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- BUS MANAGEMENT SECTION --- */}
      <div style={tableSection}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Current Bus Fleet</h2>
          <button onClick={() => setShowModal(true)} style={addBtnStyle}>+ Add New Bus</button>
        </div>
        
        <table style={tableStyle}>
          <thead>
            <tr style={theadRow}>
              <th>Bus ID</th>
              <th>Bus Name</th>
              <th>Route</th>
              <th>Type</th>
              <th>Price</th>
              <th>Travel Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.bus_id} style={tbodyRow}>
                <td>#{bus.bus_id}</td>
                <td><strong>{bus.bus_name}</strong></td>
                <td>{bus.source} ➔ {bus.destination}</td>
                <td>{bus.bus_type}</td>
                <td>₹{bus.price_per_seat}</td>
                <td>{new Date(bus.travel_date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDeleteBus(bus.bus_id)} style={deleteBtnStyle}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD BUS MODAL UI --- */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ marginBottom: "20px" }}>Add New Bus</h2>
            <form onSubmit={handleAddBus} style={formStyle}>
              <input type="text" placeholder="Bus Name" required 
                onChange={(e) => setNewBus({...newBus, bus_name: e.target.value})} style={inputStyle} />
              
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" placeholder="Source" required 
                  onChange={(e) => setNewBus({...newBus, source: e.target.value})} style={inputStyle} />
                <input type="text" placeholder="Destination" required 
                  onChange={(e) => setNewBus({...newBus, destination: e.target.value})} style={inputStyle} />
              </div>

              <select onChange={(e) => setNewBus({...newBus, bus_type: e.target.value})} style={inputStyle}>
                <option value="AC Sleeper">AC Sleeper</option>
                <option value="Non-AC Seater">Non-AC Seater</option>
                <option value="AC Seater">AC Seater</option>
              </select>

              <input type="number" placeholder="Price Per Seat" required 
                onChange={(e) => setNewBus({...newBus, price_per_seat: e.target.value})} style={inputStyle} />
              
              <input type="date" required 
                onChange={(e) => setNewBus({...newBus, travel_date: e.target.value})} style={inputStyle} />

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ ...addBtnStyle, flex: 1 }}>Save Bus</button>
                <button type="button" onClick={() => setShowModal(false)} 
                  style={{ ...deleteBtnStyle, flex: 1, padding: "10px" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const modalOverlay = {
  position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000
};
const modalContent = {
  backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "450px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
};
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputStyle = { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", width: "100%" };
const containerStyle = { padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "Arial, sans-serif" };
const headerStyle = { marginBottom: "30px", borderBottom: "2px solid #ddd", paddingBottom: "10px" };
const statsContainer = { display: "flex", gap: "20px", marginBottom: "40px" };
const statCard = (color) => ({
  flex: 1, backgroundColor: color, color: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center"
});
const tableSection = { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
const theadRow = { backgroundColor: "#2c3e50", color: "white", textAlign: "left" };
const tbodyRow = { borderBottom: "1px solid #eee", height: "50px" };
const addBtnStyle = { backgroundColor: "#2ecc71", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const deleteBtnStyle = { backgroundColor: "#e74c3c", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" };

export default AdminDashboard;