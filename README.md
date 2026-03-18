# canada-api

[![NPM Version](https://img.shields.io/npm/v/canada-api?branch=main)](https://www.npmjs.com/package/canada-api) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dnd-mdn/canada-api/blob/main/LICENSE.md)

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).


## Browser
```html
<script src="https://cdn.jsdelivr.net/npm/canada-api@4.0.5"></script>
```

## Node 18+

### Install

```shell
npm install canada-api
```

### Usage

```js
import ca from 'canada-api'
```

## Testing

```shell
npm test
```

Tests use the built-in Node.js test runner (`node:test`) and require Node 18 or later.

## Core API

### `ca.normalize(url)`

- `url` {string|URL} - Full URL or relative path (e.g. `'/en/page'` or `'https://www.canada.ca/en/page'`)
- Returns: {URL} Normalized URL object with cleaned pathname

Validates and normalizes a canada.ca URL. Strips the `/content/canadasite` prefix, file extensions, and trailing slashes.

Throws {TypeError} if `url` is not a string or URL object.
Throws {Error} if the URL is not on canada.ca or the path does not start with `/en/` or `/fr/`.

### `ca.request(url)`

- `url` {string|URL} - Relative or absolute URL on [canada.ca](https://www.canada.ca)
- Returns: {Promise} Fulfills with an axios response object

Raw HTTP client for canada.ca. No URL transformation is applied.

```json
{
  "data": {},
  "status": 200,
  "statusText": "OK",
  "headers": {},
  "config": {},
  "request": {}
}
```

## Basic API

### `ca.children(url)`

- `url` {string|URL} - Absolute or relative URL
- Returns: {Promise} Fulfills with an axios response whose `data` is an array of sitemap entries

Fetches and parses the sitemap for the given page, returning its child pages. Entries without a `<loc>` element are skipped.

```json
{
  "data": [
    {
      "path": "/en/department-national-defence/maple-leaf",
      "lastmod": "2022-09-20T00:00:00.000Z"
    }
  ]
}
```

### `ca.content(url)`

- `url` {string|URL} - Absolute or relative URL
- Returns: {Promise} Fulfills with an axios response whose `data` is the raw HTML string

Retrieves the HTML content of the page.

```json
{
  "data": "<!DOCTYPE html>\r\n...."
}
```

### `ca.meta(url)`

- `url` {string|URL} - Absolute or relative URL
- Returns: {Promise} Fulfills with an axios response whose `data` is a formatted metadata object

Fetches JCR metadata for the given page. The following transformations are applied:

- String `"true"` / `"false"` values are converted to booleans
- `@TypeHint` properties are removed
- Empty arrays are removed
- Date strings are converted to ISO 8601
- Keys are sorted alphabetically
- A normalized `peer` field is added when `gcAltLanguagePeer` is present

```json
{
  "data": {
    "cq:lastModified": "2022-10-25T19:16:28.000Z",
    "fluidWidth": false,
    "peer": "/fr/ministere-defense-nationale/feuille-erable"
  }
}
```
