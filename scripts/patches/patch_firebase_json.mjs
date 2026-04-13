import fs from 'fs';
const path = 'firebase.json';
let config = JSON.parse(fs.readFileSync(path, 'utf8'));
config.storage = {
  rules: "storage.rules"
};
fs.writeFileSync(path, JSON.stringify(config, null, 2));
