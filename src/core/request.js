const normalize = require('./normalize')
const crossFetch = require('cross-fetch')
const Bottleneck = require('bottleneck/light.js')

/**
 * Default limiter options
 * @see https://stackleap.io/js/bottleneck#user-content-constructor
 * @const {object}
 * @private
 */
const limiterOptions = {
    reservoir: 150,
    reservoirRefreshAmount: 150,
    reservoirRefreshInterval: 5000,
    maxConcurrent: 10,
    trackDoneStatus: true
}

/**
 * Rate limiter
 * @const {Bottleneck}
 */
const limiter = new Bottleneck(limiterOptions)

/**
 * Passthrough to prevent running method on non window object
 * @param {string|URL} url
 * @private
 */
const pFetch = url => crossFetch(url)

/**
 * Modified rate limited fetch
 * @param {string|URL} url
 * @param {object} [options] Fetch options
 * @returns {Promise<Object>}
 */
async function request(url) {

    // Handle relative URLs
    if (typeof url === 'string') {
        url = new URL(url, normalize.baseURL)
    }

    // Set cache busting param
    url.searchParams.set('_', Date.now())

    let response = await limiter.schedule(pFetch, url)

    // Verify response code
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    // Verify destination
    if (!response.url.startsWith(normalize.baseURL)) {
        throw new Error('Invalid destination URL')
    }

    // Determine if path changed
    let redirected = normalize(url).pathname !== normalize(response.url).pathname

    // Format result
    return {
        url: response.url,
        redirected: redirected,
        data: await responseData(response),
    }
}

/**
 * Get data of the response by type
 * @param {Response} response 
 * @returns {Promise<any>}
 * @private
 */
async function responseData(response) {
    const contentType = response.headers.get('content-type')

    // Parse JSON
    if (contentType.includes('application/json')) {
        return response.json()
    }

    return response.text()
}

// Exports
module.exports = exports = request
exports.limiter = limiter
