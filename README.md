# canada-api

[![NPM Version](https://img.shields.io/npm/v/canada-api?branch=main)](https://www.npmjs.com/package/canada-api) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dnd-mdn/canada-api/blob/main/LICENSE.md)

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).


## Browser
```html
<script src="https://cdn.jsdelivr.net/npm/canada-api@3.0.4"></script>
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
- Returns: {Promise} Fulfills with {Object} upon success

Throws {Error} if the request does not complete successfully or if the destination URL is not on [canada.ca](https://www.canada.ca).

The properties included on each object:
- `url` {string} destination URL
- `redirected` {boolean} If the destination path is different from the request
- `data` {string|Object} Document content as string or json data

```json
{
  "url": "https://www.canada.ca/en/department-national-defence.html",
  "redirected": false,
  "data": "<!DOCTYPE html>\r\n...."
}
```


### `ca.request.limiter`

- {Bottleneck}

The [Rate limiter](https://github.com/SGrondin/bottleneck#readme) used in `ca.request()`.


### `ca.normalize(url[, type])`

- `url` {string|URL} node URL
- `type` {string} Possible values `'path'`, `'children'`, `'content'` or `'meta'`. **Default**: `'path'`
- Returns: {URL} Normalized URL

Validates and formats [canada.ca](https://www.canada.ca) URLs based on type. URLs can take many forms, so not all options will be valid. Throws an {Error} if the URL is invalid, or the type requested is not possible.


### `ca.normalize.baseURL`

- {string}

Base URL used for resolving relative URLs as well as URL validation. Value is `'https://www.canada.ca'`.



## Basic API

### `ca.children(url)`

- `url` {string|URL} absolute or relative URL
- Returns: {Promise} Fulfills with {Object} containing child nodes

Parses sitemaps to get a list of child nodes.

```json
{
  "url": "https://www.canada.ca/en/department-national-defence.sitemap.xml",
  "redirected": false,
  "data": [
    {
      "path": "https://www.canada.ca/en/department-national-defence/...",
      "lastmod": "2022-09-20T00:00:00.000Z"
    },
  ]
}
```

Getting children of DAM folders/assets is not available.

### `ca.content(url)`

- `url` {string|URL} absolute or relative URL
- Returns: {Promise} Fulfills with {Object} containing document contents

Retrieves the document contents.

The properties included on each object:
```json
{
  "url": "https://www.canada.ca/en/department-national-defence.html",
  "redirected": false,
  "data": "<!DOCTYPE html>\r\n...."
}
```

Can also be used for DAM assets:

```json
{
  "url": "https://www.canada.ca/content/dam/dnd-mdn/documents/json/maple-en.json",
  "redirected": false,
  "data": {
    "data": []
  }
}
```

### `ca.meta(url)`

- `url` {string|URL} absolute or relative URL
- Returns: {Promise} Fulfills with {Object} containing metadata properties

Nodes contain a variety of metadata properties that can be accessed through a public API. Some properties such as date formats are reformatted for consistency. 

The properties included on each object:
```json
{
  "url": "https://www.canada.ca/en/department-national-defence/_jcr_content.json",
  "redirected": false,
  "data": {
    "cq:lastModified": "2022-10-25T19:16:28.000Z",
    "fluidWidth": false,
  }
}
```

Can also be used for DAM assets:

```json
{
  "url": "https://www.canada.ca/content/dam/dnd-mdn/documents/json/maple-en.json/_jcr_content.json",
  "redirected": false,
  "data": {
    "dam:assetState": "processed",
    "jcr:lastModified": "2022-10-26T19:39:54.000Z",
    "jcr:primaryType": "dam:AssetContent"
  }
}
```

## Extended API

TBD
