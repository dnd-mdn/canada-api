import { test, describe } from 'node:test';
import assert from 'node:assert';
import { parseSitemap } from '../src/children.mjs';

describe('parseSitemap', () => {
    describe('valid inputs', () => {
        test('parses single entry', () => {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <loc>https://www.canada.ca/en/department-national-defence/maple-leaf.html</loc>
                    <lastmod>2026-02-19T09:56:14.005-05:00</lastmod>
                </url>
            </urlset>`;
            const result = parseSitemap(xml);
            assert.deepStrictEqual(result, [
                {
                    path: '/en/department-national-defence/maple-leaf',
                    lastmod: '2026-02-19T14:56:14.005Z'
                }
            ]);
        });

        test('parses multiple entries', () => {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <loc>https://www.canada.ca/en/page-one.html</loc>
                    <lastmod>2024-04-09T15:40:22.032-04:00</lastmod>
                </url>
                <url>
                    <loc>https://www.canada.ca/en/page-two.html</loc>
                    <lastmod>2026-03-02</lastmod>
                </url>
            </urlset>`;
            const result = parseSitemap(xml);
            assert.deepStrictEqual(result, [
                {
                    path: '/en/page-one',
                    lastmod: '2024-04-09T19:40:22.032Z'
                },
                {
                    path: '/en/page-two',
                    lastmod: '2026-03-02T00:00:00.000Z'
                }
            ]);
        });
    });

    describe('edge cases', () => {
        test('handles empty urlset', () => {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            </urlset>`;
            const result = parseSitemap(xml);
            assert.deepStrictEqual(result, []);
        });

        test('handles missing lastmod', () => {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <loc>https://www.canada.ca/en/page-one.html</loc>
                </url>
            </urlset>`;
            const result = parseSitemap(xml);
            assert.deepStrictEqual(result, [
                {
                    path: '/en/page-one',
                    lastmod: null
                }
            ]);
        });

        test('handles different element order', () => {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <lastmod>2024-04-09T15:40:22.032-04:00</lastmod>
                    <loc>https://www.canada.ca/en/page-one.html</loc>
                </url>
            </urlset>`;
            const result = parseSitemap(xml);
            assert.deepStrictEqual(result, [
                {
                    path: '/en/page-one',
                    lastmod: '2024-04-09T19:40:22.032Z'
                }
            ]);
        });

        test('ignores entries missing loc element', () => {
            const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <lastmod>2024-04-09T15:40:22.032-04:00</lastmod>
                </url>
            </urlset>`;
            const result = parseSitemap(xml);
            assert.deepStrictEqual(result, []);
        });
    });

    describe('invalid inputs', () => {
        test('throws on invalid XML', () => {
            const xml = `<urlset><url><loc>https://www.canada.ca/en/page-one.html</loc></urlset>`;
            assert.throws(() => {
                parseSitemap(xml);
            }, /Expected closing tag/);
        });
    });
});
