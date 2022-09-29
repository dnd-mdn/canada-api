const normalize = require('./normalize.js')
const merge = require('merge-options')
const fetch = require('./fetch.js')

/**
 * Default fetch options
 * @const {object}
 * @private
 */
const defaultOptions = {
    rawContent: false,
    jobOptions: {
        expiration: 30000
    }
}

/**
 * Get node metadata from jcr content
 * @param {string} url node path
 * @param {Object} [options] fetch options
 * @returns {Promise<Object>}
 */
const meta = async (url, options) => {
    url = normalize(url, 'meta')
    options = merge(defaultOptions, options)

    let response = await fetch(url, options)

    if (!response.headers.get('content-type').includes('/json')) {
        throw new Error('Unexpected response content-type')
    }

    // Return raw text
    if (options.rawContent) {
        return await response.text()
    }

    let json = await response.json()

    // Format meta properties
    Object.keys(json).forEach(key => {
        if (json[key] === 'true') {
            json[key] = true
        } else if (json[key] === 'false') {
            json[key] = false
        } else if (key.endsWith('@TypeHint')) {
            delete json[key]
        } else if (typeof json[key] === 'string') {
            json[key] = maybeParseDate(json[key])
        } else if (Array.isArray(json[key]) && json[key].length === 0) {
            delete json[key]
        }
    })

    // Sort object keys alphabetically for readability
    return Object.keys(json).sort().reduce((obj, key) => {
        obj[key] = json[key]
        return obj
    }, {})
}

/**
 * Map month name to number
 * @const {object}
 * @private
 */
const months = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
}

/**
 * Try to parse a date
 * @param {string} date
 * @returns {number|string}
 * @private
 */
function maybeParseDate(date) {
    // Simple
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return Date.parse(date)
    }

    // RFC1123
    let m = /^\w{3} (\w{3}) (\d{2}) (\d{4}) ([\d:]{8}) GMT([\-+]\d{4})$/.exec(date)
    if (m) {
        return Date.parse(m[3] + '-' + months[m[1]] + '-' + m[2] + 'T' + m[4] + m[5])
    }

    return date
}

// Default export
module.exports = exports = meta


meta('en', {
    rawResponse: true
}).then(console.log)