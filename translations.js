/**
 * Pure translation-pack model for Brain Garden.
 *
 * A "pack" is a self-contained translation for one language:
 * {
 *   code: 'sw',
 *   name: 'Swahili',
 *   flag: '🇰🇪',
 *   tryAgain: 'jaribu-tena',
 *   encouragement: ['umefanya-vizuri', 'safi-sana', ...],
 *   messages: {
 *     garden, memory, patterns, logic, subtitle, memoryTitle, memorySub,
 *     patternTitle, patternSub, logicTitle, logicSub, level, pairsFound,
 *     newGame, newPattern, newPuzzle, zoneFlowers, zoneTrees, zoneMystery,
 *     emptyFlowers, emptyTrees, lockedMystery, plantedFlower, plantedTree,
 *     plantedStar, congrats, instrMemory, instrPattern, instrLogic,
 *     flowerName, treeName, starName, patternType
 *   }
 * }
 *
 * Built-in packs ship inside app.js. User packs are stored in localStorage
 * and either override a built-in pack or add a brand new language (any
 * number of languages is supported). This module is DOM-free so it can run
 * in Node for tests.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Translations = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const STORAGE_KEY = 'brainGarden_translationPacks_v1';

    const MESSAGE_KEYS = [
        'garden', 'memory', 'patterns', 'logic', 'subtitle',
        'memoryTitle', 'memorySub', 'patternTitle', 'patternSub',
        'logicTitle', 'logicSub', 'level', 'pairsFound', 'newGame',
        'newPattern', 'newPuzzle', 'zoneFlowers', 'zoneTrees', 'zoneMystery',
        'emptyFlowers', 'emptyTrees', 'lockedMystery', 'plantedFlower',
        'plantedTree', 'plantedStar', 'congrats', 'instrMemory',
        'instrPattern', 'instrLogic', 'flowerName', 'treeName', 'starName',
        'patternType'
    ];

    const CODE_PATTERN = /^[a-z]{2,8}([-_][a-z0-9]{2,8})*$/;

    let storage = (typeof localStorage !== 'undefined') ? localStorage : null;

    function own(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    }

    function isNonEmptyString(value) {
        return typeof value === 'string' && value.trim() !== '';
    }

    /**
     * Deep merge of two pack values. Non-empty strings and populated arrays
     * in the override win; empty strings, empty arrays and undefined values
     * fall back to the base so partial packs degrade gracefully.
     * @param {*} base - Base value
     * @param {*} override - Override value
     * @returns {*} The merged value
     */
    function mergeValue(base, override) {
        if (override === undefined || override === null) return base;
        if (typeof override === 'string') return override.trim() !== '' ? override : base;
        if (Array.isArray(override)) return override.length > 0 ? override.slice() : base;
        if (typeof override === 'object' && typeof base === 'object') {
            const result = {};
            const allKeys = new Set([...Object.keys(base), ...Object.keys(override)]);
            allKeys.forEach((key) => {
                result[key] = mergeValue(base[key], override[key]);
            });
            return result;
        }
        return override;
    }

    /**
     * Sets the storage provider used to persist user packs. Browser code
     * leaves this as localStorage; tests inject a fake.
     * @param {object|null} provider - Storage-like object with getItem/setItem
     */
    function setStorage(provider) {
        storage = provider || null;
    }

    function loadPacks() {
        if (!storage) return {};
        try {
            const raw = storage.getItem(STORAGE_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function persistPacks(packs) {
        if (!storage) return;
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(packs));
        } catch (error) {
            // Storage full or unavailable; keep running with in-memory packs.
        }
    }

    /**
     * Stores or replaces the pack for one language.
     * @param {string} code - Language code
     * @param {object} pack - Pack data
     */
    function savePack(code, pack) {
        const packs = loadPacks();
        packs[code] = pack;
        persistPacks(packs);
    }

    /**
     * Removes the user's pack for one language.
     * @param {string} code - Language code
     */
    function removePack(code) {
        const packs = loadPacks();
        delete packs[code];
        persistPacks(packs);
    }

    /**
     * Builds a blank pack for a new language. Empty strings let the merge
     * fall back to English until the user fills in their translations.
     * @param {string} code - Language code
     * @param {string} name - Language name
     * @returns {object} A blank pack with every known key
     */
    function blankPack(code, name) {
        const messages = {};

        MESSAGE_KEYS.forEach((key) => {
            messages[key] = '';
        });

        return {
            code: code || '',
            name: name || '',
            flag: '',
            tryAgain: '',
            encouragement: [],
            messages
        };
    }

    /**
     * Merges stored user packs over a set of built-in languages. Brand-new
     * custom languages inherit English as a base so they are immediately
     * usable while the user fills in their own words.
     * @param {object} baseLanguages - Built-in language configs
     * @returns {object} Effective languages keyed by code
     */
    function getLanguages(baseLanguages) {
        const packs = loadPacks();
        const languages = {};

        Object.keys(baseLanguages).forEach((code) => {
            languages[code] = mergeValue(baseLanguages[code], packs[code]);
        });

        Object.keys(packs).forEach((code) => {
            const pack = packs[code];
            if (!own(languages, code) && isNonEmptyString(pack.name)) {
                languages[code] = mergeValue(baseLanguages.en, pack);
            }
        });

        return languages;
    }

    /**
     * Validates a language code.
     * @param {string} code - Lowercase code like 'en', 'pt', 'zh-hans'
     * @returns {boolean} True when the code looks valid
     */
    function isValidCode(code) {
        return typeof code === 'string' && CODE_PATTERN.test(code.trim());
    }

    /**
     * Validates a pack and returns a list of human-readable problems. Only
     * code and name are required; every other field may stay empty and falls
     * back to English, so any new language can be created quickly.
     * @param {object} pack - Pack to validate (must have code and name)
     * @returns {string[]} List of issues; empty when the pack is valid
     */
    function validatePack(pack) {
        const issues = [];

        if (!isValidCode(pack.code)) {
            issues.push(`Invalid language code: "${pack.code}"`);
        }
        if (!isNonEmptyString(pack.name)) {
            issues.push('Language name is required.');
        }

        return issues;
    }

    /**
     * Reads the previously loaded user packs (for debugging/tests).
     * @returns {object} Pack map keyed by language code
     */
    function getStoredPacks() {
        return loadPacks();
    }

    return {
        STORAGE_KEY,
        MESSAGE_KEYS,
        setStorage,
        savePack,
        removePack,
        blankPack,
        getLanguages,
        isValidCode,
        validatePack,
        getStoredPacks
    };
});