# First Notes - Strudel

This guide covers the fundamentals of playing notes, using scales, and structuring sequences in Strudel.

## Note Notation
Notes can be represented using MIDI numbers or letter names.

### Numbers
MIDI numbers map to pitches (e.g., 60 is Middle C).
```javascript
note("48 52 55 59").sound("piano")
```

### Letters
Standard note letters `a-g` can be used. Add `b` for flats or `#` for sharps.
```javascript
note("c e g b").sound("piano")
note("db eb gb ab bb").sound("piano") // Flats
note("c# d# f# g# a#").sound("piano") // Sharps
```

### Octaves
Append a number to a note letter to specify the octave (1-8).
```javascript
note("c2 e3 g4 b5").sound("piano")
```

## Structuring Sequences
Strudel uses mini-notation to control timing and repetition.

| Syntax | Concept | Description | Example |
| :--- | :--- | :--- | :--- |
| `[]` | Grouping | Groups notes into a single beat/unit. | `note("[c e g]")` |
| `/` | Slow down | Divides a sequence to play over multiple cycles. | `note("[c a f e]/2")` |
| `<>` | Alternate | Plays one element per cycle. | `note("c a <e g>")` |
| `@` | Elongate | Multiplies the duration of a specific note. | `note("c@3 e")` |
| `!` | Replicate | Repeats a note a specific number of times. | `note("c!3 e")` |
| `,` | Stack | Plays multiple patterns simultaneously within a string. | `note("[c, e, g]")` |

## Scales
Scales allow you to use relative degrees (`n`) instead of absolute pitches.
```javascript
n("0 2 4 7").scale("C:minor").sound("piano")
```
**Common Scales:** `C:major`, `A2:minor`, `D:dorian`, `G:mixolydian`, `F:major:pentatonic`.

## Parallel Patterns
To play multiple independent patterns at once, prefix each with `$:`.
```javascript
$: note("c2 c3").sound("gm_synth_bass_1")
$: note("g4 b4").sound("piano")
$: sound("bd sd")
```
*Tip: Use `_$` instead of `$:` to quickly mute a pattern.*
