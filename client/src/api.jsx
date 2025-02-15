import axios from "axios";
const apiURL = import.meta.env.production.VITE_API_URL;
console.log(`base url: ${apiURL}`);
const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export default api;
