# Recap - Strudel

The Strudel workshop recap provides a comprehensive reference for live coding music using JavaScript-based patterns.

## Summary of Core Concepts

### 1. Mini-Notation
Used for sequencing sounds and notes.
- `bd hh`: Sequential
- `[bd hh]`: Grouped
- `bd*2`: Accelerated
- `<bd hh>`: Alternate per cycle

### 2. Pitch and Timbre
- `sound("bd")`: Play a sample
- `note("c e g")`: Play notes
- `n("0 1 2")`: Play sample indices or scale degrees
- `.bank("RolandTR909")`: Switch sound sets
- `.scale("C:major")`: Set the harmonic context

### 3. Audio and Pattern Effects
- `lpf(800)`: Low-pass filter
- `room(2)`: Reverb
- `rev()`: Reverse pattern
- `slow(2)`: Half speed
- `fast(2)`: Double speed
- `ply(2)`: Reiterate events
- `jux(rev)`: Stereo divergence

### 4. Advanced Control
- `$: ...`: Parallel patterns
- `off(1/16, rev)`: Offset layer
- `setcpm(60)`: Set tempo

## Final Tips
- Use `Ctrl + Enter` to update patterns while they are playing.
- Use `Ctrl + .` to stop all sound.
- Experiment with combining effects for complex, evolving textures.
- Check the [Main Documentation](https://strudel.cc/docs) for full API details.
