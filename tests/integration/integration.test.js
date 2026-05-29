import { test, describe } from 'node:test';
import assert from 'node:assert';
import ca from '../../src/index.js';

const URL = '/en/department-national-defence/maple-leaf';
const ASSET_URL = 'https://www.canada.ca/content/dam/dnd-mdn/documents/json/maple-en.json';

describe('integration', () => {
    test('children returns array of sitemap entries', async () => {
        const res = await ca.children(URL);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.ok(Array.isArray(res.data));
        assert.ok(res.data.length > 0);
        assert.ok(typeof res.data[0].path === 'string');
        assert.ok(res.data[0].path.startsWith('/en/') || res.data[0].path.startsWith('/fr/'));
    });

    test('content returns html string', async () => {
        const res = await ca.content(URL);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.strictEqual(typeof res.data, 'string');
        assert.ok(res.data.toLowerCase().includes('<!doctype html>'));
    });

    test('content returns dam asset json data', async () => {
        const res = await ca.content(ASSET_URL);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.strictEqual(typeof res.data, 'object');
        assert.ok(Array.isArray(res.data.data));
        assert.ok(res.data.data.length > 0);
    });

    test('meta returns formatted metadata object', async () => {
        const res = await ca.meta(URL);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.strictEqual(typeof res.data, 'object');
        assert.ok(!Array.isArray(res.data));
    });

    test('meta returns dam asset json data', async () => {
        const res = await ca.meta(ASSET_URL);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.strictEqual(typeof res.data, 'object');
    });

    test('request returns raw response', async () => {
        const res = await ca.request(URL + '.html');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.strictEqual(typeof res.data, 'string');
        assert.ok(res.data.length > 0);
    });

    test('request non existent page throws error with status and url', async () => {
        try {
            await ca.request('/en/this-page-does-not-exist.html');
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.ok(error.message.includes('404'));
            assert.ok(error.url.startsWith('https://www.canada.ca/'));
        }
    });

    test('request throws with url set on aborted signal', async () => {
        try {
            await ca.request(URL + '.html', {
                signal: AbortSignal.abort()
            });
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.strictEqual(error.name, 'AbortError');
            assert.ok(error.url.startsWith('https://www.canada.ca/'));
        }
    });

    test('request throws with url set on redirect error', async () => {
        try {
            // canada.ca root redirects to /en/index.html
            await ca.request('https://www.canada.ca/en/index.html', {
                redirect: 'error'
            });
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.strictEqual(typeof error.message, 'string');
            assert.strictEqual(typeof error.url, 'string');
            assert.ok(error.url.startsWith('https://www.canada.ca/'));
        }
    });
});
