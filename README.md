# canada-api

[![NPM Version](https://img.shields.io/npm/v/canada-api?branch=main)](https://www.npmjs.com/package/canada-api) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dnd-mdn/canada-api/blob/main/LICENSE.md)

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca). 🇨🇦

## Install
### Browsers

```html
<script src="https://cdn.jsdelivr.net/npm/canada-api@2.0.3"></script>
<script>
    ca.meta("en/department-national-defence").then(meta => {
        console.log(meta)
    })
</script>
```

### Nodejs

```javascript
const ca = require("canada-api")
ca.meta("en/department-national-defence")
```



## Core API

### `ca.fetch(url[, options])`

- `url` {string|URL} absolute URL
- `options` {Object} fetch [options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options) (Some limitations based on implementation)
    - `jobOptions` {Object} rate limiter [job options](https://github.com/SGrondin/bottleneck#job-options)
- Returns: {Promise} Fulfills with {Response} upon success

Uses [cross-fetch](https://github.com/lquixada/cross-fetch#readme) for a universal [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation. Calls are rate limited to avoid hitting request limits that result in throttling. Throws an {Error} if the request does not complete successfully or if the destination URL is not on [canada.ca](https://www.canada.ca).


### `ca.fetch.limiter`

- {Bottleneck}

The [Rate limiter](https://github.com/SGrondin/bottleneck#readme) used in `ca.fetch()`.


### `ca.normalize(url[, type])`

- `url` {string|URL} node URL
- `type` {string} Possible values `'path'`, `'children'`, `'content'` or `'meta'`. **Default**: `'path'`
- Returns: {string} Normalized path or URL

Validates and formats [canada.ca](https://www.canada.ca) URLs based on type. URLs can take many forms, so not all options will be valid. Throws an {Error} if the URL is invalid, or the type requested is not possible.


### `ca.normalize.baseURL`

- {string}

Base URL used for resolving relative URLs as well as URL validation. Value is `'https://www.canada.ca'`.



## Basic API

### `ca.children(url[, options])`

- `url` {string|URL} absolute or relative URL
- `options` {Object} fetch [options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
    - `jobOptions` {Object} rate limiter [job options](https://github.com/SGrondin/bottleneck#job-options)
- Returns: {Promise} Fulfills with {Object[]} of child nodes

Parses sitemaps to get a list of child nodes.


### `ca.content(url[, options])`

- `url` {string|URL} absolute or relative URL
- `options` {Object} fetch [options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
    - `jobOptions` {Object} rate limiter [job options](https://github.com/SGrondin/bottleneck#job-options)
    - `rawContent` {boolean} Fulfills with unmodified text {string} **Default:** `false`
- Returns: {Promise} Fulfills with {string|Object}

Retrieves the document contents.  The result depends on the `content-type` header of {Response}:
- `'json'` parses response and fulfills with {Object}
- `'text/html'` compresses whitespace and fulfills with {string}
- Other types are fulfilled as {string} with no modification


### `ca.meta(url[, options])`

- `url` {string|URL} absolute or relative URL
- `options` {Object} fetch [options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
    - `jobOptions` {Object} rate limiter [job options](https://github.com/SGrondin/bottleneck#job-options)
    - `rawContent` {boolean} Fulfills with unmodified text {string} **Default:** `false`
- Returns: {Promise} Fulfills with {Object} with metadata properties

Nodes contain a variety of metadata properties that can be accessed through a public API. Some properties are reformatted for consistency. A separate document will be created as a reference for the most useful ones.


## Extended API

TBD