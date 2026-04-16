import normalize from "./normalize.mjs";
import request from "./request.mjs";
import children from "./children.mjs";
import content from "./content.mjs";
import meta from "./meta.mjs";

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