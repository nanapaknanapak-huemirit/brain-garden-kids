let totalScore = 0;
let currentTab = 'garden';
let currentLang = 'en';
let speechRate = 1.0;

let memoryLevel = 1;
let memoryPairsFound = 0;
let memoryTotalPairs = 0;
let memoryCards = [];
let memoryFlipped = [];
let memoryLocked = false;

let patternLevel = 1;
let patternLocked = false;

let logicLevel = 1;
let logicLocked = false;

let gardenState = { flowers: [], trees: [], mystery: [] };

const FLOWERS = ['🌸','🌻','🌹','🌺','🌷','🌼','💐','🪷','🏵️','🌿'];
const TREES = ['🌳','🌲','🎄','🌴','🎍','🪵','🌵','🎋','🍃','🍂'];
const MYSTERY = ['⭐','🌟','✨','💫','🔮','🪐','🌈','🦋','🐝','🐞'];
const NATURE_EMOJI = ['🌸','🌻','🌹','🌺','🌷','🌼','🌳','🌲','☀️','🌙','🦋','🐝','🐞','🐢','🌈','🍎','🍊','🍇','🍓','🥕'];

const PATTERN_TYPE_NAMES = {
    AB: 'AB', ABB: 'ABB', ABC: 'ABC', AABB: 'AABB', ABCD: 'ABCD'
};

