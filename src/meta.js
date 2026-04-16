import axios from "axios";
import normalize from "./normalize.js";
import { BASE_URL } from "./config.js";

/**
 * Axios instance configured for fetching JCR metadata
 * @type {import('axios').AxiosInstance}
 * @description Returns formatted metadata
 */
const meta = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    maxRedirects: 0
});

// Transform URL
meta.interceptors.request.use(config => {
    const url = normalize(config.url);

    url.pathname = url.pathname + '/_jcr_content.json';
    url.searchParams.set('_', Date.now());

    config.url = url.toString();
    return config;
}, error => {
    return Promise.reject(error);
});

// Process response data
meta.interceptors.response.use(response => {
    response.data = formatMeta(response.data);

    return response;
}, error => {
    return Promise.reject(error);
});

/**
 * Month name to number mapping
 * @const {Record<string, string>}
 * @private
 */
const months = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
}

/**
 * Try to parse and format date strings from JCR into ISO 8601
 * @param {string} text - Potential date string to format
 * @returns {string} ISO 8601 timestamp or original text if not a recognized date
 * @description Supports YYYY-MM-DD and JCR date format (e.g. "Wed Nov 20 2019 13:17:13 GMT-0500").
 * Uses explicit parsing to ensure consistent output across Node.js and browsers.
 * @private
 */
function formatDate(text) {
    // Simple YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return new Date(text).toISOString()
    }

    // RFC1123 format
    let m = /^\w{3} (\w{3}) (\d{2}) (\d{4}) ([\d:]{8}) GMT([\-+]\d{4})$/.exec(text)
    if (m) {
        return new Date(`${m[3]}-${months[m[1]]}-${m[2]}T${m[4]}${m[5]}`).toISOString()
    }

    return text
}

/**
 * Format and normalize metadata object
 * @param {Record<string, any>} data - Raw metadata object from JCR
 * @returns {Record<string, any>} Formatted metadata with normalized types and sorted keys
 * @description Converts string booleans to native booleans, formats dates to ISO 8601,
 * removes @TypeHint properties and empty arrays, sorts keys alphabetically, and adds a
 * normalized `peer` field when `gcAltLanguagePeer` is present.
 */
export const formatMeta = (data) => {
    const result = {}

    for (const [key, value] of Object.entries(data)) {
        if (key.endsWith('@TypeHint')) continue
        if (Array.isArray(value) && value.length === 0) continue

        if (value === 'true') {
            result[key] = true
        } else if (value === 'false') {
            result[key] = false
        } else if (key === 'gcAltLanguagePeer') {
            result[key] = value
            result['peer'] = normalize(value).pathname
        } else if (typeof value === 'string') {
            result[key] = formatDate(value.trim())
        } else {
            result[key] = value
        }
    }

    // Sort object keys alphabetically for readability
    return Object.keys(result).sort().reduce((obj, key) => {
        obj[key] = result[key]
        return obj
    }, {})
}

export default meta;