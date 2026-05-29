import normalize from "./normalize.js";
import request from "./request.js";

/**
 * Fetch content for a canada.ca page or DAM asset
 * @param {string|URL} url - Absolute or relative URL
 * @returns {Promise<{data: string|object, status: number, statusText: string, headers: object}>}
 * @throws {Error} If the request fails or returns a non-2xx status
 */
const content = async (url) => {
    const target = normalize(url);

    if (!target.pathname.startsWith('/content/dam/')) {
        target.pathname += '.html';
    }

    return request(target, {
        redirect: 'error'
    });
};

export default content;