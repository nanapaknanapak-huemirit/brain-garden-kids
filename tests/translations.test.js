'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const Translations = require('../translations.js');

function fakeStorage() {
    const data = {};
    return {
        getItem: (key) => (key in data ? data[key] : null),
        setItem: (key, value) => { data[key] = String(value); },
        removeItem: (key) => { delete data[key]; },
        _data: data
    };
}

function baseLanguages() {
    return {
        en: {
            name: 'English',
            flag: '🇺🇸',
            tryAgain: 'try again',
            encouragement: ['great-job'],
            messages: { garden: 'Garden', plantedFlower: 'you planted a flower' }
        },
        es: {
            name: 'Espanol',
            flag: '🇪🇸',
            tryAgain: 'intenta de nuevo',
            encouragement: ['muy-bien'],
            messages: { garden: 'Jardin', plantedFlower: 'has plantado una flor' }
        }
    };
}

test('blankPack returns a pack with every key, all empty', () => {
    const pack = Translations.blankPack('sw', 'Swahili');
    assert.equal(pack.code, 'sw');
    assert.equal(pack.name, 'Swahili');
    assert.equal(pack.flag, '');
    assert.equal(pack.tryAgain, '');
    assert.equal(Object.keys(pack.messages).length, Translations.MESSAGE_KEYS.length);
    assert.deepEqual(pack.encouragement, []);
    assert.ok(Object.values(pack.messages).every(v => v === ''));
});

test('getLanguages returns base languages untouched when storage is empty', () => {
    Translations.setStorage(fakeStorage());
    const result = Translations.getLanguages(baseLanguages());
    assert.equal(result.en.messages.garden, 'Garden');
    assert.equal(result.es.messages.plantedFlower, 'has plantado una flor');
    assert.deepEqual(Object.keys(result), ['en', 'es']);
});

test('partial override falls back to base values', () => {
    const storage = fakeStorage();
    Translations.setStorage(storage);
    const base = baseLanguages();
    const pack = Translations.blankPack('es', 'Espanol');
    pack.messages.garden = 'MI JARDIN';
    Translations.savePack('es', pack);

    const result = Translations.getLanguages(base);
    assert.equal(result.es.messages.garden, 'MI JARDIN');
    assert.equal(result.es.messages.plantedFlower, 'has plantado una flor');
    assert.equal(result.es.tryAgain, 'intenta de nuevo');
    assert.equal(result.es.name, 'Espanol');
});

test('new language appears and inherits English defaults for empty fields', () => {
    const storage = fakeStorage();
    Translations.setStorage(storage);

    const pack = Translations.blankPack('sw', 'Swahili');
    pack.messages.garden = 'Bustani';
    Translations.savePack('sw', pack);

    const result = Translations.getLanguages(baseLanguages());
    assert.ok(result.sw);
    assert.equal(result.sw.name, 'Swahili');
    assert.equal(result.sw.messages.garden, 'Bustani');
    // Blank string falls back to English base
    assert.equal(result.sw.messages.plantedFlower, 'you planted a flower');
    assert.equal(result.sw.tryAgain, 'try again');
});

test('new language without a name is not added', () => {
    const storage = fakeStorage();
    Translations.setStorage(storage);

    Translations.savePack('xx', { code: 'xx', name: '' });

    const result = Translations.getLanguages(baseLanguages());
    assert.ok(!result.xx);
});

test('removePack restores the built-in language', () => {
    const storage = fakeStorage();
    Translations.setStorage(storage);

    const pack = Translations.blankPack('es', 'Espanol');
    pack.messages.garden = 'MI JARDIN';
    Translations.savePack('es', pack);
    Translations.removePack('es');

    const result = Translations.getLanguages(baseLanguages());
    assert.equal(result.es.messages.garden, 'Jardin');
});

test('isValidCode accepts and rejects appropriately', () => {
    const okay = ['en', 'es', 'zh-hans', 'pt-br', 'yue_hk_test'];
    const bad = ['', 'EN', 'e', 'en-US!', '123', 'x y'];
    okay.forEach(c => assert.ok(Translations.isValidCode(c), `expected valid: ${c}`));
    bad.forEach(c => assert.ok(!Translations.isValidCode(c), `expected invalid: ${c}`));
});

test('validatePack only requires a valid code and a name', () => {
    const issues = Translations.validatePack({ code: 'en', name: '' });
    assert.ok(issues.some(i => i.includes('Language name')));

    const full = { code: 'sw', name: 'Swahili', messages: {}, encouragement: [] };
    assert.deepEqual(Translations.validatePack(full), []);
});

test('validatePack rejects an invalid language code', () => {
    const issues = Translations.validatePack({ code: 'EN-US', name: 'X' });
    assert.ok(issues.some(i => i.includes('Invalid language code')));
});

test('getStoredPacks reflects saves and removals', () => {
    const storage = fakeStorage();
    Translations.setStorage(storage);
    assert.deepEqual(Translations.getStoredPacks(), {});

    Translations.savePack('sw', Translations.blankPack('sw', 'Swahili'));
    assert.ok(Translations.getStoredPacks().sw);

    Translations.removePack('sw');
    assert.deepEqual(Translations.getStoredPacks(), {});
});