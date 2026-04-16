import normalize from "./normalize.js";
import request from "./request.js";
import children from "./children.js";
import content from "./content.js";
import meta from "./meta.js";

/**
 * @typedef {object} CanadaAPI
 * @property {function} normalize - Normalize and validate canada.ca URLs
 * @property {function} request - Raw HTTP client for canada.ca requests
 * @property {function} children - Fetch and parse sitemap hierarchies
 * @property {function} content - Fetch HTML content pages
 * @property {function} meta - Fetch and format JCR metadata
 */

/** @type {CanadaAPI} */
const ca = {
    normalize,
    request,
    children,
    content,
    meta
}

export default ca