const baseLanguages = {
    en: {
        name: 'English',
        flag: '🇺🇸',
        tryAgain: 'try again',
        encouragement: ['great-job','excellent','well-done','amazing','perfect','you-got-it','wonderful','fantastic'],
        messages: {
            garden: 'Garden', memory: 'Memory', patterns: 'Patterns', logic: 'Logic',
            subtitle: 'Solve puzzles to grow your garden!',
            memoryTitle: 'Memory Game', memorySub: 'Find matching pairs!',
            patternTitle: 'Pattern Game', patternSub: 'What comes next?',
            logicTitle: 'Logic Game', logicSub: 'Which one does not belong?',
            level: 'Level', pairsFound: 'pairs found',
            newGame: 'New Game', newPattern: 'New Pattern', newPuzzle: 'New Puzzle',
            zoneFlowers: 'Flower Garden', zoneTrees: 'Forest', zoneMystery: 'Mystery Zone',
            emptyFlowers: 'Solve memory puzzles to grow flowers!',
            emptyTrees: 'Solve pattern puzzles to grow trees!',
            lockedMystery: 'Solve logic puzzles to unlock!',
            plantedFlower: 'you planted a flower',
            plantedTree: 'you planted a tree',
            plantedStar: 'you planted a star',
            congrats: 'congratulations, you grew your garden',
            instrMemory: 'tap a card',
            instrPattern: 'what comes next',
            instrLogic: 'which one does not belong',
            flowerName: 'flower', treeName: 'tree', starName: 'star',
            patternType: 'pattern'
        }
    },
    es: {
        name: 'Espanol',
        flag: '🇪🇸',
        tryAgain: 'intenta de nuevo',
        encouragement: ['muy-bien','excelente','buen-trabajo','genial','perfecto','eres-genial','fantastico','bravo'],
        messages: {
            garden: 'Jardin', memory: 'Memoria', patterns: 'Patrones', logic: 'Logica',
            subtitle: 'Resuelve acertijos para hacer crecer tu jardin!',
            memoryTitle: 'Juego de Memoria', memorySub: 'Encuentra los pares!',
            patternTitle: 'Juego de Patrones', patternSub: 'Que viene despues?',
            logicTitle: 'Juego de Logica', logicSub: 'Cual no pertenece?',
            level: 'Nivel', pairsFound: 'pares encontrados',
            newGame: 'Nuevo Juego', newPattern: 'Nuevo Patron', newPuzzle: 'Nuevo Acertijo',
            zoneFlowers: 'Jardin de Flores', zoneTrees: 'Bosque', zoneMystery: 'Zona Misteriosa',
            emptyFlowers: 'Resuelve memoria para cultivar flores!',
            emptyTrees: 'Resuelve patrones para cultivar arboles!',
            lockedMystery: 'Resuelve logica para desbloquear!',
            plantedFlower: 'has plantado una flor',
            plantedTree: 'has plantado un arbol',
            plantedStar: 'has plantado una estrella',
            congrats: 'has hecho crecer tu jardin',
            instrMemory: 'toca una carta',
            instrPattern: 'que viene despues',
            instrLogic: 'cual no pertenece al grupo',
            flowerName: 'flor', treeName: 'arbol', starName: 'estrella',
            patternType: 'patron'
        }
    },
    de: {
        name: 'Deutsch',
        flag: '🇩🇪',
        tryAgain: 'versuche es noch einmal',
        encouragement: ['sehr-gut','ausgezeichnet','gut-gemacht','toll','perfekt','du-bist-grossartig','fantastisch','bravo'],
        messages: {
            garden: 'Garten', memory: 'Gedaechtnis', patterns: 'Muster', logic: 'Logik',
            subtitle: 'Loese Raetsel um deinen Garten wachsen zu lassen!',
            memoryTitle: 'Gedaechtnisspiel', memorySub: 'Finde die Paare!',
            patternTitle: 'Musterspiel', patternSub: 'Was kommt als naechstes?',
            logicTitle: 'Logikspiel', logicSub: 'Was gehoert nicht hin?',
            level: 'Stufe', pairsFound: 'Paare gefunden',
            newGame: 'Neues Spiel', newPattern: 'Neues Muster', newPuzzle: 'Neues Raetsel',
            zoneFlowers: 'Blumengarten', zoneTrees: 'Wald', zoneMystery: 'Mysteriumszone',
            emptyFlowers: 'Loese Gedaechtnis um Blumen zu pflanzen!',
            emptyTrees: 'Loese Muster um Baeume zu pflanzen!',
            lockedMystery: 'Loese Logik um freizuschalten!',
            plantedFlower: 'du hast eine Blume gepflanzt',
            plantedTree: 'du hast einen Baum gepflanzt',
            plantedStar: 'du hast einen Stern gepflanzt',
            congrats: 'du hast deinen Garten wachsen lassen',
            instrMemory: 'tippe auf eine Karte',
            instrPattern: 'was kommt als naechstes',
            instrLogic: 'was gehoert nicht dazu',
            flowerName: 'Blume', treeName: 'Baum', starName: 'Stern',
            patternType: 'Muster'
        }
    },
    fr: {
        name: 'Francais',
        flag: '🇫🇷',
        tryAgain: 'essaye encore',
        encouragement: ['tres-bien','excellent','bien-joue','super','parfait','tu-es-genial','fantastique','bravo'],
        messages: {
            garden: 'Jardin', memory: 'Memoire', patterns: 'Motifs', logic: 'Logique',
            subtitle: 'Resous des defis pour faire pousser ton jardin!',
            memoryTitle: 'Jeu de Memoire', memorySub: 'Trouve les paires!',
            patternTitle: 'Jeu de Motifs', patternSub: 'Que vient ensuite?',
            logicTitle: 'Jeu de Logique', logicSub: 'Lequel ne fait pas partie du groupe?',
            level: 'Niveau', pairsFound: 'paires trouvees',
            newGame: 'Nouveau Jeu', newPattern: 'Nouveau Motif', newPuzzle: 'Nouveau Defi',
            zoneFlowers: 'Jardin de Fleurs', zoneTrees: 'Foret', zoneMystery: 'Zone Mystere',
            emptyFlowers: 'Resous la memoire pour planter des fleurs!',
            emptyTrees: 'Resous les motifs pour planter des arbres!',
            lockedMystery: 'Resous la logique pour debloquer!',
            plantedFlower: 'tu as planté une fleur',
            plantedTree: 'tu as planté un arbre',
            plantedStar: 'tu as planté une étoile',
            congrats: 'tu as fait pousser ton jardin',
            instrMemory: 'touche une carte',
            instrPattern: 'quelle est la suite',
            instrLogic: 'lequel ne fait pas partie du groupe',
            flowerName: 'fleur', treeName: 'arbre', starName: 'étoile',
            patternType: 'motif'
        }
    },
    nl: {
        name: 'Nederlands',
        flag: '🇳🇱',
        tryAgain: 'probeer het opnieuw',
        encouragement: ['heel-goed','uitstekend','goed-gedaan','super','perfect','je-bent-geweldig','fantastisch','bravo'],
        messages: {
            garden: 'Tuin', memory: 'Geheugen', patterns: 'Patronen', logic: 'Logica',
            subtitle: 'Los puzzels op om je tuin te laten groeien!',
            memoryTitle: 'Geheugenspel', memorySub: 'Vind de paren!',
            patternTitle: 'Patronenspel', patternSub: 'Wat komt er als volgende?',
            logicTitle: 'Logicaspel', logicSub: 'Welke hoort er niet bij?',
            level: 'Niveau', pairsFound: 'paren gevonden',
            newGame: 'Nieuw Spel', newPattern: 'Nieuw Patroon', newPuzzle: 'Nieuwe Puzzel',
            zoneFlowers: 'Bloementuin', zoneTrees: 'Bos', zoneMystery: 'Mysterie Zone',
            emptyFlowers: 'Los geheugen op om bloemen te planten!',
            emptyTrees: 'Los patronen op om bomen te planten!',
            lockedMystery: 'Los logica op om vrij te spelen!',
            plantedFlower: 'je hebt een bloem geplant',
            plantedTree: 'je hebt een boom geplant',
            plantedStar: 'je hebt een ster geplant',
            congrats: 'je hebt je tuin laten groeien',
            instrMemory: 'tik op een kaart',
            instrPattern: 'wat komt hierna',
            instrLogic: 'welke hoort er niet bij',
            flowerName: 'bloem', treeName: 'boom', starName: 'ster',
            patternType: 'patroon'
        }
    },
    pt: {
        name: 'Portugues',
        flag: '🇵🇹',
        tryAgain: 'tente de novo',
        encouragement: ['muito-bem','excelente','bom-trabalho','parabens','perfeito','voce-e-incrivel','fantastico','bravo'],
        messages: {
            garden: 'Jardim', memory: 'Memoria', patterns: 'Padroes', logic: 'Logica',
            subtitle: 'Resolva desafios para fazer seu jardim crescer!',
            memoryTitle: 'Jogo da Memoria', memorySub: 'Encontre os pares!',
            patternTitle: 'Jogo de Padroes', patternSub: 'O que vem a seguir?',
            logicTitle: 'Jogo de Logica', logicSub: 'Qual nao pertence?',
            level: 'Nivel', pairsFound: 'pares encontrados',
            newGame: 'Novo Jogo', newPattern: 'Novo Padrao', newPuzzle: 'Novo Desafio',
            zoneFlowers: 'Jardim de Flores', zoneTrees: 'Floresta', zoneMystery: 'Zona Misteriosa',
            emptyFlowers: 'Resolva memoria para plantar flores!',
            emptyTrees: 'Resolva padroes para plantar arvores!',
            lockedMystery: 'Resolva logica para desbloquear!',
            plantedFlower: 'você plantou uma flor',
            plantedTree: 'você plantou uma árvore',
            plantedStar: 'você plantou uma estrela',
            congrats: 'você fez seu jardim crescer',
            instrMemory: 'toque em uma carta',
            instrPattern: 'qual vem depois',
            instrLogic: 'qual não pertence ao grupo',
            flowerName: 'flor', treeName: 'árvore', starName: 'estrela',
            patternType: 'padrão'
        }
    },
    it: {
        name: 'Italiano',
        flag: '🇮🇹',
        tryAgain: 'riprova',
        encouragement: ['molto-bene','eccellente','ben-fatto','super','perfetto','sei-fantastico','fantastico','bravo'],
        messages: {
            garden: 'Giardino', memory: 'Memoria', patterns: 'Motivi', logic: 'Logica',
            subtitle: 'Risolvi gli enigmi per far crescere il tuo giardino!',
            memoryTitle: 'Gioco di Memoria', memorySub: 'Trova le coppie!',
            patternTitle: 'Gioco di Motivi', patternSub: 'Cosa viene dopo?',
            logicTitle: 'Gioco di Logica', logicSub: 'Quale non appartiene?',
            level: 'Livello', pairsFound: 'coppie trovate',
            newGame: 'Nuovo Gioco', newPattern: 'Nuovo Motivo', newPuzzle: 'Nuovo Enigma',
            zoneFlowers: 'Giardino di Fiori', zoneTrees: 'Foresta', zoneMystery: 'Zona Mistero',
            emptyFlowers: 'Risolvi la memoria per piantare fiori!',
            emptyTrees: 'Risolvi i motivi per piantare alberi!',
            lockedMystery: 'Risolvi la logica per sbloccare!',
            plantedFlower: 'hai piantato un fiore',
            plantedTree: 'hai piantato un albero',
            plantedStar: 'hai piantato una stella',
            congrats: 'hai fatto crescere il tuo giardino',
            instrMemory: 'tocca una carta',
            instrPattern: 'cosa viene dopo',
            instrLogic: 'quale non appartiene al gruppo',
            flowerName: 'fiore', treeName: 'albero', starName: 'stella',
            patternType: 'motivo'
        }
    }
};

