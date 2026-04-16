import axios from "axios";
import normalize from "./normalize.js";
import { BASE_URL } from "./config.js";

/**
 * Axios instance configured for fetching HTML content
 * @type {import('axios').AxiosInstance}
 * @description Returns raw HTML content
 */
const content = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    maxRedirects: 0
});

// Transform URL
content.interceptors.request.use(config => {
    const url = normalize(config.url);

    url.pathname = url.pathname + '.html';
    url.searchParams.set('_', Date.now());

    config.url = url.toString();
    return config;
});

export default content;