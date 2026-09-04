#!/bin/bash
# Generate audio for the Brain Garden app using edge-tts.
# Usage: bash generate_audio.sh [lang]
# Each language generates message files into audio/<lang>/.

set -e

EDGE="edge-tts"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="$SCRIPT_DIR/audio"

declare -A VOICE
VOICE[en]="en-US-JennyNeural"
VOICE[es]="es-ES-ElviraNeural"
VOICE[de]="de-DE-KatjaNeural"
VOICE[fr]="fr-FR-DeniseNeural"
VOICE[nl]="nl-NL-ColetteNeural"
VOICE[pt]="pt-BR-FranciscaNeural"
VOICE[it]="it-IT-ElsaNeural"

# messages as "filename|text-to-speak" lines
declare -A MESSAGES
MESSAGES[en]="tap-a-card|tap a card
find-the-matching-pair|find the matching pair
what-comes-next|what comes next
which-one-does-not-belong|which one does not belong
your-garden-is-growing|your garden is growing
level-complete|level complete
you-planted-a-flower|you planted a flower
you-planted-a-tree|you planted a tree
you-planted-a-star|you planted a star
great-job|great job
excellent|excellent
well-done|well done
amazing|amazing
perfect|perfect
you-got-it|you got it
wonderful|wonderful
fantastic|fantastic
try-again|try again
congratulations-you-grew-your-garden|congratulations, you grew your garden
flower|flower
tree|tree
star|star
pattern|pattern"

MESSAGES[es]="tap-a-card|toca una carta
find-the-matching-pair|encuentra el par que coincide
what-comes-next|que viene despues
which-one-does-not-belong|cual no pertenece
your-garden-is-growing|tu jardin esta creciendo
level-complete|nivel completado
you-planted-a-flower|plantaste una flor
you-planted-a-tree|plantaste un arbol
you-planted-a-star|plantaste una estrella
muy-bien|muy bien
excelente|excelente
buen-trabajo|buen trabajo
genial|genial
perfecto|perfecto
eres-genial|eres genial
fantastico|fantastico
bravo|bravo
intenta-de-nuevo|intenta de nuevo
congratulations-you-grew-your-garden|felicidades, creciste tu jardin
flower|flor
tree|arbol
star|estrella
pattern|patron"

MESSAGES[de]="tap-a-card|tippe auf eine karte
find-the-matching-pair|finde das passende paar
what-comes-next|was kommt als nachstes
which-one-does-not-belong|was gehort nicht hin
your-garden-is-growing|dein garten wachst
level-complete|stufe geschafft
you-planted-a-flower|du hast eine blume gepflanzt
you-planted-a-tree|du hast einen baum gepflanzt
you-planted-a-star|du hast einen stern gepflanzt
sehr-gut|sehr gut
ausgezeichnet|ausgezeichnet
gut-gemacht|gut gemacht
toll|toll
perfekt|perfekt
du-bist-grossartig|du bist grossartig
fantastisch|fantastisch
bravo|bravo
versuch-es-nochmal|versuch es nochmal
congratulations-you-grew-your-garden|herzlichen glueckwunsch, dein garten wachst
flower|blume
tree|baum
star|stern
pattern|muster"

MESSAGES[fr]="tap-a-card|appuie sur une carte
find-the-matching-pair|trouve la paire correspondante
what-comes-next|que vient ensuite
which-one-does-not-belong|lequel ne fait pas partie du groupe
your-garden-is-growing|ton jardin pousse
level-complete|niveau termine
you-planted-a-flower|tu as plante une fleur
you-planted-a-tree|tu as plante un arbre
you-planted-a-star|tu as plante une etoile
tres-bien|tres bien
excellent|excellent
bien-joue|bien joue
super|super
parfait|parfait
tu-es-genial|tu es genial
fantastique|fantastique
bravo|bravo
essaie-encore|essaie encore
congratulations-you-grew-your-garden|felicitations, tu as fait pousser ton jardin
flower|fleur
tree|arbre
star|etoile
pattern|motif"

