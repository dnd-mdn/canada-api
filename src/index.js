const fetch = require('./fetch.js')
const normalize = require('./normalize.js')
const children = require('./children.js')
const content = require('./content.js')
const meta = require('./meta.js')

module.exports = exports = {
    // Core
    fetch,
    normalize,

    // Basic API
    children,
    content,
    meta,
}
