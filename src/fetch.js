const crossFetch = require('cross-fetch')
const Bottleneck = require('bottleneck/light.js')

/**
 * Default limiter options
 * @see https://stackleap.io/js/bottleneck#user-content-constructor
 * @const {object}
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
 * @type {Bottleneck}
 */
const limiter = new Bottleneck(limiterOptions)

/**
 * Passthrough arguments to prevent running method on non window object
 * @const {function}
 */
const passthrough = (url, options) => crossFetch(url, options)

/**
 * Modified rate limited fetch
 * @param {string|URL} url
 * @param {object} [options] Fetch options
 * @returns {Promise<Response>}
 */
const fetch = async (url, options) => {

    let response = await limiter.schedule(options?.jobOptions || {}, passthrough, url, options)

    // Verify response
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    if (typeof url === 'string') {
        url = new URL(url)
    }

    // Prevent host redirect
    if (url.hostname !== new URL(response.url).hostname) {
        throw new Error('Redirect to invalid host')
    }

    return response
}

// Default export
module.exports = exports = fetch

// Expose the limiter
exports.limiter = limiter
