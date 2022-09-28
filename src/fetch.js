const baseURL = require('./normalize').baseURL
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
 * Passthrough arguments to prevent running method on non window object
 * @param {string|URL} url
 * @param {object} [options] Fetch options
 * @private
 */
const pFetch = (url, options) => crossFetch(url, options)

/**
 * Modified rate limited fetch
 * @param {string|URL} url
 * @param {object} [options] Fetch options
 * @returns {Promise<Response>}
 */
const fetch = async (url, options) => {
    let jobOptions = options?.jobOptions || {}
    let response = await limiter.schedule(jobOptions, pFetch, url, options)

    // Verify response code
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    // Verify destination
    if (!response.url.startsWith(baseURL)) {
        throw new Error('Redirect to invalid host')
    }

    return response
}

// Default export
module.exports = exports = fetch

// Expose the limiter
exports.limiter = limiter
