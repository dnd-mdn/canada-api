import axios from "axios";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import normalize from "./normalize.js";
import { BASE_URL } from "./config.js";

const parser = new XMLParser();

/**
 * Axios instance configured for fetching sitemap URLs
 * @type {import('axios').AxiosInstance}
 * @description Returns normalized node list of sitemap children
 */
const children = axios.create({
    baseURL: BASE_URL,
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
 * Represents a single URL entry from a sitemap
 * @typedef {object} SitemapEntry
 * @property {string} path - The normalized URL path (e.g., '/en/page')
 * @property {string|null} lastmod - ISO 8601 timestamp or null if not present
 */

/**
 * Parse XML sitemap data into structured URL entries
 * @param {string} data - Raw XML sitemap content
 * @returns {SitemapEntry[]} Array of sitemap entries with path and lastmod
 * @throws {Error} If the XML is malformed or invalid
 * @description Parses XML sitemap format and returns normalized entries with ISO timestamps.
 * Entries missing a `<loc>` element are silently skipped.
 */

export const parseSitemap = (data) => {
    const validation = XMLValidator.validate(data);
    if (validation !== true) throw new Error(validation.err.msg);

    const result = parser.parse(data);

    const urls = result.urlset?.url || [];
    return (Array.isArray(urls) ? urls : [urls]).filter(item => item.loc).map(item => ({
        path: normalize(item.loc).pathname,
        lastmod: item.lastmod ? new Date(item.lastmod).toISOString() : null
    }));
};

export default children;