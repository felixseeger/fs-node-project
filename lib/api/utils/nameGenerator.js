const ADJECTIVES = [
    'Ethereal', 'Neon', 'Quantum', 'Cosmic', 'Crimson', 'Latent',
    'Neural', 'Lucid', 'Radiant', 'Cyber', 'Astral', 'Kinetic',
    'Luminous', 'Spectral', 'Haptic', 'Bionic', 'Stellar', 'Void',
    'Primal', 'Fractal', 'Digital', 'Ambient', 'Dynamic', 'Static',
    'Solar', 'Lunar', 'Galactic', 'Infinite', 'Onyx', 'Synth'
];

const NOUNS = [
    'Canvas', 'Pipeline', 'Matrix', 'Vision', 'Horizon', 'Echo',
    'Prism', 'Flux', 'Aura', 'Graph', 'Node', 'Nexus', 'Vertex',
    'Pixel', 'Vector', 'Grid', 'Core', 'Pulse', 'Wave', 'Forge',
    'Engine', 'Logic', 'Stream', 'Orbit', 'Realm', 'Sphere',
    'Syntax', 'Drive', 'Spark', 'Flow', 'Board'
];

/**
 * Generates a random, visually/AI themed board name.
 * Example: "Latent-Prism-042"
 */
export function generateProjectName() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

    // Generate a 3-digit number from 000 to 999
    const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `${adj}-${noun}-${num}`;
}