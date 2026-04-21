import { test, describe } from 'node:test';
import assert from 'node:assert';
import ca from '../../src/index.js';

const URL = '/en/department-national-defence/maple-leaf';

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

    test('meta returns formatted metadata object', async () => {
        const res = await ca.meta(URL);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.strictEqual(typeof res.data, 'object');
        assert.ok(!Array.isArray(res.data));
    });

    test('request returns raw response', async () => {
        const res = await ca.request(URL + '.html');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.statusText, 'string');
        assert.strictEqual(typeof res.headers, 'object');
        assert.strictEqual(typeof res.data, 'string');
        assert.ok(res.data.length > 0);
    });

    test('request non existent page throws error', async () => {
        try {
            await ca.request('/en/this-page-does-not-exist.html');
            assert.fail('Expected error was not thrown');
        } catch (error) {
            assert.strictEqual(error.status, 404);
            assert.strictEqual(typeof error.message, 'string');
        }
    });
});
