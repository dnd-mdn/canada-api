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
    config.url = normalize(config.url);

    config.url.pathname = config.url.pathname + '.html';
    config.url.searchParams.set('_', Date.now());
    
    return config;
}, error => {
    return Promise.reject(error);
});

export default content;