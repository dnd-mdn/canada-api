import { BASE_URL } from './config.js';

/**
 * Normalize a canada.ca URL to a clean pathname
 * @param {string|URL} url - A full URL or relative path (e.g., 'https://www.canada.ca/en/page' or '/en/page')
 * @returns {URL} Normalized URL object with cleaned pathname
 * @throws {TypeError} If url is not a string or URL object
 * @throws {Error} If URL is not from canada.ca or path doesn't start with /en/ or /fr/
 */
const normalize = (url) => {

    if (typeof url === 'string') {
        url = new URL(url, BASE_URL)
    } else if (url instanceof URL) {
        url = new URL(url.href)
    } else {
        throw new TypeError('string or URL object expected')
    }

    // Verify domain
    if (url.origin !== BASE_URL) {
        throw new Error('URL must start with ' + BASE_URL)
    }

    url.pathname = url.pathname.replace(/^\/content\/canadasite/, '');

    // Remove file extensions (like .html, .xml) and trailing slashes
    url.pathname = url.pathname.replace(/\.[^/]*$/, '').replace(/\/+$/, '');

    // Verify root language
    if (!url.pathname.startsWith('/en/') && !url.pathname.startsWith('/fr/')) {
        throw new Error(`Invalid path: "${url.pathname}" must start with /en/ or /fr/`)
    }

    return url
}

export default normalize;