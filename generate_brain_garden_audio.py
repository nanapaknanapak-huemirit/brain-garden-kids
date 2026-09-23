#!/usr/bin/env python3
"""
Generate speech audio clips for the Brain Garden app.

Synthesizes every phrase the app speaks in 7 languages with edge-tts using the
same friendly female voices as the other apps in this family. Clip filenames
are the slug of the spoken phrase, mirroring toSlug() in app.js, so the app
resolves each clip straight from its language configuration:

  - Instructions  -> find-matching-pairs, what-comes-next,
                     which-one-does-not-belong (fixed ids)
  - Try again     -> slug of the language's tryAgain value
  - Plant names    -> slug of flowerName / treeName / starName
                     (e.g. fr 'étoile' -> etoile.mp3)
  - Rewards        -> you-planted-a-flower / -tree / -star (fixed ids)
  - Congrats       -> congratulations-you-grew-your-garden (fixed id)
  - Encouragement  -> audio/<lang>/<token>.mp3 (tokens are already slugs)

Run inside the fedora toolbox:
    flatpak-spawn --host toolbox run -c fedora-toolbox-44 \
        python3 generate_brain_garden_audio.py
"""

import asyncio
import re
import unicodedata
from pathlib import Path

import edge_tts

BASE_DIR = Path(__file__).resolve().parent
AUDIO_DIR = BASE_DIR / "audio"

# Voice per language (same friendly female voices as Learn Colors Kids)
VOICES = {
    "en": "en-US-JennyNeural",
    "es": "es-ES-ElviraNeural",
    "de": "de-DE-KatjaNeural",
    "fr": "fr-FR-DeniseNeural",
    "nl": "nl-NL-FennaNeural",
    "pt": "pt-BR-FranciscaNeural",
    "it": "it-IT-ElsaNeural",
}

# Encouragement phrase ids (word-safe filenames, same pattern as siblings)
ENCOURAGEMENT = {
    "en": ["great-job", "excellent", "well-done", "amazing", "perfect", "you-got-it", "wonderful", "fantastic"],
    "es": ["muy-bien", "excelente", "buen-trabajo", "genial", "perfecto", "eres-genial", "fantastico", "bravo"],
    "de": ["sehr-gut", "ausgezeichnet", "gut-gemacht", "toll", "perfekt", "du-bist-grossartig", "fantastisch", "bravo"],
    "fr": ["tres-bien", "excellent", "bien-joue", "super", "parfait", "tu-es-genial", "fantastique", "bravo"],
    "nl": ["heel-goed", "uitstekend", "goed-gedaan", "super", "perfect", "je-bent-geweldig", "fantastisch", "bravo"],
    "pt": ["muito-bem", "excelente", "bom-trabalho", "parabens", "perfeito", "voce-e-incrivel", "fantastico", "bravo"],
    "it": ["molto-bene", "eccellente", "ben-fatto", "super", "perfetto", "sei-fantastico", "fantastico", "bravo"],
}

# Tab instructions spoken with fixed filenames (messages.instrMemory /
# instrPattern / instrLogic)
INSTRUCTIONS = {
    "en": {
        "find-matching-pairs": "find matching pairs",
        "what-comes-next": "what comes next",
        "which-one-does-not-belong": "which one does not belong",
    },
    "es": {
        "find-matching-pairs": "encuentra los pares",
        "what-comes-next": "que viene despues",
        "which-one-does-not-belong": "cual no pertenece al grupo",
    },
    "de": {
        "find-matching-pairs": "finde die passenden paare",
        "what-comes-next": "was kommt als naechstes",
        "which-one-does-not-belong": "was gehoert nicht dazu",
    },
    "fr": {
        "find-matching-pairs": "trouve les paires",
        "what-comes-next": "quelle est la suite",
        "which-one-does-not-belong": "lequel ne fait pas partie du groupe",
    },
    "nl": {
        "find-matching-pairs": "vind de passende paren",
        "what-comes-next": "wat komt hierna",
        "which-one-does-not-belong": "welke hoort er niet bij",
    },
    "pt": {
        "find-matching-pairs": "encontre os pares",
        "what-comes-next": "qual vem depois",
        "which-one-does-not-belong": "qual não pertence ao grupo",
    },
    "it": {
        "find-matching-pairs": "trova le coppie",
        "what-comes-next": "cosa viene dopo",
        "which-one-does-not-belong": "quale non appartiene al gruppo",
    },
}

# Try-again spoken text (baseLanguages.tryAgain); filename is the slug
TRY_AGAIN_TEXT = {
    "en": "try again",
    "es": "intenta de nuevo",
    "de": "versuche es noch einmal",
    "fr": "essaye encore",
    "nl": "probeer het opnieuw",
    "pt": "tente de novo",
    "it": "riprova",
}

