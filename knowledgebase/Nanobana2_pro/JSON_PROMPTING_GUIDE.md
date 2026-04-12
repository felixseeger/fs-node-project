# Nano Banana 2 Pro: JSON Prompting Guide
**Source:** [Nano Banana 2: The JSON Control Hack](https://www.youtube.com/watch?v=uQc4TGhvDHc)

The "JSON Control Hack" in Nano Banana 2 allows users and autonomous agents to move beyond descriptive prose and use structured data to control the latent space. This guide outlines the syntax and supported attributes.

## 1. Basic Structure
To trigger the JSON interpreter, the prompt should begin or end with a code block or a raw JSON object. The model prioritizes these structured fields over natural language descriptions.

```json
{
  "subject": "Cyberpunk character",
  "action": "walking through neon rain",
  "composition": "low angle, wide shot",
  "lighting": {
    "type": "rim light",
    "color": "#00f2ff",
    "intensity": 0.8
  }
}
```

## 2. Supported Global Attributes
| Field | Description | Supported Values |
| :--- | :--- | :--- |
| `subject` | Primary focus of the image | String (e.g., "Futuristic car") |
| `environment` | Background and setting | String |
| `style` | Artistic direction | "cinematic", "photorealistic", "vector", "3d-render" |
| `aspect_ratio` | Frame dimensions | "16:9", "4:3", "1:1", "9:16" |
| `fidelity` | Level of detail | 1-100 (Default: 80) |

## 3. Advanced Environment & Lighting
The model understands a nested `lighting` object for granular control:
*   **`lighting.type`**: "soft", "hard", "volumetric", "neon", "golden_hour".
*   **`lighting.direction`**: "top", "side", "back", " Rembrandt".
*   **`atmosphere`**: "foggy", "clear", "hazy", "particle_effects".

## 4. Layer & Layout Control (Agentic Mode)
For node-based workflows, you can define specific spatial coordinates:
```json
{
  "layers": [
    { "id": "bg", "content": "distant mountains", "blur": 5 },
    { "id": "fg", "content": "lone hiker", "position": "center-bottom" }
  ]
}
```

## 5. Best Practices
1.  **Property Over Prose**: Use `"color": "crimson"` instead of "a deep red color".
2.  **Hex Codes**: The model supports hex codes for precise color matching.
3.  **Intensity Scaling**: Fields like `intensity` or `bloom` accept values from 0.0 to 1.0.
4.  **Hybrid Approach**: You can combine a standard text prompt with a JSON block to refine specific details.

---
*Created for the Weavy Knowledge Base - 2026-04-12.*