let languages = {};

function rebuildLanguages() {
    languages = Translations.getLanguages(baseLanguages);
}

const MEMORY_LEVELS = [
    { pairs: 2 }, { pairs: 3 }, { pairs: 3 }, { pairs: 4 }, { pairs: 4 },
    { pairs: 5 }, { pairs: 5 }, { pairs: 6 }, { pairs: 6 }, { pairs: 7 }
];

const PATTERN_LEVELS = [
    { type: 'AB', items: ['🌸','🌳'], len: 6 },
    { type: 'AB', items: ['☀️','🦋'], len: 6 },
    { type: 'ABB', items: ['🌸','🌳'], len: 6 },
    { type: 'ABB', items: ['🐝','🐞'], len: 6 },
    { type: 'ABC', items: ['🌸','🌳','☀️'], len: 6 },
    { type: 'ABC', items: ['🍎','🍊','🍇'], len: 6 },
    { type: 'AABB', items: ['🌸','🌳'], len: 8 },
    { type: 'AABB', items: ['🦋','🐝'], len: 8 },
    { type: 'ABCD', items: ['🌸','🌳','☀️','🦋'], len: 8 },
    { type: 'ABCD', items: ['🍎','🍊','🍇','🍓'], len: 8 }
];

const LOGIC_LEVELS = [
    { items: ['🌸','🐝','🌷','🌹'], answer: 1, hint: 'Which one is an animal?' },
    { items: ['🌳','🌻','🌲','🎄'], answer: 1, hint: 'Which one is a flower?' },
    { items: ['🐦','🐟','🦅','🐤'], answer: 1, hint: 'Which one swims?' },
    { items: ['🍎','🍊','🌸','🍇'], answer: 2, hint: 'Which one is a flower?' },
    { items: ['🐘','🐢','🐛','🦋'], answer: 0, hint: 'Which one is very big?' },
    { items: ['☀️','🌙','🌸','⭐'], answer: 2, hint: 'Which one grows in a garden?' },
    { items: ['🌈','☀️','🍎','🌙'], answer: 2, hint: 'Which one is food?' },
    { items: ['🍓','🌳','🍎','🍊'], answer: 1, hint: 'Which one is a tree?' },
    { items: ['🐝','🦋','🐞','🌲'], answer: 3, hint: 'Which one is a tree?' },
    { items: ['🥕','🍎','🌈','🍊'], answer: 2, hint: 'Which one is not food?' }
];

