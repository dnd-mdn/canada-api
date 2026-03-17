
const BASE_URL = 'https://www.canada.ca';

/**
 * Normalize AEM path
 * @param {string|URL} url
 * @returns {URL}
 */
const normalize = (url) => {

    if (typeof url === 'string') {
        url = new URL(url, BASE_URL + '/')
    } else if (!(url instanceof URL)) {
        throw new TypeError('string or URL object expected')
    }

    // Verify domain
    if (url.origin !== BASE_URL) {
        throw new Error('URL must start with ' + BASE_URL)
    }

    url.pathname = url.pathname.replace(/^\/content\/canadasite/, '');

    // Verify root
    if (!url.pathname.startsWith('/en/') && !url.pathname.startsWith('/fr/')) {
        throw new Error('Invalid path')
    }

    // Strip extension and trailing slashes
    url.pathname = url.pathname.replace(/(\.[^/]+|\/+)$/, '')

    return url
}

export default normalize;