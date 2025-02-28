import axios from "axios";
import normalize from "./normalize.mjs";

// Create a new axios instance
const meta = axios.create({
    baseURL: "https://www.canada.ca",
    timeout: 5000,
    maxRedirects: 0
});

// Transform URL
meta.interceptors.request.use(config => {
    config.url = normalize(config.url);

    config.url.pathname = config.url.pathname + '/_jcr_content.json';
    config.url.searchParams.set('_', Date.now());
    
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
 * Map month name to number
 * @const {object}
 * @private
 */
const months = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
}

/**
 * Try to format dates
 * @param {string} text
 * @returns {string}
 * @private
 */
function formatDate(text) {
    // Simple
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return new Date(text).toISOString()
    }

    // RFC1123
    let m = /^\w{3} (\w{3}) (\d{2}) (\d{4}) ([\d:]{8}) GMT([\-+]\d{4})$/.exec(text)
    if (m) {
        return new Date(m[3] + '-' + months[m[1]] + '-' + m[2] + 'T' + m[4] + m[5]).toISOString()
    }

    return text
}

export const formatMeta = (data) => {
    // Format some properties for consistency
    for (const [key, value] of Object.entries(data)) {
        if (value === 'true') {
            data[key] = true
        } else if (value === 'false') {
            data[key] = false
        } else if (key.endsWith('@TypeHint')) {
            delete data[key]
        } else if (typeof value === 'string') {
            data[key] = formatDate(data[key].trim())
        } else if (Array.isArray(value) && value.length === 0) {
            delete data[key]
        }
    }
    
    // Sort object keys alphabetically for readability
    return Object.keys(data).sort().reduce((obj, key) => {
        obj[key] = data[key]
        return obj
    }, {})
}

export default meta;