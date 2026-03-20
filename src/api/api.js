import axios from "axios";

const api = axios.create({
  baseURL: "https://bus-booking-backend-zd3f.onrender.com",
});

export default api;

