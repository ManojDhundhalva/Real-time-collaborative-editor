import axios from "axios";
import config from "../config";

// Create an instance of Axios for API requests
const API = axios.create({
  baseURL: config.BACKEND_API,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default API;
