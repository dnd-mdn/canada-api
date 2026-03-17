import { test, describe } from 'node:test';
import assert from 'node:assert';
import normalize from '../src/normalize.mjs';

describe('normalize', () => {
    describe('valid inputs', () => {
        test('accepts valid canada.ca URLs', () => {
            const url = normalize('https://www.canada.ca/en/department-national-defence/maple-leaf.html');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('accepts relative paths', () => {
            const url = normalize('/en/department-national-defence/maple-leaf.html');
            assert.strictEqual(url.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('accepts URL objects', () => {
            const urlObj = new URL('https://www.canada.ca/en/department-national-defence/maple-leaf.html');
            const result = normalize(urlObj);
            assert.strictEqual(result.pathname, '/en/department-national-defence/maple-leaf');
        });

        test('accepts French paths', () => {
            const url = normalize('https://www.canada.ca/fr/ministere-defense-nationale/feuille-erable.html');
            assert.strictEqual(url.pathname, '/fr/ministere-defense-nationale/feuille-erable');
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
    });

    describe('error handling', () => {
        test('rejects non-canada.ca domains', () => {
            assert.throws(() => {
                normalize('https://google.com/en/department-national-defence/maple-leaf');
            }, /URL must start with/);
        });

        test('rejects invalid paths (not /en/ or /fr/)', () => {
            assert.throws(() => {
                normalize('/de/department-national-defence/maple-leaf');
            }, /Invalid path/);
        });

        test('rejects non-string or URL types', () => {
            assert.throws(() => {
                normalize(123);
            }, /string or URL object expected/);
        });
    });
});


