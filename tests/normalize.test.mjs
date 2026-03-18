import { test, describe } from 'node:test';
import assert from 'node:assert';
import normalize from '../src/normalize.mjs';

describe('normalize', () => {
    describe('valid inputs', () => {
        test('accepts full URL', () => {
            const url = normalize('https://www.canada.ca/en/department-national-defence/maple-leaf.html');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('accepts relative path', () => {
            const url = normalize('/en/department-national-defence/maple-leaf.html');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('accepts URL object', () => {
            const urlObj = new URL('https://www.canada.ca/en/department-national-defence/maple-leaf.html');
            const result = normalize(urlObj);
            assert.strictEqual(result.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('accepts French path', () => {
            const url = normalize('https://www.canada.ca/fr/ministere-defense-nationale/feuille-erable.html');
            assert.strictEqual(url.pathname, '/fr/ministere-defense-nationale/feuille-erable');
        });

        test('accepts query parameters and fragments', () => {
            const url = normalize('https://www.canada.ca/en/department-national-defence/maple-leaf.html?version=1#section2');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });
    });

    describe('path normalization', () => {
        test('removes /content/canadasite prefix', () => {
            const url = normalize('https://www.canada.ca/content/canadasite/en/department-national-defence/maple-leaf.html');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('removes trailing slashes', () => {
            const url = normalize('https://www.canada.ca/en/department-national-defence/maple-leaf/');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('removes file extensions', () => {
            const url = normalize('https://www.canada.ca/en/department-national-defence/maple-leaf.html');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('leaves valid paths unchanged', () => {
            const url = normalize('/en/department-national-defence/maple-leaf');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });
    });

    describe('invalid inputs', () => {
        test('throws on non-canada.ca domains', () => {
            assert.throws(() => {
                normalize('https://google.com/en/department-national-defence/maple-leaf');
            }, /URL must start with/);
        });

        test('throws on invalid path (not /en/ or /fr/)', () => {
            assert.throws(() => {
                normalize('/de/department-national-defence/maple-leaf');
            }, /Invalid path/);
        });

        test('throws on non-string or URL types', () => {
            assert.throws(() => {
                normalize(123);
            }, /string or URL object expected/);
        });

        test('throws on root language path', () => {
            assert.throws(() => {
                normalize('/fr/');
            }, /Invalid path/);
        });

        test('throws on null input', () => {
            assert.throws(() => {
                normalize(null);
            }, /string or URL object expected/);
        });
    });
});


