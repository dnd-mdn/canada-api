# canada-api

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).

## Install
### Browsers

    <script src="https://cdn.jsdelivr.net/npm/canada-api@1.1.1"></script>

### Nodejs

    npm install canada-api

## Usage
### Browsers

    <script>
        ca.meta("en/department-national-defence")
    </script>

### Nodejs

    const ca = require("canada-api")
    ca.meta("en/department-national-defence")

## API
### ca.children(node)

Uses sitemaps to fetch an array of child nodes

    ca.children("/en/department-national-defence/maple-leaf")
    ca.children("/fr/ministere-defense-nationale/feuille-derable")

Returns: `Promise` Resolves: node object with `children` property

Only for page nodes, other types return an error `Not Found`

### ca.meta(node)

Fetches metadata of a node

    ca.meta("/en/department-national-defence/maple-leaf")
    ca.meta("/content/dam/dnd-mdn/images/maple-leaf/ml-logo.jpg")

Returns: `Promise` Resolves: node object with `meta` property

### ca.content(node)

Fetches content of a node, as text or json

    ca.content("/en/department-national-defence/maple-leaf")
    ca.content("/content/dam/dnd-mdn/documents/json/maple-en.json")

Returns: `Promise` Resolves: node object with `content` property

## Arguments

All functions take a node argument which accepts a couple types

### path string

Valid path strings include:

    en/department-national-defence
    /en/department-national-defence.html
    /en/department-national-defence?param=ignored
    
    https://www.canada.ca/en/department-national-defence.html

    content/canadasite/department-national-defence
    /content/canadasite/department-national-defence/

    content/dam/dnd-mdn/documents/json/maple-en.json
    /content/dam/dnd-mdn/images/maple-leaf/ml-logo.jpg

### node object

A node object can passed and it will be extended with the addition properties

    var node = { path: '/en/department-national-defence/maple-leaf' }

    Promise.all([
        ca.meta(node),
        ca.content(node)
    ]).then(function() {
        // object exented with meta and content properties
        console.log(node)
    })
