const normalize = require('../core/normalize.js')
const request = require('../core/request.js')

/**
 * Get list of child nodes from sitemap
 * @param {string} url node url
 * @returns {Promise<Array>}
 */
const children = async url => {
    url = normalize(url, 'children')

    let response = await request(url)

    // Parse XML sitemap
    let children = response.data.match(/<url>.*?<\/url>/g).map(url => {
        let loc = url.match(/<loc>([^<]+)<\/loc>/)
        let mod = url.match(/<lastmod>([^<]+)<\/lastmod>/)

        return {
            path: normalize(loc[1]).pathname,
            lastmod: mod ? new Date(mod[1]).toISOString() : null
        }
    })

    // First entry may be the parent
    if (children.length && children[0].path === normalize(url).pathname) {
        children.shift()
    }

    response.data = children
    return response
}

// Default export
module.exports = exports = children
