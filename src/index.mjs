import { fetch, limiter } from './fetch.mjs'
import normalize from './normalize.mjs'
import children from './children.mjs'
import content from './content.mjs'
import meta from './meta.mjs'

export default {

    // Core
    fetch: fetch,
    limiter: limiter,
    normalize: normalize,

    // Basic API
    children: children,
    content: content,
    meta: meta,

}
