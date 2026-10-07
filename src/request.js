import { BASE_URL, USER_AGENT, DEFAULT_TIMEOUT } from "./config.js";

/**
 * Raw HTTP client for canada.ca
 * @param {string|URL} url - Relative or absolute URL on canada.ca
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<{data: string|object, status: number, statusText: string, headers: object}>}
 * @throws {Error} If the request fails or returns a non-2xx status. Errors include `url`; non-2xx errors also include `status` and `statusText`.
 */
const request = async (url, options = {}) => {
    url = new URL(url, BASE_URL);
    url.searchParams.set('_', Date.now());

    const { headers: customHeaders = {}, ...requestOptions } = options;

    let response;
    try {
        response = await fetch(url, {
            signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
            ...requestOptions,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': '*/*',
                ...customHeaders
            }
        });
    } catch (e) {
        e.url = url.toString();
        throw e;
    }

    if (!response.ok) {
        const error = new Error(`Request to ${url} failed: ${response.status} ${response.statusText}`);
        error.url = url.toString();
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
    }

    let data = await response.text();
    const isJson = response.headers.get('content-type')?.includes('application/json');

    if (isJson) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            const error = new Error(`Failed to parse JSON response from ${url}: ${e.message}`);
            error.url = url.toString();
            throw error;
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