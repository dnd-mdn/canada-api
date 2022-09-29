const normalize = require('./normalize.js')
const merge = require('merge-options')
const fetch = require('./fetch.js')

/**
 * Default fetch options
 * @const {object}
 * @private
 */
const defaultOptions = {
    rawContent: false
}

/**
 * Get node content
 * @param {string} url node URL
 * @param {Object} [options] fetch options
 * @returns {Promise<any>}
 */
const content = async (url, options = {}) => {
    url = normalize(url, 'content')
    options = merge(defaultOptions, options)

    let response = await fetch(url, options)

    // Return raw text
    if (options.rawContent) {
        return await response.text()
    }

    let type = response.headers.get('Content-Type')
    
    if (type.includes('/json')) {
        return response.json()
    }

    let text = await response.text()

    // Compress whitespace in html
    if (type.includes('text/html')) {
        text = text.replace(/\s+/g, ' ')
    }

    return text
}

// Default export
module.exports = exports = content
