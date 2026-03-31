const fs = require('fs');
let css = fs.readFileSync('frontend/src/ProfileModal.css', 'utf8');

const cssToAdd = `
.pm-preferences-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #E0E0E0;
  font-family: 'Inter', system-ui, sans-serif;
}

.pm-preferences-desc {
  font-size: 14px;
  color: #999;
  margin: 0;
  margin-top: -16px;
}

.pm-pref-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pm-pref-section h3 {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
}

.pm-pref-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pm-pref-row-compact {
  padding-top: 4px;
  padding-bottom: 4px;
}

.pm-pref-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pm-pref-text label {
  font-size: 13px;
  font-weight: 500;
  color: #E0E0E0;
}

.pm-pref-text span {
  font-size: 12px;
  color: #999;
}

/* Toggle Switch Styles */
.pm-toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
}

.pm-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.pm-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  transition: .2s;
  border-radius: 20px;
}

.pm-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .2s;
  border-radius: 50%;
}

input:checked + .pm-slider {
  background-color: #00FF7F; /* Vibrant green */
}

input:focus + .pm-slider {
  box-shadow: 0 0 1px #00FF7F;
}

input:checked + .pm-slider:before {
  transform: translateX(16px);
}

/* Select Dropdown Styles */
.pm-select {
  background-color: #1a1a1a;
  color: #E0E0E0;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  appearance: none;
  min-width: 160px;
  background-image: url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
}

.pm-select:focus {
  border-color: #555;
}

/* Sub-sections */
.pm-pref-subsection {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.pm-pref-subsection h4 {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.pm-pref-subdesc {
  font-size: 12px;
  color: #999;
  margin: 0 0 4px 0;
}
`;

fs.appendFileSync('frontend/src/ProfileModal.css', "\n" + cssToAdd);
console.log("Patched ProfileModal.css");