# Reward clips (messages.plantedFlower / plantedTree / plantedStar)
PLANTED = {
    "en": {
        "you-planted-a-flower": "you planted a flower",
        "you-planted-a-tree": "you planted a tree",
        "you-planted-a-star": "you planted a star",
    },
    "es": {
        "you-planted-a-flower": "has plantado una flor",
        "you-planted-a-tree": "has plantado un arbol",
        "you-planted-a-star": "has plantado una estrella",
    },
    "de": {
        "you-planted-a-flower": "du hast eine Blume gepflanzt",
        "you-planted-a-tree": "du hast einen Baum gepflanzt",
        "you-planted-a-star": "du hast einen Stern gepflanzt",
    },
    "fr": {
        "you-planted-a-flower": "tu as planté une fleur",
        "you-planted-a-tree": "tu as planté un arbre",
        "you-planted-a-star": "tu as planté une étoile",
    },
    "nl": {
        "you-planted-a-flower": "je hebt een bloem geplant",
        "you-planted-a-tree": "je hebt een boom geplant",
        "you-planted-a-star": "je hebt een ster geplant",
    },
    "pt": {
        "you-planted-a-flower": "você plantou uma flor",
        "you-planted-a-tree": "você plantou uma árvore",
        "you-planted-a-star": "você plantou uma estrela",
    },
    "it": {
        "you-planted-a-flower": "hai piantato un fiore",
        "you-planted-a-tree": "hai piantato un albero",
        "you-planted-a-star": "hai piantato una stella",
    },
}

# Full-garden congrats clip (messages.congrats)
CONGRATS_FILENAME = "congratulations-you-grew-your-garden"
CONGRATS = {
    "en": "congratulations, you grew your garden",
    "es": "has hecho crecer tu jardin",
    "de": "du hast deinen Garten wachsen lassen",
    "fr": "tu as fait pousser ton jardin",
    "nl": "je hebt je tuin laten groeien",
    "pt": "você fez seu jardim crescer",
    "it": "hai fatto crescere il tuo giardino",
}

# Plant names spoken on click (messages.flowerName / treeName / starName);
# the clip filename is the slug of each name, exactly like toSlug() in app.js
NAMES = {
    "en": {"flower": "flower", "tree": "tree", "star": "star"},
    "es": {"flower": "flor", "tree": "arbol", "star": "estrella"},
    "de": {"flower": "Blume", "tree": "Baum", "star": "Stern"},
    "fr": {"flower": "fleur", "tree": "arbre", "star": "étoile"},
    "nl": {"flower": "bloem", "tree": "boom", "star": "ster"},
    "pt": {"flower": "flor", "tree": "árvore", "star": "estrela"},
    "it": {"flower": "fiore", "tree": "albero", "star": "stella"},
}


def slugify(text):
    """Hyphen-slug a spoken phrase the same way toSlug() does in app.js."""
    lowered = str(text).lower()
    decomposed = unicodedata.normalize("NFKD", lowered)
    stripped = "".join(c for c in decomposed if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", stripped).strip("-")


def build_clips(lang):
    """Returns {filename: spoken_text} for every clip a language needs."""
    clips = {}

    for token in ENCOURAGEMENT[lang]:
        clips[token] = token

    for filename, text in INSTRUCTIONS[lang].items():
        clips[filename] = text

    clips[slugify(TRY_AGAIN_TEXT[lang])] = TRY_AGAIN_TEXT[lang]

    for filename, text in PLANTED[lang].items():
        clips[filename] = text

    clips[CONGRATS_FILENAME] = CONGRATS[lang]

    for text in NAMES[lang].values():
        clips[slugify(text)] = text

    return clips


async def synthesize(lang, voice, filename, text):
    out_dir = AUDIO_DIR / lang
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"{filename}.mp3"

    if out_file.exists():
        print(f"  · {lang}/{filename}.mp3 exists, skipping")
        return False

    tts = edge_tts.Communicate(text, voice, rate="-10%")
    await tts.save(str(out_file))
    print(f"  ✓ {lang}/{filename}.mp3  ({text})")
    return True


async def main():
    synthesized = 0
    for lang in VOICES:
        print(f"== {lang} ({VOICES[lang]}) ==")
        for filename, text in build_clips(lang).items():
            if await synthesize(lang, VOICES[lang], filename, text):
                synthesized += 1

    total = sum(len(build_clips(lang)) for lang in VOICES)
    print(f"\nDone. {synthesized} new clips synthesized; {total} total across {len(VOICES)} languages.")


if __name__ == "__main__":
    asyncio.run(main())