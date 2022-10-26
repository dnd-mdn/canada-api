
/**
 * Base URL
 * @const {string}
 * @private
 */
const baseURL = 'https://www.canada.ca/'

/**
 * Normalize AEM URL
 * @param {string|URL} url
 * @param {string} [type=path]
 * @returns {string}
 */
const normalize = (url, type = 'path') => {

    if (typeof url === 'string') {
        url = new URL(url, baseURL)
    } else if (!(url instanceof URL)) {
        throw new TypeError('string or URL object expected')
    }

    // Force https
    url.protocol = 'https'

    // Verify domain
    if (!url.href.startsWith(baseURL)) {
        throw new Error('URL must start with ' + baseURL)
    }

    let isAsset = url.pathname.startsWith('/content/dam')

    // Strip canadasite prefix
    if (!isAsset) {
        url.pathname = url.pathname.replace(/^\/content\/canadasite\//, '')
    }

    // Verify root
    if (!/^\/(en|fr|content\/dam)(\/|\.|$)/.test(url.pathname)) {
        throw new Error('Invalid root')
    }

    // Strip Trailing slashes
    url.pathname = url.pathname.replace(/\/+$/, '')

    // Handle other URL types
    if (url.pathname.includes('/_jcr_content/par')) {
        return normalizeReference(url, type)
    } else if (isAsset) {
        return normalizeAsset(url, type)
    }

    return normalizePage(url, type)
}

/**
 * Normalize AEM page
 * @param {URL} url
 * @param {string} type
 * @returns {URL}
 * @private
 */
function normalizePage(url, type) {
    // Remove existing extension
    url.pathname = url.pathname.replace(/\/?\.(sitemap\.xml|[^/.]+)$/, '')

    if (type === 'meta') {
        url.pathname += '/_jcr_content.json'
    } else if (type === 'children') {
        url.pathname += '.sitemap.xml'
    } else if (type === 'content') {
        url.pathname += '.html'
    }

    return url
}

/**
 * Normalize AEM asset
 * @param {URL} url
 * @param {string} type
 * @returns {URL}
 * @private
 */
function normalizeAsset(url, type) {
    let isDir = /(\/|\/\w+)$/.test(url.pathname)

    if (type === 'meta') {
        url.pathname += isDir ? '.json' : '/_jcr_content.json'
    } else if (type === 'children') {
        throw new Error('Cant load children of an asset node')
    } else if (type === 'content' && isDir) {
        throw new Error('Cant load content of an asset node')
    }

    return url
}

/**
 * Normalize AEM reference
 * @param {URL} url
 * @param {string} type
 * @returns {URL}
 * @private
 */
function normalizeReference(url, type) {

    if (type === 'path') {
        throw new Error('Cant determine path of a reference node directly')
    } else if (type === 'meta') {
        url.pathname = url.pathname.replace(/\/image\.img\.\w+\//, '/image.json/')
    } else if (type === 'children') {
        throw new Error('Cant load children of a reference node')
    }

    return url
}

// Default export
module.exports = exports = normalize

// Expose the baseURL
exports.baseURL = baseURL
