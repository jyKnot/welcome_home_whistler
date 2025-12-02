import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // your backend base URL
  withCredentials: true, // allows sending cookies (for JWT later)
});
