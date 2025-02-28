import axios from "axios";
import normalize from "./normalize.mjs";

// Create a new axios instance
const children = axios.create({
    baseURL: "https://www.canada.ca",
    timeout: 30000,
    maxRedirects: 0
});

// Transform URL
children.interceptors.request.use(config => {
    config.url = normalize(config.url);

    config.url.pathname = config.url.pathname + '.sitemap.xml';
    config.url.searchParams.set('_', Date.now());
    
    return config;
}, error => {
    return Promise.reject(error);
});

// Process response data
children.interceptors.response.use(response => {
    response.data = parseSitemap(response.data);

    return response;
}, error => {
    return Promise.reject(error);
});

/**
 * Sitemap parser
 * @param {string} data 
 * @returns {Array<{path: string, lastmod: string}>}
 */
export const parseSitemap = (data) => {
    const regex = /<url>.*?<loc>([^<]+)<\/loc>.*?(?:<lastmod>([^<]+)<\/lastmod>)?.*?<\/url>/g;
    
    return [...data.matchAll(regex)].map(match => ({
        loc: normalize(match[1]).pathname,
        lastmod: match[2] ?? null
    }));
};

export default children;