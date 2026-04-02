const fs = require('fs');

let css = fs.readFileSync('frontend/src/ProfileModal.css', 'utf8');

const newCss = `
.pm-avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid #333;
  background: #222;
  color: #fff;
  display: flex;
  align-items: center;
  justifyContent: center;
  font-size: 32px;
  font-weight: 600;
  text-transform: uppercase;
}
`;

css = css + newCss;

fs.writeFileSync('frontend/src/ProfileModal.css', css);
console.log("Patched ProfileModal.css");
