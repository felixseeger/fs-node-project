import fs from 'fs';

let rules = fs.readFileSync('storage.rules', 'utf8');

const workflowRules = `

    // Workflows thumbnails and media:
    match /workflows/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
`;

if (!rules.includes('match /workflows/')) {
  rules = rules.replace('// Default deny for everything else', workflowRules + '\n    // Default deny for everything else');
  fs.writeFileSync('storage.rules', rules);
  console.log("Patched storage.rules with workflows rule.");
} else {
  console.log("storage.rules already has workflows rule.");
}
