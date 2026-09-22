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
- Free text-to-speech for every phrase in any language
- Unlimited languages — add your own with the 🌐 Translations editor (stored in your browser)
- Star rewards and celebration animations
- Mobile responsive
- Speech speed control
- Progress saved in browser

## Languages

Seven languages ship built-in (English, Espanol, Deutsch, Francais, Nederlands,
Portugues, Italiano) and every word is spoken free by the browser's
`speechSynthesis`. There is **no limit on the number of languages**: use the
in-app Translations editor (🌐 button) to tweak an existing language or add a
brand-new one — no audio files are needed, the browser speaks whatever language
code you pick. New languages start in English and switch to their own words as
you fill them in.

## App Family

This app is part of a family of educational apps for kids:

- [Number Adventure](https://nanapaknanapak-huemirit.github.io/learn-numbers-kids/) - Learn numbers 1-10, addition, and subtraction
- [Letter Adventure](https://nanapaknanapak-huemirit.github.io/learn-letters-kids/) - Learn the alphabet and match letters
- **Brain Garden** - Solve puzzles to grow a virtual garden

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Animations, gradients, responsive design
- **JavaScript** - Interactive game logic
- **Web Speech API** - Free browser text-to-speech
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