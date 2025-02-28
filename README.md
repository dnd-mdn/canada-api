# canada-api

[![NPM Version](https://img.shields.io/npm/v/canada-api?branch=main)](https://www.npmjs.com/package/canada-api) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dnd-mdn/canada-api/blob/main/LICENSE.md)

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).


## Browser
```html
<script src="https://cdn.jsdelivr.net/npm/canada-api@4.0.0"></script>
```

## Node 10+

### Install

```shell
npm install canada-api
```

### Usage

```js
const ca = require('canada-api')
```

## Core API

### `ca.request(url)`

- `url` {string|URL} relative or absolute URL on [canada.ca](https://www.canada.ca)
- Returns: {Promise} Fulfills with axios response {Object} upon success

Throws {Error} if the request does not complete successfully or if the destination URL is not on [canada.ca](https://www.canada.ca).

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

### `ca.normalize(url)`

- `url` {string|URL} node URL

Validates and formats [canada.ca](https://www.canada.ca). Throws an {Error} if the URL is invalid, or the type requested is not possible.

## Basic API

### `ca.children(url)`

- `url` {string|URL} absolute or relative URL
- Returns: {Promise} Fulfills with {Object} containing child nodes

Parses sitemaps to get a list of child nodes.

```json
{
  "data": [
    {
      "path": "https://www.canada.ca/en/department-national-defence/...",
      "lastmod": "2022-09-20"
    },
  ]
}
```

Getting children of DAM folders/assets is not available.

### `ca.content(url)`

- `url` {string|URL} absolute or relative URL
- Returns: {Promise} Fulfills with {Object} containing document contents

Retrieves the document contents.

```json
{
  "data": "<!DOCTYPE html>\r\n...."
}
```

### `ca.meta(url)`

- `url` {string|URL} absolute or relative URL
- Returns: {Promise} Fulfills with {Object} containing metadata properties

Nodes contain a variety of metadata properties that can be accessed through a public API. Some properties such as date formats are reformatted for consistency. 

```json
{
  "data": {
    "cq:lastModified": "2022-10-25T19:16:28.000Z",
    "fluidWidth": false,
  }
}
```