/**
 * Converts a hyphenated phrase-id (e.g. 'great-job') into spoken text
 * (e.g. 'great job') so text-to-speech sounds natural.
 * @param {string} text - Raw phrase or word
 * @returns {string} Cleaned text to speak
 */
function toSpoken(text) {
    return String(text).replace(/-/g, ' ');
}

/**
 * Converts a spoken phrase (letters / words separated by spaces or hyphens)
 * into the hyphenated-slug filename used by the pre-generated Edge TTS clips
 * under audio/<lang>/. Accents are stripped so 'étoile' resolves to
 * 'etoile.mp3'. This mirrors the slugify() used to generate the clips.
 * @param {string} text - Phrase to turn into a filename slug
 * @returns {string} Slug-safe filename (empty if input is empty)
 */
function toSlug(text) {
    return String(text || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Keeps a reusable HTMLAudioElement per filename so clips never need to be
 * refetched from the server, and never overlap: starting a new clip stops
 * whatever is playing.
 */
const AUDIO_BASE_PATH = 'audio';
const audioCache = {};
let currentAudio = null;

/**
 * Returns the cached <audio> element for a given filename, creating and
 * caching it on first use so repeat plays never hit the network.
 * @param {string} filename - Clip filename (without .mp3)
 * @returns {HTMLAudioElement} The cached audio element
 */
function getCachedAudio(filename) {
    if (!filename) return null;
    if (audioCache[filename]) return audioCache[filename];
    const file = AUDIO_BASE_PATH + '/' + currentLang + '/' + filename + '.mp3';
    const audio = new Audio(file);
    audio.preload = 'auto';
    audioCache[filename] = audio;
    return audio;
}

/**
 * Pauses any clip currently playing so words never overlap.
 */
function stopCurrentAudio() {
    if (currentAudio && typeof currentAudio.pause === 'function') {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = null;
}

/**
 * Plays a pre-generated Edge TTS clip for the current language at the
 * user's chosen speech rate via the <audio> element. Stops any clip already
 * playing first. Missing clips resolve silently so custom packs without
 * audio stay quiet.
 * @param {string} filename - Clip filename (without .mp3 extension)
 * @returns {Promise<void>} Resolves when the clip ends or fails
 */
function playAudio(filename) {
    const audio = getCachedAudio(filename);
    if (!audio) {
        return Promise.resolve();
    }

    stopCurrentAudio();
    currentAudio = audio;
    audio.playbackRate = speechRate;

    return new Promise((resolve) => {
        function finish() {
            audio.removeEventListener('ended', onEnd);
            audio.removeEventListener('error', onError);
            resolve();
        }
        function onEnd() {
            finish();
        }
        function onError() {
            finish();
        }
        audio.addEventListener('ended', onEnd);
        audio.addEventListener('error', onErrorhed);
        audio.play();
    });
}

/**
 * Speaks a pre-generated clip whose filename is the natural hyphen-slug of
 * the phrase (e.g. messages.flowerName 'flower' -> 'flower.mp3'). Used for
 * areas that map straight to per-word clips already covered by the audio
 * generator (names, encouragement tokens, try-again token).
 * @param {string} phrase - The displayed word/token whose slug names the clip
 * @returns {Promise<void>} Resolves when the clip ends or fails
 */
function playAudioForWord(phrase) {
    return playAudio(toSlug(phrase));
}

/**
 * Plays a pre-generated encouragement clip (token already hyphen-slug,
 * e.g. 'great-job' -> audio/<lang>/great-job.mp3).
 * @param {string} token - Encouragement token from the language config
 * @returns {Promise<void>} Resolves when the clip ends or fails
 */
function playRandomEncouragementAudio() {
    const lang = languages[currentLang];
    const token = lang.encouragement[Math.floor(Math.random() * lang.encouragement.length)];
    return playAudio(token);
}

function playRandomEncouragement() {
    return playRandomEncouragementAudio();
}


function updateScore() {
    document.getElementById('score').textContent = totalScore;
}

function updateProgress() {
    let pct = 0;
    if (currentTab === 'memory') pct = Math.min(memoryLevel / 10 * 100, 100);
    else if (currentTab === 'patterns') pct = Math.min(patternLevel / 10 * 100, 100);
    else if (currentTab === 'logic') pct = Math.min(logicLevel / 10 * 100, 100);
    else pct = ((gardenState.flowers.length + gardenState.trees.length + gardenState.mystery.length) / 30) * 100;
    document.getElementById('progress').style.width = pct + '%';
}

function showMessage(text) {
    const el = document.getElementById('message');
    el.textContent = text;
    el.classList.add('rainbow');
    setTimeout(() => el.classList.remove('rainbow'), 3000);
}

function createParticles(element) {
    const container = document.getElementById('particles');
    const emojis = ['⭐','✨','🌟','💫','🎈','🎉','🎊','🌈','🌸','🌺'];
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = (rect.left + Math.random() * rect.width) + 'px';
        p.style.top = rect.top + 'px';
        p.style.animationDuration = (1 + Math.random() * 2) + 's';
        container.appendChild(p);
        setTimeout(() => p.remove(), 3000);
    }
}

function createCelebration() {
    const container = document.getElementById('particles');
    const emojis = ['🎉','🎊','🥳','🎈','⭐','🌈','🌸','🌺'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'particle';
            p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = '-50px';
            p.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(p);
            setTimeout(() => p.remove(), 4000);
        }, i * 80);
    }
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tab + '-tab').classList.add('active');
    updateProgress();

    if (tab === 'memory') {
        startMemoryLevel();
        playAudio('find-matching-pairs');
    } else if (tab === 'patterns') {
        startPatternLevel();
        playAudio('what-comes-next');
    } else if (tab === 'logic') {
        startLogicLevel();
        playAudio('which-one-does-not-belong');
    } else {
        updateGarden();
    }
    updateUIText();
}

