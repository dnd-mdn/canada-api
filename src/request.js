import { BASE_URL } from "./config.js";

/**
 * Raw HTTP client for canada.ca
 * @param {string|URL} url - Relative or absolute URL on canada.ca
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<{data: string|object, status: number, statusText: string, headers: object}>}
 * @throws {Error} If the request fails or returns a non-2xx status
 */
const request = async (url, options = {}) => {
    const response = await fetch(new URL(url, BASE_URL), {
        signal: AbortSignal.timeout(30000),
        headers: {
            'User-Agent': 'canada-api/5.1.3',
            'Accept': '*/*',
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        const error = new Error(`${response.status} ${response.statusText}`);
        error.status = response.status;
        error.url = url.toString();
        throw error;
    }

    const text = await response.text();
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? JSON.parse(text) : text;

    return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers)
    };
};

export default request;