import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Tells Axios to automatically send cookies (like our session token) with every request
});

export default API;