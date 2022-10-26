const normalize = require('../core/normalize.js')
const request = require('../core/request.js')

/**
 * Get node content
 * @param {string} url node URL
 * @returns {Promise<any>}
 */
const content = async url => {
    url = normalize(url, 'content')
    return request(url)
}

// Default export
module.exports = exports = content
