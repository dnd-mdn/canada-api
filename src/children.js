import normalize from "./normalize.js";
import request from "./request.js";

/**
 * Represents a single URL entry from a sitemap
 * @typedef {object} SitemapEntry
 * @property {string} path - The normalized URL path (e.g., '/en/page')
 * @property {string|null} lastmod - ISO 8601 timestamp or null if not present
 */

/**
 * Parse XML sitemap data into structured URL entries
 * @param {string} xml - Raw XML sitemap content
 * @returns {SitemapEntry[]} Array of sitemap entries with path and lastmod. Entries missing a `<loc>` element are skipped.
 */
export const parseSitemap = (xml) => {
    return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
        .map(([, inner]) => {
            const loc = inner.match(/<loc>([\s\S]*?)<\/loc>/)?.[1];
            const lastmod = inner.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1];
            return { loc, lastmod };
        })
        .filter(item => item.loc)
        .map(item => ({
            path: normalize(item.loc).pathname,
            lastmod: item.lastmod ? new Date(item.lastmod).toISOString() : null,
        }));
}

/**
 * Fetch and parse sitemap children for a canada.ca page
 * @param {string|URL} url - Absolute or relative URL for a canada.ca page
 * @returns {Promise<{data: SitemapEntry[], status: number, statusText: string, headers: object}>}
 * @throws {Error} If the URL points to a DAM asset path or if the request fails/returns a non-2xx status
 */
const children = async (url) => {
    const target = normalize(url);

    if (target.pathname.startsWith('/content/dam/')) {
        throw new Error(`children not available for DAM assets: "${target.pathname}"`);
    }

    target.pathname += '.sitemap.xml';

    const response = await request(target, {
        redirect: 'error'
    });

    response.data = parseSitemap(response.data);
    return response;
};

export default children;