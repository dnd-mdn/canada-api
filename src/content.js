import normalize from "./normalize.js";

/**
 * Fetch HTML content for a canada.ca page
 * @param {string|URL} url - Absolute or relative URL
 * @returns {Promise<{data: string, status: number, statusText: string, headers: Headers}>}
 * @throws {Error} If the request fails or returns a non-2xx status
 */
const content = async (url) => {
    const target = normalize(url);
    target.pathname += '.html';
    target.searchParams.set('_', Date.now());

    const response = await fetch(target, {
        signal: AbortSignal.timeout(10000),
        redirect: 'error'
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

export default content;
