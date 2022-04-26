# canada-api

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).

## Install

### Browsers

    <script src="https://cdn.jsdelivr.net/npm/canada-api@1.0.0/dist/ca.js"><script>
    <script>
        ca.meta("en/news").then(console.log)
    </script>

Support: Edge 15+, Firefox 54+, Chrome 51+, Safari 10+

### Nodejs

    npm install canada-api

## API

### ca.children(node)

Fetches listing of child nodes

### ca.meta(node)

Fetches metadata of a node

### ca.content(node)

Fetches content of a node
