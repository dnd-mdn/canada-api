import { XMLParser, XMLValidator } from "fast-xml-parser";
import normalize from "./normalize.js";
import request from "./request.js";

const parser = new XMLParser();

/**
 * Represents a single URL entry from a sitemap
 * @typedef {object} SitemapEntry
 * @property {string} path - The normalized URL path (e.g., '/en/page')
 * @property {string|null} lastmod - ISO 8601 timestamp or null if not present
 */

/**
 * Parse XML sitemap data into structured URL entries
 * @param {string} data - Raw XML sitemap content
 * @returns {SitemapEntry[]} Array of sitemap entries with path and lastmod. Entries missing a `<loc>` element are skipped.
 * @throws {Error} If the XML is malformed or invalid
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

/**
 * Fetch and parse sitemap children for a canada.ca page
 * @param {string|URL} url - Absolute or relative URL
 * @returns {Promise<{data: SitemapEntry[], status: number, statusText: string, headers: object}>}
 * @throws {Error} If the request fails or returns a non-2xx status
 */
const children = async (url) => {
    const target = normalize(url);
    target.pathname += '.sitemap.xml';
    target.searchParams.set('_', Date.now());

    const response = await request(target, {
        redirect: 'error'
    });

    response.data = parseSitemap(response.data);
    return response;
};

export default children;