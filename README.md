([Français](#canada-api-1))

# canada-api

[![NPM Version](https://img.shields.io/npm/v/canada-api?branch=main)](https://www.npmjs.com/package/canada-api) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dnd-mdn/canada-api/blob/main/LICENSE.md)

Cross platform API for fetching public data from [canada.ca](https://www.canada.ca).

## Browser

```html
<script src="https://cdn.jsdelivr.net/npm/canada-api@5.1.2"></script>
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

## API

### `ca.normalize(url)`

- `url` {string|URL} - Full URL or relative path (e.g. `'/en/page'` or `'https://www.canada.ca/en/page'`)
- Returns: {URL} Normalized URL object with cleaned pathname

Validates and normalizes a canada.ca URL. Strips the `/content/canadasite` prefix, file extensions, and trailing slashes.

Throws {TypeError} if `url` is not a string or URL object.
Throws {Error} if the URL is not on canada.ca or the path does not start with `/en/` or `/fr/`.

### `ca.children(url)`

- `url` {string|URL} - Absolute or relative URL
- Returns: {Promise} Fulfills with a response whose `data` is an array of sitemap entries

Fetches and parses the sitemap for the given page, returning its child pages. Entries without a `<loc>` element are skipped.

```json
{
  "data": [
    {
      "path": "/en/department-national-defence/maple-leaf",
      "lastmod": "2022-09-20T00:00:00.000Z"
    }
  ],
  "status": 200
}
```

### `ca.content(url)`

- `url` {string|URL} - Absolute or relative URL
- Returns: {Promise} Fulfills with a response whose `data` is the raw HTML string

Retrieves the HTML content of the page.

```json
{
  "data": "<!DOCTYPE html>\r\n....",
  "status": 200
}
```

### `ca.meta(url)`

- `url` {string|URL} - Absolute or relative URL
- Returns: {Promise} Fulfills with a response whose `data` is a formatted metadata object

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
  },
  "status": 200
}
```

### `ca.request`

- `url` {string|URL} - Absolute or relative URL
- `options` {RequestInit} - Optional fetch options
- Returns: {Promise} Fulfills with a response object

Raw HTTP client with `https://www.canada.ca` as the base URL. Use this for any requests not covered by the methods above. No URL transformation is applied. Response bodies with a `application/json` content type are automatically parsed.

```js
const response = await ca.request('/en/sr/srb/srvs/t-srvc-eng.html');
```

All methods return the same response shape:

```json
{
  "data": "...",
  "status": 200,
  "statusText": "OK",
  "headers": {
    "content-type": "text/html"
  }
}
```

---

([English](#canada-api))

# canada-api

[![NPM Version](https://img.shields.io/npm/v/canada-api?branch=main)](https://www.npmjs.com/package/canada-api) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dnd-mdn/canada-api/blob/main/LICENSE.md)

API multiplateforme pour récupérer des données publiques de [canada.ca](https://www.canada.ca).

## Navigateur

```html
<script src="https://cdn.jsdelivr.net/npm/canada-api@5.1.2"></script>
```

## Node 18+

### Installation

```shell
npm install canada-api
```

### Utilisation

```js
import ca from 'canada-api'
```

## API

### `ca.normalize(url)`

- `url` {string|URL} - URL complète ou chemin relatif (p. ex. `'/fr/page'` ou `'https://www.canada.ca/fr/page'`)
- Retourne: {URL} Objet URL normalisé avec un chemin nettoyé

Valide et normalise une URL de canada.ca. Supprime le préfixe `/content/canadasite`, les extensions de fichier et les barres obliques finales.

Lève {TypeError} si `url` n'est pas une chaîne ou un objet URL.
Lève {Error} si l'URL n'est pas sur canada.ca ou si le chemin ne commence pas par `/en/` ou `/fr/`.

### `ca.children(url)`

- `url` {string|URL} - URL absolue ou relative
- Retourne: {Promise} Résout avec une réponse dont `data` est un tableau d'entrées du plan de site

Récupère et analyse le plan de site de la page donnée, retournant ses pages enfants. Les entrées sans élément `<loc>` sont ignorées.

### `ca.content(url)`

- `url` {string|URL} - URL absolue ou relative
- Retourne: {Promise} Résout avec une réponse dont `data` est la chaîne HTML brute

Récupère le contenu HTML de la page.

### `ca.meta(url)`

- `url` {string|URL} - URL absolue ou relative
- Retourne: {Promise} Résout avec une réponse dont `data` est un objet de métadonnées formaté

Récupère les métadonnées JCR de la page donnée. Les transformations suivantes sont appliquées :

- Les valeurs `"true"` / `"false"` sont converties en booléens
- Les propriétés `@TypeHint` sont supprimées
- Les tableaux vides sont supprimés
- Les chaînes de date sont converties en ISO 8601
- Les clés sont triées alphabétiquement
- Un champ `peer` normalisé est ajouté lorsque `gcAltLanguagePeer` est présent

### `ca.request`

- `url` {string|URL} - URL absolue ou relative
- `options` {RequestInit} - Options fetch optionnelles
- Retourne: {Promise} Résout avec un objet réponse

Client HTTP brut avec `https://www.canada.ca` comme URL de base. Utilisez-le pour toute requête non couverte par les méthodes ci-dessus. Aucune transformation d'URL n'est appliquée. Les corps de réponse avec un type de contenu `application/json` sont automatiquement analysés.

```js
const response = await ca.request('/fr/sr/srb/srvs/t-srvc-fra.html');
```

Toutes les méthodes retournent la même structure de réponse :

```json
{
  "data": "...",
  "status": 200,
  "statusText": "OK",
  "headers": {
    "content-type": "text/html"
  }
}
```
