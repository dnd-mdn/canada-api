const fetch = require('./core/fetch.js')
const normalize = require('./core/normalize.js')
const children = require('./basic/children.js')
const content = require('./basic/content.js')
const meta = require('./basic/meta.js')

module.exports = exports = {
    // Core
    fetch,
    normalize,

    // Basic API
    children,
    content,
    meta,
}
