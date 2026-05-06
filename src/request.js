import { BASE_URL } from "./config.js";

/**
 * Raw HTTP client for canada.ca
 * @param {string|URL} url - Relative or absolute URL on canada.ca
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<{data: string|object, status: number, statusText: string, headers: object}>}
 * @throws {Error} If the request fails or returns a non-2xx status
 */
const request = async (url, options = {}) => {
    url = new URL(url, BASE_URL);

    const { headers: customHeaders = {}, ...requestOptions } = options;

    let response;
    try {
        response = await fetch(url, {
            signal: AbortSignal.timeout(30000),
            ...requestOptions,
            headers: {
                'User-Agent': 'canada-api/5.1.5',
                'Accept': '*/*',
                ...customHeaders
            }
        });
    } catch (e) {
        e.url = url.toString();
        throw e;
    }

    if (!response.ok) {
        const error = new Error(`${response.status} ${response.statusText}`);
        error.url = url.toString();
        throw error;
    }

    let data = await response.text();
    const isJson = response.headers.get('content-type')?.includes('application/json');

    if (isJson) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            e.url = url.toString();
            throw e;
        }
    }

    return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers)
    };
};

export default request;