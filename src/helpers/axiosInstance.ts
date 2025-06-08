import axios from "axios";
import { store } from "../redux/store";

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/",
  baseURL: "https://api.khumbula.online/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
