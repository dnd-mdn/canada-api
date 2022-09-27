const normalize = require('./normalize.js')
const merge = require('merge-options')
const fetch = require('./fetch.js')

/**
 * Default fetch options
 * @const {object}
 */
const defaultOptions = {
    jobOptions: {
        priority: 0
    }
}

/**
 * Get node content
 * @param {string} url node url
 * @param {Object} [options] fetch options
 * @returns {Promise<any>}
 */
const content = async (url, options) => {
    url = normalize(url, 'content')
    options = merge(defaultOptions, options)
    
    let response = await fetch(url, options)
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

module.exports = exports = content
