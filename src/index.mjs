import fetch from 'cross-fetch'
import Bottleneck from 'bottleneck'

const domain = 'www.canada.ca'

/**
 * Map month name to index
 */
const months = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
}

/**
 * Parse date in RFC1123 format
 * @param {string} date
 * @returns {Date}
 */
function parseDate(date) {
    let m = /^\w{3} (\w{3}) (\d{2}) (\d{4}) ([\d:]{8}) GMT([\-+]\d{4})$/.exec(date)
    return m ? new Date(m[3] + '-' + months[m[1]] + '-' + m[2] + 'T' + m[4] + m[5]).getTime() : date
}

/**
 * Throttles requests to prevent being throttled by the server
 */
export const limiter = new Bottleneck({
    reservoir: 100,
    reservoirRefreshAmount: 100,
    reservoirRefreshInterval: 30000,
    maxConcurrent: 6,
})

/**
 * Format fetch URL
 * @param {string} path Node path
 * @param {string} suffix 
 * @returns {string}
 */
function formatURL(path, suffix) {
    return 'https://' + domain + path + suffix + '?_=' + Date.now()
}

/**
 * Normalize AEM path from URL
 * @param {string} url
 * @throws {Error} Invalid path
 * @returns {string}
 */
function normalizePath(url) {
    url = new URL(url, 'https://' + domain)

    if (url.hostname !== domain) {
        throw new Error('Invalid hostname ' + url.hostname)
    }

    if (url.pathname.startsWith('/content/dam/')) {
        return url.pathname
    } else if (/^\/(en|fr)(\/|$)/.test(url.pathname)) {
        return url.pathname.replace(/\.[^\.]+$/, '').replace(/\/$/, '')
    }

    throw new Error('Invalid path ' + url)
}

/**
 * Normalize node object (Modifies existing node if provided)
 * @param {string|Object} node
 * @throws {Error} Invalid node
 * @returns {Object}
 */
function normalizeNode(node) {
    if (typeof node === 'string') {
        return { path: normalizePath(node) }
    } else if (typeof node === 'object' && typeof node.path === 'string') {
        node.path = normalizePath(node.path)
        return node
    }

    throw new Error('Invalid node')
}

/**
 * Verify if fetch succeeded
 * @param {Response} response
 * @throws {Error} Fetch failed to load as expected
 * @returns {Response}
 */
function verifyResponse(response) {
    if (!response.ok) {
        // Bad http response
        throw new Error(response.statusText)
    } else if (!response.url.includes(domain)) {
        // Redirected outside of domain
        throw new Error('Redirect')
    } else if (response.url.includes('/errors/404.html')) {
        // 404 document was loaded
        throw new Error('Not Found')
    }

    return response
}

/**
 * Get node children
 * @param {string|Object} node 
 * @param {array} list Node list to extend
 * @returns {Object}
 */
export function children(node) {
    node = normalizeNode(node)

    return limiter.schedule(() => fetch(formatURL(node.path, '.sitemap.xml')))
        .then(verifyResponse)
        .then(response => response.text())
        .then(xml => {
            // Extract XML data
            let locs = xml.match(/(?<=<loc>)[^<]+(?=<\/loc>)/g)
            let mods = xml.match(/(?<=<lastmod>)[^<]+(?=<\/lastmod>)/g)
            return locs.map((loc, index) => {
                return {
                    path: normalizePath(loc),
                    lastmod: new Date(mods[index]).getTime()
                }
            })
        })
        .catch(err => {
            return err
        })
}

/**
 * Get node metadata
 * @param {string|Object} node 
 * @returns {Object}
 */
export function meta(node) {
    node = normalizeNode(node)

    return limiter.schedule(() => fetch(formatURL(node.path, '/jcr:content.json')))
        .then(verifyResponse)
        .then(response => response.json())
        .then(meta => {
            // Format properties
            for (var key in meta) {
                if (meta[key] === 'true') {
                    meta[key] = true
                } else if (meta[key] === 'false') {
                    meta[key] = false
                } else if (key.endsWith('@TypeHint')) {
                    delete meta[key]
                } else if (typeof meta[key] === 'string' && meta[key].length === 33) {
                    meta[key] = parseDate(meta[key])
                }
            }

            node.meta = meta
            return node
        })
        .catch(err => {
            node.meta = err
            return node
        })
}

/**
 * Get node content
 * @param {string|Object} node 
 * @returns {Object}
 */
export function content(node) {
    node = normalizeNode(node)
    let suffix = node.path.startsWith('/content/dam/') ? '' : '.html'

    return limiter.schedule(() => fetch(formatURL(node.path, suffix)))
        .then(verifyResponse)
        .then(response => {
            if (response.headers.get('Content-Type').includes('application/json')) {
                return response.json()
            }
            return response.text()
        })
        .then(content => {
            node.content = content
            return node
        })
        .catch(err => {
            node.content = err
            return node
        })
}
