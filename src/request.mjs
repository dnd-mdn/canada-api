import axios from "axios";
import { BASE_URL } from "./config.mjs";

// Create a new axios instance
const request = axios.create({
    baseURL: BASE_URL,
    timeout: 30000
});

export default request;