const fs = require('fs');

let css = fs.readFileSync('frontend/src/ProfileModal.css', 'utf8');

css = css.replace(/justifyContent:/g, 'justify-content:');

fs.writeFileSync('frontend/src/ProfileModal.css', css);

let jsx = fs.readFileSync('frontend/src/ProfileModal.jsx', 'utf8');

jsx = jsx.replace(
  /const \[avatar, setAvatar\] = useState\('\/intro_img\.jpg'\);/,
  `const [avatar, setAvatar] = useState(null);`
);

fs.writeFileSync('frontend/src/ProfileModal.jsx', jsx);
console.log("Patched avatar CSS and initial state");
