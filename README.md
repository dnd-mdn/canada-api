# canada-api

API for fetching public data from [canada.ca](https://www.canada.ca).  Implements rate limiting to prevent being throttled.

## Install

### Browsers

    <script src="https://cdn.jsdelivr.net/gh/bsoicher/canada-api/dist/ca.js"><script>

Support: Edge 15+, Firefox 54+, Chrome 51+, Safari 10+

### Nodejs

Will be published to npm once stable

## API

### ca.children(node)

Fetches listing of child nodes

### ca.content(node)

Fetches content of a node

### ca.meta(node)

Fetches metadata of a node

Note: API also works for DAM assets