/**
 * Renders one language button per available language (built-in + any custom
 * languages saved through the editor) plus an editor trigger. There is no
 * limit on the number of languages.
 */
function renderLanguageButtons() {
    const selector = document.getElementById('langSelector');
    if (!selector) return;
    selector.innerHTML = '';

    Object.keys(languages).forEach((code) => {
        const lang = languages[code];
        const btn = document.createElement('button');
        btn.className = 'lang-btn' + (code === currentLang ? ' active' : '');
        btn.dataset.lang = code;
        btn.type = 'button';

        const flag = document.createElement('span');
        flag.className = 'flag';
        flag.textContent = lang.flag || '🌐';
        btn.appendChild(flag);
        btn.appendChild(document.createTextNode(lang.name || code));
        btn.addEventListener('click', () => switchLanguage(code));

        selector.appendChild(btn);
    });

    const trigger = document.createElement('button');
    trigger.className = 'lang-btn editor-trigger';
    trigger.dataset.lang = 'editor';
    trigger.type = 'button';
    trigger.title = 'Translations';
    trigger.textContent = '🌐';
    trigger.addEventListener('click', () => editorApi.open());
    selector.appendChild(trigger);
}

function switchLanguage(lang) {
    const target = languages[lang];
    if (!target) return;

    currentLang = lang;
    renderLanguageButtons();
    updateUIText();
    updateGarden();

    localStorage.setItem('brainGarden_lang', lang);
    playRandomEncouragement();
}

