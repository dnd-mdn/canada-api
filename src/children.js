const normalize = require('./normalize.js')
const merge = require('merge-options')
const fetch = require('./fetch.js')

/**
 * Default fetch options
 * @const {object}
 * @private
 */
const defaultOptions = {
    jobOptions: {
        priority: 0
    },
}

/**
 * Get list of child nodes from sitemap
 * @param {string} url node url
 * @param {Object} [options] fetch options
 * @returns {Promise<Array>}
 */
const children = async (url, options) => {
    url = normalize(url, 'children')
    options = merge(defaultOptions, options)

    let response = await fetch(url, options)
    let xml = await response.text()

    // Parse XML sitemap
    let children = xml.match(/<url>.*?<\/url>/g).map(url => {
        let loc = url.match(/<loc>([^<]+)<\/loc>/)
        let mod = url.match(/<lastmod>([^<]+)<\/lastmod>/)

        return {
            path: normalize(loc[1]),
            lastmod: mod ? Date.parse(mod[1]) : null
        }
    })

    // First entry may be the parent
    if (children.length && children[0].path === normalize(url)) {
        children.shift()
    }

    return children
}

// Default export
module.exports = exports = children