MESSAGES[nl]="tap-a-card|tik op een kaart
find-the-matching-pair|vind het bijpassende paar
what-comes-next|wat komt er als volgende
which-one-does-not-belong|welke hoort er niet bij
your-garden-is-growing|je tuin groeit
level-complete|niveau gehaald
you-planted-a-flower|je hebt een bloem geplant
you-planted-a-tree|je hebt een boom geplant
you-planted-a-star|je hebt een ster geplant
heel-goed|heel goed
uitstekend|uitstekend
goed-gedaan|goed gedaan
super|super
perfect|perfect
je-bent-geweldig|je bent geweldig
fantastisch|fantastisch
bravo|bravo
probeer-het-opnieuw|probeer het opnieuw
congratulations-you-grew-your-garden|gefeliciteerd, je tuin groeit
flower|bloem
tree|boom
star|ster
pattern|patroon"

MESSAGES[pt]="tap-a-card|toque em uma carta
find-the-matching-pair|encontre o par correspondente
what-comes-next|o que vem a seguir
which-one-does-not-belong|qual nao pertence
your-garden-is-growing|seu jardim esta crescendo
level-complete|nivel concluido
you-planted-a-flower|voce plantou uma flor
you-planted-a-tree|voce plantou uma arvore
you-planted-a-star|voce plantou uma estrela
muito-bem|muito bem
excelente|excelente
bom-trabalho|bom trabalho
parabens|parabens
perfeito|perfeito
voce-e-incrivel|voce e incrivel
fantastico|fantastico
bravo|bravo
tente-de-novo|tente de novo
congratulations-you-grew-your-garden|parabens, voce fez seu jardim crescer
flower|flor
tree|arvore
star|estrela
pattern|padrao"

MESSAGES[it]="tap-a-card|tocca una carta
find-the-matching-pair|trova la coppia corrispondente
what-comes-next|cosa viene dopo
which-one-does-not-belong|quale non appartiene
your-garden-is-growing|il tuo giardino sta crescendo
level-complete|livello completato
you-planted-a-flower|hai piantato un fiore
you-planted-a-tree|hai piantato un albero
you-planted-a-star|hai piantato una stella
molto-bene|molto bene
eccellente|eccellente
ben-fatto|ben fatto
super|super
perfetto|perfetto
sei-fantastico|sei fantastico
fantastico|fantastico
bravo|bravo
riprova|riprova
congratulations-you-grew-your-garden|complimenti, il tuo giardino e cresciuto
flower|fiore
tree|albero
star|stella
pattern|motivo"

LANG="${1:-all}"

TARGETS=()
if [ "$LANG" = "all" ]; then
    TARGETS=(en es de fr nl pt it)
else
    TARGETS=("$LANG")
fi

for lang in "${TARGETS[@]}"; do
    if [ -z "${VOICE[$lang]}" ]; then
        echo "SKIP unknown language: $lang"
        continue
    fi
    dir="$BASE/$lang"
    mkdir -p "$dir"
    voice="${VOICE[$lang]}"

    echo "=== Generating $lang ($voice) ==="

    IFS=$'\n'
    for entry in ${MESSAGES[$lang]}; do
        filename="${entry%%|*}"
        text="${entry#*|}"
        "$EDGE" -v "$voice" -t "$text" --write-media "$dir/$filename.mp3" >/dev/null 2>&1
        echo "  message: $filename"
    done
    unset IFS
done

# Universal flip sound (not language-specific)
FLIP_DIR="$BASE"
mkdir -p "$FLIP_DIR"
if [ ! -f "$FLIP_DIR/flip.mp3" ]; then
    echo "=== Generating flip sound ==="
    "$EDGE" -v "en-US-JennyNeural" -t "click" --rate="-30%" --pitch="-20Hz" --write-media "$FLIP_DIR/flip.mp3" >/dev/null 2>&1
    echo "  message: flip"
fi

echo "DONE"
