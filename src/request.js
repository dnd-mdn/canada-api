import axios from "axios";
import { BASE_URL } from "./config.js";

/**
 * Axios instance configured for raw requests to canada.ca
 * @type {import('axios').AxiosInstance}
 * @description Base HTTP client for making raw requests.
 */
const request = axios.create({
    baseURL: BASE_URL,
    timeout: 30000
});

export default request;