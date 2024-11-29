import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7300",
});

export default api;
