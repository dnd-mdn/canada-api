/**
 * Centralized configuration for canada-api
 */

import pkg from '../package.json' with { type: 'json' };

/** @type {string} Origin for all requests; normalized URLs must match it */
export const BASE_URL ='https://www.canada.ca';

/** @type {string} User-Agent sent with every request, derived from the package version */
export const USER_AGENT = `canada-api/${pkg.version}`;

/** @type {number} Default request timeout in ms. Callers can override by passing a `signal` in options. */
export const DEFAULT_TIMEOUT = 30000;
