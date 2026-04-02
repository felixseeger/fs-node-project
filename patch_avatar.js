const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/ProfileModal.jsx', 'utf8');

// 1. Add state and ref for the avatar
const stateAddition = `const [avatar, setAvatar] = useState('/intro_img.jpg');\n  const fileInputRef = React.useRef(null);\n\n  const handleAvatarClick = () => {\n    fileInputRef.current?.click();\n  };\n\n  const handleFileChange = (e) => {\n    const file = e.target.files[0];\n    if (file) {\n      const reader = new FileReader();\n      reader.onload = (ev) => {\n        setAvatar(ev.target.result);\n      };\n      reader.readAsDataURL(file);\n    }\n  };`;

jsx = jsx.replace(
  /export default function ProfileModal\(\{ isOpen, onClose \}\) \{/,
  `export default function ProfileModal({ isOpen, onClose }) {\n  ${stateAddition}`
);

// 2. Replace the static img and edit button
const newAvatarHtml = `<div className="pm-avatar-container">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept="image/*" 
                />
                {avatar ? (
                  <img src={avatar} alt="Profile" className="pm-avatar-img" />
                ) : (
                  <div className="pm-avatar-placeholder">FS</div>
                )}
                <button className="pm-edit-btn" onClick={handleAvatarClick}>Edit</button>
              </div>`;

jsx = jsx.replace(
  /<div className="pm-avatar-container">\s*<img src="\/ref\/gen-ai\.jpg" alt="Profile" className="pm-avatar-img" \/>\s*<button className="pm-edit-btn">Edit<\/button>\s*<\/div>/,
  newAvatarHtml
);

fs.writeFileSync('frontend/src/ProfileModal.jsx', jsx);
console.log("Patched avatar logic in ProfileModal.jsx");
