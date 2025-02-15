import axios from "axios";
const apiURL = import.meta.env.VITE_API_URL;
console.log(apiURL);
const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export default api;
