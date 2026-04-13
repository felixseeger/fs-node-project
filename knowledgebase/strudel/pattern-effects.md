# Pattern Effects - Strudel

This guide summarizes the pattern manipulation functions from the Strudel workshop, focusing on unique sequencing capabilities.

## Core Pattern Functions

### `rev()`
Reverses the entire pattern within a cycle.
```javascript
n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").rev()
```

### `jux(fn)`
Plays the original pattern in the left channel and a modified version (using the provided function) in the right.
```javascript
n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").jux(rev)
```

### `slow(n)` / `fast(n)`
Stretches or compresses the pattern over time. You can pattern these values to create multiple tempos.
```javascript
note("c2 eb3 g3").sound("piano").slow("0.5, 1, 1.5")
```

### `ply(n)`
Repeats each event in the pattern `n` times within its original time slot.
```javascript
sound("hh hh, bd rim [~ cp] rim").ply(2)
```

### `off(time, fn)`
Layers a copy of the pattern that is offset by a specific time and modified by a function.
```javascript
n("0 [4 3] 2 1").off(1/16, x => x.add(4)).scale("C5:minor")
```

### `add(n)`
Adds numerical values to notes or indices, which is particularly powerful when combined with scales.
```javascript
n("0 [2 4] <3 5>").add("<0 [0,2,4]>").scale("C5:minor")
```
