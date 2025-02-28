import axios from "axios";

// Create a new axios instance
const request = axios.create({
    baseURL: "https://www.canada.ca",
    timeout: 30000
});

export default request;