function updateSpeed(val) {
    speechRate = parseFloat(val);
    localStorage.setItem('brainGarden_speed', val);
}

function updateUIText() {
    const lang = languages[currentLang];
    const m = lang.messages;
    document.getElementById('subtitle').textContent = m.subtitle;
    document.getElementById('tab-garden').textContent = m.garden;
    document.getElementById('tab-memory').textContent = m.memory;
    document.getElementById('tab-patterns').textContent = m.patterns;
    document.getElementById('tab-logic').textContent = m.logic;
    document.getElementById('memory-title').textContent = m.memoryTitle;
    document.getElementById('memory-subtitle').textContent = m.memorySub;
    document.getElementById('patterns-title').textContent = m.patternTitle;
    document.getElementById('patterns-subtitle').textContent = m.patternSub;
    document.getElementById('logic-title').textContent = m.logicTitle;
    document.getElementById('logic-subtitle').textContent = m.logicSub;
    document.getElementById('memory-new-btn').textContent = m.newGame;
    document.getElementById('pattern-new-btn').textContent = m.newPattern;
    document.getElementById('logic-new-btn').textContent = m.newPuzzle;
    document.getElementById('zone-flowers-label').textContent = m.zoneFlowers;
    document.getElementById('zone-trees-label').textContent = m.zoneTrees;
    document.getElementById('zone-mystery-label').textContent = m.zoneMystery;
    document.getElementById('zone-flowers-empty').textContent = m.emptyFlowers;
    document.getElementById('zone-trees-empty').textContent = m.emptyTrees;
    document.getElementById('zone-mystery-msg').textContent = m.lockedMystery;
    updateGarden();
}

function saveGarden() {
    localStorage.setItem('brainGarden_garden', JSON.stringify(gardenState));
}

function loadGarden() {
    const saved = localStorage.getItem('brainGarden_garden');
    if (saved) gardenState = JSON.parse(saved);
}

function addPlant(type) {
    let plant;
    if (type === 'flower') plant = FLOWERS[gardenState.flowers.length % FLOWERS.length];
    else if (type === 'tree') plant = TREES[gardenState.trees.length % TREES.length];
    else plant = MYSTERY[gardenState.mystery.length % MYSTERY.length];

    if (type === 'flower') gardenState.flowers.push(plant);
    else if (type === 'tree') gardenState.trees.push(plant);
    else gardenState.mystery.push(plant);
    saveGarden();
    return plant;
}

function updateGarden() {
    const flowersEl = document.getElementById('zone-flowers-plants');
    const treesEl = document.getElementById('zone-trees-plants');
    const mysteryEl = document.getElementById('zone-mystery-plants');
    const flowersEmpty = document.getElementById('zone-flowers-empty');
    const treesEmpty = document.getElementById('zone-trees-empty');
    const mysteryZone = document.getElementById('zone-mystery');
    const mysteryMsg = document.getElementById('zone-mystery-msg');
    const m = languages[currentLang].messages;

    flowersEl.innerHTML = '';
    treesEl.innerHTML = '';
    mysteryEl.innerHTML = '';

    gardenState.flowers.forEach(p => {
        const span = document.createElement('span');
        span.className = 'zone-plant';
        span.textContent = p;
        span.title = m.flowerName;
        span.onclick = () => playAudioForWord(m.flowerName);
        flowersEl.appendChild(span);
    });
    flowersEmpty.style.display = gardenState.flowers.length > 0 ? 'none' : 'block';

    gardenState.trees.forEach(p => {
        const span = document.createElement('span');
        span.className = 'zone-plant';
        span.textContent = p;
        span.title = m.treeName;
        span.onclick = () => playAudioForWord(m.treeName);
        treesEl.appendChild(span);
    });
    treesEmpty.style.display = gardenState.trees.length > 0 ? 'none' : 'block';

    gardenState.mystery.forEach(p => {
        const span = document.createElement('span');
        span.className = 'zone-plant';
        span.textContent = p;
        span.title = m.starName;
        span.onclick = () => playAudioForWord(m.starName);
        mysteryEl.appendChild(span);
    });
    if (gardenState.mystery.length > 0) {
        mysteryZone.classList.remove('locked');
        mysteryMsg.style.display = 'none';
    } else {
        mysteryZone.classList.add('locked');
        mysteryMsg.style.display = 'block';
    }
}

