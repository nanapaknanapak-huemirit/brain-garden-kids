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
- Audio support in 7 languages
- Star rewards and celebration animations
- Mobile responsive
- Speech speed control
- Progress saved in browser

## Languages

| Flag | Language |
|------|----------|
| US | English |
| ES | Espanol |
| DE | Deutsch |
| FR | Francais |
| NL | Nederlands |
| PT | Portugues |
| IT | Italiano |

## Audio Generation

Audio files are generated using Edge TTS. To regenerate:

```bash
# Install edge-tts
pip install edge-tts

# Generate all languages
bash generate_audio.sh

# Generate specific language
bash generate_audio.sh en
```

## App Family

This app is part of a family of educational apps for kids:

- [Number Adventure](https://nanapaknanapak-huemirit.github.io/learn-numbers-kids/) - Learn numbers 1-10, addition, and subtraction
- [Letter Adventure](https://nanapaknanapak-huemirit.github.io/learn-letters-kids/) - Learn the alphabet and match letters
- **Brain Garden** - Solve puzzles to grow a virtual garden

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Animations, gradients, responsive design
- **JavaScript** - Interactive game logic
- **Edge TTS** - Natural-sounding text-to-speech audio
- **GitHub Pages** - Free hosting

## Project Structure

```
brain-garden-kids/
├── index.html          # App structure
├── styles.css          # All styling
├── app.js              # Game logic
├── qrcode.svg          # QR code for easy mobile access
├── generate_audio.sh   # Audio generation script
├── audio/              # Audio files per language
└── .gitignore
```
