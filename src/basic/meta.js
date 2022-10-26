const normalize = require('../core/normalize.js')
const request = require('../core/request.js')

/**
 * Get node metadata from jcr content
 * @param {string} url node path
 * @returns {Promise<Object>}
 */
const meta = async url => {
    url = normalize(url, 'meta')

    let response = await request(url)
    let json = response.data

    // Format some properties for consistency
    for (const [key, value] of Object.entries(json)) {
        if (value === 'true') {
            json[key] = true
        } else if (value === 'false') {
            json[key] = false
        } else if (key.endsWith('@TypeHint')) {
            delete json[key]
        } else if (typeof value === 'string') {
            json[key] = maybeParseDate(json[key].trim())
        } else if (Array.isArray(value) && value.length === 0) {
            delete json[key]
        }
    }

    // Sort object keys alphabetically for readability
    response.data = Object.keys(response.data).sort().reduce((obj, key) => {
        obj[key] = json[key]
        return obj
    }, {})

    return response
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
        return new Date(date).toISOString()
    }

    // RFC1123
    let m = /^\w{3} (\w{3}) (\d{2}) (\d{4}) ([\d:]{8}) GMT([\-+]\d{4})$/.exec(date)
    if (m) {
        return new Date(m[3] + '-' + months[m[1]] + '-' + m[2] + 'T' + m[4] + m[5]).toISOString()
    }

    return date
}

// Default export
module.exports = exports = meta
