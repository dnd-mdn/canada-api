import { test, describe } from 'node:test';
import assert from 'node:assert';
import { formatMeta } from '../src/meta.mjs';

describe('formatMeta', () => {
   
    test('converts string "true" and "false" to booleans', () => {
        const data = {
            published: 'true',
            archived: 'false',
        };
        const result = formatMeta(data);
        assert.deepStrictEqual(result, {
            archived: false,
            published: true,
        });
    });
  
    test('removes @TypeHint properties while preserving values', () => {
        const data = {
            title: 'Page Title',
            'title@TypeHint': 'String',
            author: 'Jane Doe',
            'author@TypeHint': 'String',
            description: 'Page description'
        };
        const result = formatMeta(data);
        assert.deepStrictEqual(result, {
            author: 'Jane Doe',
            description: 'Page description',
            title: 'Page Title'
        });
    });

    test('removes empty arrays but preserves non-empty ones', () => {
        const data = {
            title: 'Title',
            tags: ['tag1', 'tag2'],
            categories: [],
            keywords: []
        };
        const result = formatMeta(data);
        assert.deepStrictEqual(result, {
            tags: ['tag1', 'tag2'],
            title: 'Title'
        });
    });
    
    test('converts RFC1123 to ISO8601 format', () => {
        const data = {
            publishDate: 'Wed Nov 20 2019 13:17:13 GMT-0500',
            updateDate: 'Sat Nov 20 2021 13:17:43 GMT-0500'
        };
        const result = formatMeta(data);
        assert.deepStrictEqual(result, {
            publishDate: '2019-11-20T18:17:13.000Z',
            updateDate: '2021-11-20T18:17:43.000Z'
        });
    });

    test('preserves non-date strings', () => {
        const data = {
            title: 'Not a date',
        };
        const result = formatMeta(data);
        assert.deepStrictEqual(result, {
            title: 'Not a date'
        });
    });
   
    test('returns alphabetically sorted keys', () => {
        const data = {
            zebra: 'z',
            empty: [],
            apple: 'a',
            banana: 'b'
        };
        const result = formatMeta(data);
        const keys = Object.keys(result);
        assert.deepStrictEqual(keys, ['apple', 'banana', 'zebra']);
    });
  
    test('adds normalized peer field', () => {
        const data = {
            gcAltLanguagePeer: '/content/canadasite/fr/ministere-defense-nationale/feuille-derable.html'
        };
        const result = formatMeta(data);
        assert.deepStrictEqual(result, {
            gcAltLanguagePeer: '/content/canadasite/fr/ministere-defense-nationale/feuille-derable.html',
            peer: '/fr/ministere-defense-nationale/feuille-derable'
        });
    });

});
