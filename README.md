# canada-api

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).

## Install
### Browsers

    <script src="https://cdn.jsdelivr.net/npm/canada-api@2.0.0"></script>
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
### ca.fetch(url, [options])
`Promise<Response>` Rate limited [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) with some error checking
### ca.limiter
`Bottleneck` Access to [rate limiter](https://www.npmjs.com/package/bottleneck)
### ca.normalize(url, [type=path])
`string` Normalize AEM url ('path', 'children', 'content', 'meta')


## Basic API
### ca.children(url, [options])
`Promise<Array>` Array of child nodes 
### ca.content(url, [options])
`Promise<Object|string>` Content of a node, as text or json 
### ca.meta(url, [options])
`Promise<Object>` Metadata object 


## Extended API
TBD
