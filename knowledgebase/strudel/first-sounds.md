# First Sounds - Strudel

This guide introduces Strudel live coding, focusing on the **Mini-Notation** language for creating rhythms and sequences.

## Core Concepts
*   **Cycles:** The fundamental unit of time in Strudel (default: 2 seconds). All sounds in a sequence are "squished" to fit into one cycle.
*   **Live Coding:** Use `Ctrl + Enter` to play/update code and `Ctrl + .` to stop.
*   **CPM (Cycles Per Minute):** Sets the tempo. Default is 30 CPM.

## Key Functions
*   `sound("name")`: Plays a specific sound (e.g., `"casio"`, `"jazz"`, `"bd"`).
*   `.bank("name")`: Changes the sound bank/drum machine (e.g., `"RolandTR909"`, `"AkaiLinn"`).
*   `n("numbers")`: Selects specific sample indices within a sound bank.
*   `setcpm(value)`: Adjusts the global tempo.

## Mini-Notation Syntax
| Concept | Syntax | Example |
| :--- | :--- | :--- |
| **Sequence** | Space separated | `sound("bd hh sd hh")` |
| **Sub-sequence** | `[ ]` brackets | `sound("bd [hh hh] sd")` |
| **Parallel** | `,` comma | `sound("bd sd, hh hh hh hh")` |
| **Rest** | `-` or `~` | `sound("bd - sd ~")` |
| **Multiplication** | `*` speed up | `sound("bd hh*4")` |
| **One per cycle** | `< >` brackets | `sound("<bd sd hh oh>")` |
| **Sample Index** | `:number` | `sound("casio:1")` |

## Code Examples
```javascript
// Basic Rock Beat
setcpm(100/4);
sound("[bd sd]*2, hh*8").bank("RolandTR505");

// Classic House
sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909");

// Using 'n' for sample selection
n("0 1 [4 2] 3*2").sound("jazz");
```
