import merge from 'merge-options'
import fetch from './fetch.mjs'
import normalize from './normalize.mjs'

/**
 * Default fetch options
 * @const {object}
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
export async function children(url, options) {
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

export default children
