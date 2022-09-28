# canada-api

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).

## Install
### Browsers

    <script src="https://cdn.jsdelivr.net/npm/canada-api@2.0.3"></script>
    <script>
        ca.meta("en/department-national-defence").then(meta => {
            console.log(meta)
        })
    </script>

### Nodejs

    npm install canada-api

    const ca = require("canada-api")
    ca.meta("en/department-national-defence")

## Core API

### ca.fetch(url[, options])

- **url** `<string>` | `<URL>` URL
- **options** `<Object>` fetch [options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options) (Some limitations based on implementation)
    - **jobOptions** `<Object>` rate limiter [job options](https://github.com/SGrondin/bottleneck#job-options)
- Returns: `<Promise>` Fulfills with `<Response>`

Similar functionality to the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) standard.  Calls are rate limited to avoid hitting request limits that result in throttling. Throws an error if the request does not complete successfully or if the destination URL is not on www.canada.ca.


### ca.fetch.limiter

- `<Bottleneck>`

The [Rate limiter](https://github.com/SGrondin/bottleneck#readme) used in fetch requests.


### ca.normalize(url[, type])

- **url** `<string>` | `<URL>` node URL
- **type** `<string>` Default: `'path'` Options: `'children'` `'content'` `'meta'`
- Returns: `<string>` Normalized path or URL

Validates and formats www.canada.ca URLs based on type. URLs can take many forms, so not all options will be valid. Throws an error if the URL is invalid, or the type requested is not possible.

### ca.normalize.baseURL

- `<string>`

Base URL used for resolving relative URLs as well as URL validation. Value is `'https://www.canada.ca'`.


## Basic API

### ca.children(url[, options])

- **url** `<string>` | `<URL>` | `Array<string|URL>` node URL(s)
- **options** `<Object>` Fetch [options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options)
    - **jobOptions** `<Object>` Rate limiter [options](https://github.com/SGrondin/bottleneck#job-options)
- Returns: `<Promise>` Fulfills with `Array` of child nodes

Uses sitemaps to generate a list of child nodes

### ca.content(url[, options])

`Promise<Object|string>` Content of a node, as text or json


### ca.meta(url[, options])

`Promise<Object>` Metadata object 


## Extended API

TBD
