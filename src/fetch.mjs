import crossFetch from 'cross-fetch'
import Bottleneck from 'bottleneck/light.js'

/**
 * Default limiter options
 * @see https://stackleap.io/js/bottleneck#user-content-constructor
 * @const {object}
 */
export const limiterOptions = {
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
export const limiter = new Bottleneck(limiterOptions)

/**
 * Rate limited standard fetch
 * @const {function}
 */
export const fetchLimit = limiter.wrap(crossFetch)

/**
 * Rate limited custom fetch
 * @param {string|URL} url
 * @param {object} [options] Fetch options
 * @returns {Promise<Response>}
 */
export async function fetch(url, options) {
   
    let response = await fetchLimit.withOptions(options?.jobOptions, url, options)

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

export default fetch
