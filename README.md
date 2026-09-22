# Brain Garden 🌱

A puzzle game for kids where solving puzzles grows a virtual garden.

<div align="center">

![QR Code](qrcode.svg)

**📱 Scan to try it on your phone!**

[🔗 Live Demo](https://nanapaknanapak-huemirit.github.io/brain-garden-kids/)

</div>

## How to Play

### Garden Tab
View your growing garden! Plants appear as you solve puzzles in each game mode.

### Memory Game
Flip cards and find matching pairs. Each completed level plants a flower in your garden.

### Pattern Game
Look at the sequence and choose what comes next. Each solved pattern grows a tree.

### Logic Game
Find the item that doesn't belong. Each solved puzzle unlocks a mystery plant.

## Features

- 30 levels across 3 game types (10 each)
- Virtual garden that grows as you play
- Pre-generated Edge TTS audio clips for every phrase in every language
- Unlimited languages — add your own with the 🌐 Translations editor (stored in your browser)
- Star rewards and celebration animations
- Mobile responsive
- Speech speed control
- Progress saved in browser

## Languages

Seven languages ship built-in (English, Espanol, Deutsch, Francais, Nederlands,
Portugues, Italiano) and every word is spoken by a pre-generated MP3 — each
clip is synthesized once with Edge TTS (same friendly female voices as the
other apps in this family) and stored under `audio/<lang>/`. There is **no
limit on the number of languages**: use the in-app Translations editor (🌐
button) to tweak an existing language or add a brand-new one. Custom packs use
Edge TTS clips too — run `generate_brain_garden_audio.py` from the repo root
in the fedora toolbox to pre-generate `audio/<lang>/<name>.mp3` for a new
language, then fill in the words. New languages that skip the generator are
simply quiet until their clips exist.

## App Family

This app is part of a family of educational apps for kids:

- [Number Adventure](https://nanapaknanapak-huemirit.github.io/learn-numbers-kids/) - Learn numbers 1-10, addition, and subtraction
- [Letter Adventure](https://nanapaknanapak-huemirit.github.io/learn-letters-kids/) - Learn the alphabet and match letters
- **Brain Garden** - Solve puzzles to grow a virtual garden

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Animations, gradients, responsive design
- **JavaScript** - Interactive game logic
- **Pre-generated Edge TTS clips** - Free synthesized MP3 speech for every phrase
- **GitHub Pages** - Free hosting

## Project Structure

```
brain-garden-kids/
├── index.html             # App structure
├── styles.css             # All styling
├── translations.css       # Translations editor styling
├── app.js                 # Game logic
├── translations.js        # Translation-pack model (unlimited languages)
├── translations-editor.js # In-app Translations editor
├── tests/                 # Node unit tests
├── qrcode.svg             # QR code for easy mobile access
└── .gitignore
```

## Testing

```bash
node --test tests/translations.test.js
```