import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import normalize from "./normalize.mjs";

// Create a new axios instance
const children = axios.create({
    baseURL: "https://www.canada.ca",
    timeout: 30000,
    maxRedirects: 0
});

// Transform URL
children.interceptors.request.use(config => {
    const url = normalize(config.url);

    url.pathname = url.pathname + '.sitemap.xml';
    url.searchParams.set('_', Date.now());

    config.url = url.toString();
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
    const parser = new XMLParser();
    const result = parser.parse(data);

    const urls = result.urlset?.url || [];
    return (Array.isArray(urls) ? urls : [urls]).map(item => ({
        path: normalize(item.loc).pathname,
        lastmod: item.lastmod ? new Date(item.lastmod).toISOString() : null
    }));
};

export default children;