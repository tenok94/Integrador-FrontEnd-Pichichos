import axios from "axios";

const API = axios.create({
  baseURL: "https://integrador-backt-end-pichichos.vercel.app",
});

export default API;