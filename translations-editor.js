/**
 * In-app translation editor for Brain Garden.
 *
 * Opens a modal that lets the user create, edit, preview and delete
 * translation packs for any number of languages. All persistence happens
 * through the Translations model (localStorage). Editing a built-in language
 * stores a full override pack; a brand-new language starts blank and falls
 * back to English until its own words are filled in.
 *
 * Editor chrome labels are developer/tooling strings kept in one English
 * config object (EDITOR_LABELS); the kid-facing interface is fully
 * translatable through the packs themselves.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./translations'));
    } else {
        root.TranslationsEditor = factory(root.Translations);
    }
})(typeof self !== 'undefined' ? self : this, function (Translations) {
    'use strict';

    var EDITOR_LABELS = {
        title: 'Translations',
        language: 'Language',
        newLanguage: '＋ New language',
        resetToBase: 'Reset to base',
        deleteLanguage: 'Delete language',
        save: '💾 Save',
        close: '✕ Close',
        listen: '🔊 Listen',
        code: 'Code',
        name: 'Name',
        flag: 'Flag',
        meta: 'Language',
        messages: 'Messages',
        encouragement: 'Encouragement phrases',
        addPhrase: '＋ Add phrase',
        removePhrase: '✕',
        saved: 'Saved ✓',
        deleted: 'Deleted',
        noPacks: 'No custom languages yet.',
        custom: '(custom)',
        issues: 'Fix before saving:',
        confirmDelete: 'Delete this language? Any custom translations will be lost.'
    };

    var MESSAGE_LABELS = {
        garden: 'Garden tab label',
        memory: 'Memory tab label',
        patterns: 'Patterns tab label',
        logic: 'Logic tab label',
        subtitle: 'Tagline',
        memoryTitle: 'Memory game title',
        memorySub: 'Memory game subtitle',
        patternTitle: 'Pattern game title',
        patternSub: 'Pattern game subtitle',
        logicTitle: 'Logic game title',
        logicSub: 'Logic game subtitle',
        level: 'Level label',
        pairsFound: 'Pairs-found label',
        newGame: 'New game button',
        newPattern: 'New pattern button',
        newPuzzle: 'New puzzle button',
        zoneFlowers: 'Flower garden zone label',
        zoneTrees: 'Forest zone label',
        zoneMystery: 'Mystery zone label',
        emptyFlowers: 'Empty flower-zone hint',
        emptyTrees: 'Empty forest-zone hint',
        lockedMystery: 'Locked mystery-zone hint',
        plantedFlower: 'Planted-a-flower message',
        plantedTree: 'Planted-a-tree message',
        plantedStar: 'Planted-a-star message',
        congrats: 'Finished-garden message',
        instrMemory: 'Memory instruction',
        instrPattern: 'Pattern instruction',
        instrLogic: 'Logic instruction',
        flowerName: 'Flower word',
        treeName: 'Tree word',
        starName: 'Star word',
        patternType: 'Pattern type word'
    };

    var config = null;
    var modalEl = null;
    var langSelectEl = null;
    var bodyEl = null;
    var statusEl = null;
    var actionBarEl = null;

    var currentCode = null;
    var isNewLanguage = false;
    var working = null;

    function own(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function getBase() {
        return config.getBaseLanguages ? config.getBaseLanguages() : {};
    }

    function isBuiltin(code) {
        return own(getBase(), code);
    }

    function getLanguages() {
        return Translations.getLanguages(getBase());
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function speak(text, code) {
        if (typeof speechSynthesis === 'undefined' || !text) return;
        speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = code || currentCode || 'en';
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
    }

    function setStatus(text, isError) {
        if (!statusEl) return;
        statusEl.textContent = text;
        statusEl.style.color = isError ? '#c0392b' : '#27ae60';
    }

    // ---------------- DOM builders ----------------

    function textInputRow(section, inputLabel, value, onInput, previewText, code) {
        var row = el('div', 'translations-row');
        row.appendChild(el('div', 'translations-cell-label', inputLabel));

        var input = el('input', 'translations-input');
        input.type = 'text';
        input.value = value || '';
        input.addEventListener('input', function () {
            onInput(input.value);
        });
        row.appendChild(el('div', 'translations-cell-input')).appendChild(input);

        var cell = el('div', 'translations-cell-btn');
        var listen = el('button', 'translations-btn translations-listen', EDITOR_LABELS.listen);
        listen.type = 'button';
        listen.title = EDITOR_LABELS.listen;
        listen.addEventListener('click', function () {
            speak(previewText !== undefined ? previewText : input.value, code);
        });
        cell.appendChild(listen);
        row.appendChild(cell);

        section.appendChild(row);
        return row;
    }

    function section(title) {
        var box = el('section', 'translations-section');
        box.appendChild(el('h3', 'translations-section-title', title));
        bodyEl.appendChild(box);
        return box;
    }

    function renderMeta(sec) {
        var meta = sec.appendChild(el('div', 'translations-meta'));
        if (!isNewLanguage) {
            meta.appendChild(el('span', 'translations-meta-item', 'Code: ' + working.code));
            meta.appendChild(el('span', 'translations-meta-item', isBuiltin(working.code) ? 'built-in' : EDITOR_LABELS.custom));
        } else {
            meta.appendChild(el('span', 'translations-meta-item', 'Code: new'));
        }
    }

    function buildMessageRows() {
        var sec = section(EDITOR_LABELS.messages);
        Translations.MESSAGE_KEYS.forEach(function (key) {
            textInputRow(sec, MESSAGE_LABELS[key] || key, working.messages[key], function (value) {
                working.messages[key] = value;
            }, working.messages[key], currentCode);
        });
    }

    function encouragementRow(sec, index, code) {
        var row = el('div', 'translations-row');
        row.appendChild(el('div', 'translations-cell-label', String(index + 1)));

        var input = el('input', 'translations-input');
        input.type = 'text';
        input.value = working.encouragement[index] || '';
        input.addEventListener('input', function () {
            working.encouragement[index] = input.value;
        });
        row.appendChild(el('div', 'translations-cell-input')).appendChild(input);

        var cell = el('div', 'translations-cell-btn');
        var listen = el('button', 'translations-btn translations-listen', EDITOR_LABELS.listen);
        listen.type = 'button';
        listen.addEventListener('click', function () {
            speak(input.value, code);
        });
        cell.appendChild(listen);

        var remove = el('button', 'translations-btn translations-remove', EDITOR_LABELS.removePhrase);
        remove.type = 'button';
        remove.title = EDITOR_LABELS.removePhrase;
        remove.addEventListener('click', function () {
            working.encouragement.splice(index, 1);
            rebuildEncouragement();
        });
        cell.appendChild(remove);

        row.appendChild(cell);
        sec.appendChild(row);
    }

    function rebuildEncouragement() {
        var sec = bodyEl.querySelector('.translations-section-encouragement');
        if (!sec) return;
        sec.innerHTML = '';
        sec.appendChild(el('h3', 'translations-section-title', EDITOR_LABELS.encouragement));

        working.encouragement.forEach(function (_, index) {
            encouragementRow(sec, index, currentCode);
        });

        var add = el('button', 'translations-btn', EDITOR_LABELS.addPhrase);
        add.type = 'button';
        add.addEventListener('click', function () {
            working.encouragement.push('');
            rebuildEncouragement();
        });
        var cell = el('div', 'translations-row');
        cell.appendChild(el('div', 'translations-cell-label'));
        var inputCell = el('div', 'translations-cell-input');
        inputCell.appendChild(add);
        cell.appendChild(inputCell);
        cell.appendChild(el('div', 'translations-cell-btn'));
        sec.appendChild(cell);
    }

    function buildEncouragement() {
        if (!working.encouragement || !Array.isArray(working.encouragement)) {
            working.encouragement = [];
        }
        var sec = el('section', 'translations-section translations-section-encouragement');
        bodyEl.appendChild(sec);
        sec.innerHTML = '';
        sec.appendChild(el('h3', 'translations-section-title', EDITOR_LABELS.encouragement));

        working.encouragement.forEach(function (_, index) {
            encouragementRow(sec, index, currentCode);
        });

        var add = el('button', 'translations-btn', EDITOR_LABELS.addPhrase);
        add.type = 'button';
        add.addEventListener('click', function () {
            working.encouragement.push('');
            rebuildEncouragement();
        });
        var cell = el('div', 'translations-row');
        cell.appendChild(el('div', 'translations-cell-label'));
        var inputCell = el('div', 'translations-cell-input');
        inputCell.appendChild(add);
        cell.appendChild(inputCell);
        cell.appendChild(el('div', 'translations-cell-btn'));
        sec.appendChild(cell);
    }

    function reloadWorking() {
        var languages = getLanguages();
        if (!own(languages, currentCode)) {
            currentCode = 'en';
            isNewLanguage = false;
        }
        working = clone(languages[currentCode]);
        if (!working.encouragement || !Array.isArray(working.encouragement)) {
            working.encouragement = [];
        }
    }

    function refreshSelect() {
        langSelectEl.innerHTML = '';
        var languages = getLanguages();
        Object.keys(languages).forEach(function (code) {
            var option = el('option', null, languages[code].name + (isBuiltin(code) ? '' : ' ' + EDITOR_LABELS.custom));
            option.value = code;
            langSelectEl.appendChild(option);
        });
        if (own(languages, currentCode)) {
            langSelectEl.value = currentCode;
        }
    }

    function selectLanguage(code, isNew) {
        isNewLanguage = !!isNew;
        currentCode = code;
        if (isNewLanguage) {
            working = Translations.blankPack('', '');
        } else {
            reloadWorking();
        }
        renderBody();
        refreshSelect();
        setStatus('');
    }

    function renderBody() {
        bodyEl.innerHTML = '';

        if (!isNewLanguage) {
            var metaBox = section(EDITOR_LABELS.meta);
            renderMeta(metaBox);
        } else {
            var newMeta = section(EDITOR_LABELS.meta);
            textInputRow(newMeta, EDITOR_LABELS.code, working.code, function (value) {
                working.code = value;
            }, working.code);
            textInputRow(newMeta, EDITOR_LABELS.name, working.name, function (value) {
                working.name = value;
            }, working.name);
            textInputRow(newMeta, EDITOR_LABELS.flag, working.flag, function (value) {
                working.flag = value;
            }, working.flag, working.code);
        }

        if (!isNewLanguage) {
            var editMeta = section(EDITOR_LABELS.meta);
            textInputRow(editMeta, EDITOR_LABELS.name, working.name, function (value) {
                working.name = value;
            }, working.name);
            textInputRow(editMeta, EDITOR_LABELS.flag, working.flag, function (value) {
                working.flag = value;
            }, working.flag, currentCode);
        }

        buildMessageRows();
        buildEncouragement();

        actionBarEl.style.display = '';
        statusEl.textContent = '';
    }

    function saveHandler() {
        var issues = Translations.validatePack(working);
        if (issues.length) {
            setStatus(EDITOR_LABELS.issues, true);
            return;
        }
        Translations.savePack(working.code, working);
        currentCode = working.code;
        isNewLanguage = false;
        reloadWorking();
        if (config.onChange) config.onChange();
        refreshSelect();
        renderBody();
        setStatus(EDITOR_LABELS.saved);
    }

    function resetHandler() {
        if (!currentCode || !isBuiltin(currentCode)) return;
        Translations.removePack(currentCode);
        if (config.onChange) config.onChange();
        reloadWorking();
        renderBody();
        refreshSelect();
        setStatus(EDITOR_LABELS.saved);
    }

    function deleteHandler() {
        if (!currentCode || isBuiltin(currentCode)) return;
        if (typeof window.confirm === 'function' && !window.confirm(EDITOR_LABELS.confirmDelete)) {
            return;
        }
        Translations.removePack(currentCode);
        if (config.onChange) config.onChange();
        currentCode = 'en';
        reloadWorking();
        renderBody();
        refreshSelect();
        setStatus(EDITOR_LABELS.deleted);
    }

    function newLanguageHandler() {
        selectLanguage('', true);
    }

    // ---------------- modal shell ----------------

    function buildModal() {
        modalEl = el('div', 'translations-modal-overlay hidden');
        var panel = el('div', 'translations-modal');

        var header = el('div', 'translations-header');
        header.appendChild(el('h2', 'translations-title', EDITOR_LABELS.title));

        var closeBtn = el('button', 'translations-btn translations-close', EDITOR_LABELS.close);
        closeBtn.type = 'button';
        closeBtn.addEventListener('click', close);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        var toolbar = el('div', 'translations-toolbar');
        langSelectEl = el('select', 'translations-select');
        langSelectEl.addEventListener('change', function () {
            selectLanguage(langSelectEl.value, false);
        });
        toolbar.appendChild(langSelectEl);

        var newBtn = el('button', 'translations-btn', EDITOR_LABELS.newLanguage);
        newBtn.type = 'button';
        newBtn.addEventListener('click', newLanguageHandler);
        toolbar.appendChild(newBtn);
        panel.appendChild(toolbar);

        bodyEl = el('div', 'translations-body');
        panel.appendChild(bodyEl);

        actionBarEl = el('div', 'translations-actionbar');
        var resetBtn = el('button', 'translations-btn', EDITOR_LABELS.resetToBase);
        resetBtn.type = 'button';
        resetBtn.addEventListener('click', resetHandler);
        actionBarEl.appendChild(resetBtn);

        var deleteBtn = el('button', 'translations-btn translations-delete', EDITOR_LABELS.deleteLanguage);
        deleteBtn.type = 'button';
        deleteBtn.addEventListener('click', deleteHandler);
        actionBarEl.appendChild(deleteBtn);

        var saveBtn = el('button', 'translations-btn translations-save', EDITOR_LABELS.save);
        saveBtn.type = 'button';
        saveBtn.addEventListener('click', saveHandler);
        actionBarEl.appendChild(saveBtn);

        statusEl = el('div', 'translations-status');
        actionBarEl.appendChild(statusEl);

        panel.appendChild(actionBarEl);
        modalEl.appendChild(panel);
        document.body.appendChild(modalEl);
    }

    function open() {
        if (!modalEl) buildModal();
        selectLanguage('en', false);
        modalEl.classList.remove('hidden');
    }

    function close() {
        if (modalEl) modalEl.classList.add('hidden');
        if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    }

    function init(options) {
        config = options || {};
        return {
            open: open,
            close: close
        };
    }

    return {
        init: init,
        open: open,
        close: close
    };
});