function startMemoryLevel() {
    if (memoryLevel > 10) { memoryLevel = 10; return; }
    const config = MEMORY_LEVELS[memoryLevel - 1];
    memoryTotalPairs = config.pairs;
    memoryPairsFound = 0;
    memoryFlipped = [];
    memoryLocked = false;

    const pool = shuffle(NATURE_EMOJI);
    const selected = pool.slice(0, memoryTotalPairs);
    const pairs = shuffle([...selected, ...selected]);

    memoryCards = pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    const totalCards = memoryTotalPairs * 2;
    const cols = Math.min(Math.ceil(Math.sqrt(totalCards)), 4);
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    memoryCards.forEach(card => {
        const div = document.createElement('div');
        div.className = 'memory-card';
        div.innerHTML = `<div class="card-face card-back">?</div><div class="card-face card-front">${card.emoji}</div>`;
        div.onclick = () => flipMemoryCard(card, div);
        grid.appendChild(div);
    });

    document.getElementById('memory-level').textContent = `${languages[currentLang].messages.level} ${memoryLevel}`;
    document.getElementById('memory-pairs').textContent = `${memoryPairsFound} / ${memoryTotalPairs} ${languages[currentLang].messages.pairsFound}`;
    updateProgress();
}

function flipMemoryCard(card, div) {
    if (memoryLocked || card.flipped || card.matched) return;
    card.flipped = true;
    div.classList.add('flipped');
    memoryFlipped.push({ card, div });

    if (memoryFlipped.length === 2) {
        memoryLocked = true;
        const [a, b] = memoryFlipped;
        if (a.card.emoji === b.card.emoji) {
            a.card.matched = true;
            b.card.matched = true;
            a.div.classList.add('matched');
            b.div.classList.add('matched');
            memoryPairsFound++;
            totalScore += 10;
            updateScore();
            createParticles(a.div);
            document.getElementById('memory-pairs').textContent = `${memoryPairsFound} / ${memoryTotalPairs} ${languages[currentLang].messages.pairsFound}`;

            if (memoryPairsFound === memoryTotalPairs) {
                setTimeout(async () => {
                    createCelebration();
                    const plant = addPlant('flower');
                    showMessage(`${plant} ${languages[currentLang].messages.plantedFlower}!`);
                    await playAudio('you-planted-a-flower');
                    playRandomEncouragement();
                    memoryLevel++;
                    if (memoryLevel > 10) {
                        await playAudio('congratulations-you-grew-your-garden');
                        showMessage(languages[currentLang].messages.congrats);
                        createCelebration();
                    }
                    updateProgress();
                }, 500);
            }
            memoryFlipped = [];
            memoryLocked = false;
        } else {
            setTimeout(async () => {
                a.card.flipped = false;
                b.card.flipped = false;
                a.div.classList.remove('flipped');
                b.div.classList.remove('flipped');
                await playAudioForWord(languages[currentLang].tryAgain);
                memoryFlipped = [];
                memoryLocked = false;
            }, 800);
        }
    }
}

function startPatternLevel() {
    if (patternLevel > 10) { patternLevel = 10; return; }
    patternLocked = false;
    const config = PATTERN_LEVELS[patternLevel - 1];
    const { type, items, len } = config;

    let sequence = [];
    if (type === 'AB') {
        for (let i = 0; i < len; i++) sequence.push(items[i % 2]);
    } else if (type === 'ABB') {
        for (let i = 0; i < len; i++) sequence.push(items[i % 3 === 0 ? 0 : 1]);
    } else if (type === 'ABC') {
        for (let i = 0; i < len; i++) sequence.push(items[i % 3]);
    } else if (type === 'AABB') {
        for (let i = 0; i < len; i++) sequence.push(items[Math.floor(i / 2) % 2]);
    } else if (type === 'ABCD') {
        for (let i = 0; i < len; i++) sequence.push(items[i % 4]);
    }

    const missingIndex = len - 1;
    const answer = sequence[missingIndex];
    const display = sequence.slice(0, missingIndex);

    const typeLabel = document.getElementById('pattern-type-label');
    typeLabel.textContent = `${PATTERN_TYPE_NAMES[type]} ${languages[currentLang].messages.patternType}`;

    const container = document.getElementById('pattern-display');
    container.innerHTML = '';
    display.forEach((emoji, i) => {
        const item = document.createElement('div');
        item.className = 'pattern-item';
        item.textContent = emoji;
        item.style.animationDelay = (i * 0.1) + 's';
        container.appendChild(item);
    });
    const missing = document.createElement('div');
    missing.className = 'pattern-missing';
    missing.textContent = '?';
    container.appendChild(missing);

    const options = shuffle([answer, ...shuffle(NATURE_EMOJI.filter(e => e !== answer)).slice(0, 3)]);
    const optContainer = document.getElementById('pattern-options');
    optContainer.innerHTML = '';
    options.forEach(emoji => {
        const btn = document.createElement('div');
        btn.className = 'pattern-option';
        btn.textContent = emoji;
        btn.onclick = () => handlePatternAnswer(emoji === answer, btn, answer);
        optContainer.appendChild(btn);
    });

    document.getElementById('pattern-level').textContent = `${languages[currentLang].messages.level} ${patternLevel}`;
    updateProgress();
}

