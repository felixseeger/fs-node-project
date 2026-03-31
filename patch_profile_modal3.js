const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/ProfileModal.jsx', 'utf8');

// I noticed the SVG inside the search bar isn't correctly positioned inside the relative div, it's just floating in the code above the input without being contained. Wait, looking at the code I generated:
// <div style={{ position: 'relative' }}>
//   <svg ...>
//   <input ...>
// </div>
// It's correct.

// Let's add more models to the preferences default model dropdowns to satisfy "add more Models as are avaiable".
// Right now they have only one option.
const moreTextModels = `
                      <option>Claude Sonnet 4.6</option>
                      <option>GPT-4o</option>
                      <option>Gemini 1.5 Pro</option>
                      <option>Claude Opus 4.1</option>`;

const moreImageModels = `
                      <option>Flux 2</option>
                      <option>Nano Banana 2</option>
                      <option>Midjourney v6</option>
                      <option>DALL-E 3</option>`;

const moreVideoModels = `
                      <option>Seedance 1.5 Pro</option>
                      <option>Veo 3.1 Frames</option>
                      <option>Veo 3.1 Ingredients</option>
                      <option>Kling O1 Edit</option>
                      <option>Sora</option>
                      <option>Runway Gen-4</option>`;

jsx = jsx.replace(/<option>Claude Sonnet 4\.6<\/option>/g, moreTextModels);
jsx = jsx.replace(/<option>Flux 2<\/option>/g, moreImageModels);
jsx = jsx.replace(/<option>Nano Banana 2<\/option>/g, moreImageModels);
jsx = jsx.replace(/<option>Seedance 1\.5 Pro<\/option>/g, moreVideoModels);
jsx = jsx.replace(/<option>Veo 3\.1 Frames<\/option>/g, moreVideoModels);
jsx = jsx.replace(/<option>Veo 3\.1 Ingredients<\/option>/g, moreVideoModels);
jsx = jsx.replace(/<option>Kling O1 Edit<\/option>/g, moreVideoModels);

fs.writeFileSync('frontend/src/ProfileModal.jsx', jsx);
console.log("Patched Models dropdowns");
