import re

with open("frontend/src/GooeyNodesMenu.css", "r") as f:
    css = f.read()

# Replace everything from .ms-nav-container up to /* ── Liquid Connection Logic (The Stretch) ── */
# with our new flexbox setup.

new_css = """
.ms-nav-container {
  position: relative;
  width: 75px;
}

.ms-nav {
  position: relative;
  margin: 0;
  padding: 16px 0;
  list-style: none;
  background: var(--ms-glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 40px;
  z-index: 100;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 400px;
}

.ms-li {
  display: flex;
  justify-content: center;
  z-index: 1;
  width: 100%;
}

.ms-li a, .ms-li button {
  background: transparent;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #e0e0e0;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  border: none;
  cursor: pointer;
  padding: 0;
}

.ms-li a.active {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
}

.ms-li a:hover, .ms-li button:hover {
  background: rgba(255,255,255,0.05);
  color: #ffffff;
}

.ms-li.ms-main-toggle button {
  background: #ffffff;
  color: #000;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.ms-li.ms-main-toggle button:hover {
  background: #ffffff;
  transform: scale(1.05);
}

.ms-li svg {
  width: 24px;
  height: 24px;
}

.ms-spacer {
  flex-grow: 1;
}

.ms-divider {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
}

.ms-divider-line {
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.ms-avatar a {
  border-radius: 50%;
  overflow: hidden;
}

.ms-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Liquid Connection Logic (The Stretch) ── */
"""

import re
css = re.sub(r'\.ms-nav-container \{.*?(?=\/\* ── Liquid Connection Logic \(The Stretch\) ── \*\/)', new_css, css, flags=re.DOTALL)

with open("frontend/src/GooeyNodesMenu.css", "w") as f:
    f.write(css)