async function handlePatternAnswer(correct, btn, answer) {
    if (patternLocked) return;
    patternLocked = true;
    if (correct) {
        btn.classList.add('correct');
        totalScore += 10;
        updateScore();
        createParticles(btn);
        const plant = addPlant('tree');
        showMessage(`${plant} ${languages[currentLang].messages.plantedTree}!`);
        await playAudio('you-planted-a-tree');
        playRandomEncouragement();
        patternLevel++;
        if (patternLevel > 10) {
            await playAudio('congratulations-you-grew-your-garden');
            showMessage(languages[currentLang].messages.congrats);
            createCelebration();
        }
        updateProgress();
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.pattern-option').forEach(o => {
            if (o.textContent === answer) o.classList.add('correct');
        });
        await playAudioForWord(languages[currentLang].tryAgain);
    }
    setTimeout(() => { patternLocked = false; }, 1000);
}

function startLogicLevel() {
    if (logicLevel > 10) { logicLevel = 10; return; }
    logicLocked = false;
    const config = LOGIC_LEVELS[logicLevel - 1];

    document.getElementById('logic-hint').textContent = config.hint;
    const container = document.getElementById('logic-display');
    container.innerHTML = '';

    config.items.forEach((emoji, i) => {
        const item = document.createElement('div');
        item.className = 'logic-item';
        item.textContent = emoji;
        item.onclick = () => handleLogicAnswer(i, config.answer, item, container);
        container.appendChild(item);
    });

    document.getElementById('logic-level').textContent = `${languages[currentLang].messages.level} ${logicLevel}`;
    updateProgress();
}

async function handleLogicAnswer(selected, answer, item, container) {
    if (logicLocked) return;
    logicLocked = true;
    if (selected === answer) {
        item.classList.add('correct');
        totalScore += 10;
        updateScore();
        createParticles(item);
        const plant = addPlant('mystery');
        showMessage(`${plant} ${languages[currentLang].messages.plantedStar}!`);
        await playAudio('you-planted-a-star');
        playRandomEncouragement();
        logicLevel++;
        if (logicLevel > 10) {
            await playAudio('congratulations-you-grew-your-garden');
            showMessage(languages[currentLang].messages.congrats);
            createCelebration();
        }
        updateProgress();
    } else {
        item.classList.add('wrong');
        container.children[answer].classList.add('correct');
        await playAudioForWord(languages[currentLang].tryAgain);
    }
    setTimeout(() => { logicLocked = false; }, 1000);
}

let editorApi = null;

function init() {
    rebuildLanguages();

    const savedLang = localStorage.getItem('brainGarden_lang');
    const savedSpeed = localStorage.getItem('brainGarden_speed');
    if (savedLang && languages[savedLang]) {
        currentLang = savedLang;
    } else if (!languages[currentLang]) {
        currentLang = 'en';
    }
    if (savedSpeed) {
        speechRate = parseFloat(savedSpeed);
        document.querySelector('.speed-slider').value = savedSpeed;
    }

    editorApi = TranslationsEditor.init({
        getBaseLanguages: () => baseLanguages,
        getCurrentLang: () => currentLang,
        onChange: () => {
            rebuildLanguages();
            if (!languages[currentLang]) {
                currentLang = 'en';
                localStorage.setItem('brainGarden_lang', currentLang);
            }
            renderLanguageButtons();
            updateUIText();
            updateScore();
            updateGarden();
        }
    });

    loadGarden();
    renderLanguageButtons();
    updateUIText();
    updateScore();
    updateGarden();
}

init();