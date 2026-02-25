import axios from "axios";
import normalize from "./normalize.mjs";

// Create a new axios instance
const content = axios.create({
    baseURL: "https://www.canada.ca",
    timeout: 5000,
    maxRedirects: 0
});

// Transform URL
content.interceptors.request.use(config => {
    const url = normalize(config.url);

    url.pathname = url.pathname + '.html';
    url.searchParams.set('_', Date.now());
    
    config.url = url.toString();
    return config;
}, error => {
    return Promise.reject(error);
});

export default content;