# First Effects - Strudel

This guide covers basic audio effects in Strudel, including filters, dynamics, and signal modulation.

## Basic Audio Effects
*   **Low-Pass Filter (`lpf`)**: Muffles sound by cutting high frequencies.
    ```javascript
    note("<[c2 c3]*4 [bb1 bb2]*4>").sound("sawtooth").lpf(800)
    ```
*   **Vowel Filter (`vowel`)**: Applies formant filters (a, e, i, o, u).
    ```javascript
    note("c3 g3 e4").sound("sawtooth").vowel("<a e i o>")
    ```
*   **Gain (`gain`)**: Controls volume and dynamics.
    ```javascript
    sound("hh*16").gain("[.25 1]*4")
    ```
*   **Delay (`delay`)**: Adds echoes; supports short notation for time and feedback.
    ```javascript
    sound("bd rim").delay(".5:.125:.8") // delay:feedback:dry/wet
    ```
*   **Reverb (`room`)**: Simulates acoustic space.
    ```javascript
    sound("gm_accordion:2").room(2)
    ```

## Shaping and Modulation
*   **ADSR Envelope**: Shapes the volume over time (Attack, Decay, Sustain, Release).
    ```javascript
    note("c3 bb2").sound("sawtooth").adsr(".1:.1:.5:.2")
    ```
*   **Signal Modulation**: Uses waveforms (`sine`, `saw`, `square`, `tri`) or randomness (`rand`, `perlin`) to automate parameters.
    ```javascript
    sound("hh*16").lpf(saw.range(500, 2000).slow(4))
    ```
