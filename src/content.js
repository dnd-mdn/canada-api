import normalize from "./normalize.js";
import request from "./request.js";

/**
 * Fetch HTML content for a canada.ca page
 * @param {string|URL} url - Absolute or relative URL
 * @returns {Promise<{data: string, status: number, statusText: string, headers: object}>}
 * @throws {Error} If the request fails or returns a non-2xx status
 */
const content = async (url) => {
    const target = normalize(url);
    target.pathname += '.html';
    target.searchParams.set('_', Date.now());

    return request(target, { 
        signal: AbortSignal.timeout(10000),
        redirect: 'error'
    });
};

export default content;