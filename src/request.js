import { BASE_URL } from "./config.js";

/**
 * Raw HTTP client for canada.ca
 * @param {string|URL} url - Relative or absolute URL on canada.ca
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<{data: string, status: number, statusText: string, headers: Headers}>}
 * @throws {Error} If the request fails or returns a non-2xx status
 */
const request = async (url, options = {}) => {
    const response = await fetch(new URL(url, BASE_URL), {
        signal: AbortSignal.timeout(30000),
        ...options
    });
    
    if (!response.ok) {
        const error = new Error(`${response.status} ${response.statusText}`);
        error.status = response.status;
        throw error;
    }

    const data = await response.text();
    
    return { 
        data, 
        status: response.status, 
        statusText: response.statusText, 
        headers: response.headers 
    };
};

export default request;
