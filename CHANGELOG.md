# Changelog

## 5.2.0 - 2026-11-10

- `meta()` no longer rejects the whole response when `gcAltLanguagePeer` cannot be normalized; the raw value is kept and `peer` is omitted.
- `formatDate` now accepts single-digit days in `Date.prototype.toString()`-format dates (e.g. `Wed Nov 5 2019 …`).
- `children()` now skips sitemap entries with an unparseable `<lastmod>` instead of rejecting the whole sitemap.
- The `User-Agent` header is now derived from the package version instead of being hard-coded.
- Moved the default request timeout into the shared config module.
- Errors for non-2xx responses now include `status` and `statusText`.
- Minimum Node.js version is now 22, required for JSON import attributes (`with` syntax, a Node 20.10+ feature; 18 and 20 are EOL).
- Updated dev dependencies (`fast-uri` 3.1.8) to resolve security advisories.

## 5.1.7 - 2026-05-29

- Handle DAM assets (`/content/dam/...`) in `content()` and `meta()`: asset URLs skip the `.html` suffix and return the raw asset JSON instead of the page metadata transform.
- Added tests for asset metadata handling.

## 5.1.6 - 2026-05-28

- Moved cache-busting query parameter into `request()`.
- Removed the 10 second per-method timeouts in `content()` and `meta()`; all methods now use the 30 second default in `request()`, which callers can override by passing their own `signal`. Updated tests accordingly.

## 5.1.5 - 2026-05-06

- More consistent error objects across methods; added tests.

## 5.1.4 - 2026-04-28

- Refactored XML parsing to remove the `fast-xml-parser` dependency in favor of a custom parser, making the package dependency-free.

## 5.1.3 - 2026-04-21

- Added the request `url` to thrown error objects.
- Optimized handling of invalid JSON responses.
- Refactored tests and updated type annotations.
- Simplified response handling in `children()` and `meta()`.
- Fixed the French link in the README.

## 5.1.2 - 2026-04-20

- Normalized response headers.
- Added JSON response handling.
- Documentation updates.

## 5.1.1 - 2026-04-20

- Fixed `request()` and consolidated duplicated request logic.

## 5.1.0 - 2026-04-16

- Replaced `axios` with the native `fetch` API, removing the `axios` dependency.
- Pinned the minimum required Node.js version.
- Removed unnecessary error passthrough.

## 5.0.1 - 2026-04-15

- Updated dependencies.
- Restructured source files (`.mjs` → `.js`).
- Fixed a bug where input URLs were mutated.
- Increased timeouts for slower connections.

## 5.0.0 - 2026-03-17

- Moved the base URL into a shared config module.
- Improved JSDoc coverage and added more tests.
- Fixed `meta()` mutating the original metadata object.
