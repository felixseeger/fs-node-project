import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we are using the correct API key from your environment
const apiKey = 'sk_live_GWSgvy7pD7pwDp5khTiVkr';

// The consistent design system style we established
const STYLE_PROMPT = "minimalist futuristic UI icon, smooth cyber-fluid liquid shapes, glowing cyan and purple gradients, dark mode aesthetic, professional vector SVG, simple clean lines, flat design, isolated on dark background";

// The 17 mapped icons for the application
const icons = [
  // Core Navigation & Menus
  { name: 'icon_upload', subject: 'folder with an up arrow symbol' },
  { name: 'icon_workflow', subject: 'lightning bolt flash symbol' },
  { name: 'icon_library', subject: 'grid of 4 squares symbol' },
  { name: 'icon_community', subject: 'wireframe globe planet symbol' },
  { name: 'icon_history', subject: 'rewind clock time symbol' },
  { name: 'icon_profile', subject: 'abstract user avatar portrait symbol' },

  // Node Categories (Quick Add)
  { name: 'icon_text', subject: 'stylized letter T symbol' },
  { name: 'icon_image', subject: 'glowing picture frame mountain symbol' },
  { name: 'icon_video', subject: 'play button film strip symbol' },
  { name: 'icon_audio', subject: 'sound audio waveform symbol' },
  { name: 'icon_ai_model', subject: 'neural brain with sparkles symbol' },
  { name: 'icon_condition', subject: 'branching logic split path symbol' },

  // Utilities & Actions
  { name: 'icon_layer', subject: 'stacked floating squares symbol' },
  { name: 'icon_router', subject: 'split branching arrows symbol' },
  { name: 'icon_magic', subject: 'magic wand with sparkles symbol' },
  { name: 'icon_plus', subject: 'glowing plus add symbol' },
  { name: 'icon_close', subject: 'glowing X close symbol' }
];

// Helper for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateAllIcons() {
  const outDir = path.join(__dirname, '../frontend/src/assets/icons');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`🎨 Starting generation of ${icons.length} Neon Cyber-Fluid icons...`);
  console.log(`📁 Output directory: ${outDir}\n`);

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    console.log(`[${i + 1}/${icons.length}] Generating ${icon.name}...`);
    
    try {
      const res = await fetch('https://api.quiver.ai/v1/svgs/generations', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${apiKey}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          model: 'arrow-preview', 
          stream: false, 
          prompt: `${icon.subject}, ${STYLE_PROMPT}` 
        })
      });

      const data = await res.json();
      
      if (data.data?.data?.[0]?.svg) {
        const filePath = path.join(outDir, `${icon.name}.svg`);
        fs.writeFileSync(filePath, data.data.data[0].svg);
        console.log(`   ✅ Saved ${icon.name}.svg`);
      } else {
        console.error(`   ❌ Failed to generate ${icon.name}. API returned unexpected format.`);
        if (data.error) console.error(`   Error details:`, data.error);
      }
    } catch (error) {
      console.error(`   ❌ Network/Execution Error on ${icon.name}:`, error.message);
    }

    // Wait 3 seconds between requests to prevent rate limiting or connection drops
    if (i < icons.length - 1) {
      console.log(`   ⏳ Waiting 3 seconds before next request...`);
      await delay(3000);
    }
  }
  
  console.log('\n🎉 Icon generation script finished!');
  console.log('You can now drag and drop the generated SVGs from frontend/src/assets/icons/ directly into Figma.');
}

generateAllIcons().catch(console.error);
