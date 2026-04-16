import normalize from "./normalize.js";
import request from "./request.js";
import children from "./children.js";
import content from "./content.js";
import meta from "./meta.js";

/**
 * Canada API - Cross-platform client for fetching and parsing canada.ca data
 *
 * @typedef {object} CanadaAPI
 * @property {function} normalize - Normalize and validate canada.ca URLs
 * @property {import('axios').AxiosInstance} request - Raw HTTP client for canada.ca requests
 * @property {import('axios').AxiosInstance} children - Fetch and parse sitemap hierarchies
 * @property {import('axios').AxiosInstance} content - Fetch HTML content pages
 * @property {import('axios').AxiosInstance} meta - Fetch and format JCR metadata
 */
const ca = {
    normalize,
    request,
    children,
    content,
    meta
}

export default ca