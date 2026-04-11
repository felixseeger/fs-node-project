import re

with open("frontend/src/GooeyNodesMenu.css", "a") as f:
    f.write("""
/* ── Help Menu Panel ── */
.ms-help-panel {
  position: absolute;
  left: 80px;
  bottom: 50px;
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  width: 260px;
  color: #fff;
  opacity: 0;
  transform: translateX(-10px) translateY(10px);
  pointer-events: none;
  transition: all 0.2s ease;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  z-index: 1500;
  display: flex;
  flex-direction: column;
}

.ms-help-panel.active {
  opacity: 1;
  transform: translateX(0) translateY(0);
  pointer-events: auto;
}

.ms-help-section {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ms-help-section:last-child {
  border-bottom: none;
}

.ms-help-link {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  text-decoration: none;
  color: #e0e0e0;
  transition: background 0.2s;
  font-size: 13px;
  font-weight: 500;
}

.ms-help-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.ms-help-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #a0a0a0;
}

.ms-help-icon svg {
  width: 16px;
  height: 16px;
}

.ms-help-text {
  flex-grow: 1;
}

.ms-help-external svg {
  width: 14px;
  height: 14px;
  color: #888;
  opacity: 0.6;
}

.ms-help-shortcut {
  font-size: 11px;
  color: #888;
  background: rgba(255,255,255,0.05);
  padding: 2px 6px;
  border-radius: 4px;
}

.ms-help-socials {
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  padding: 16px 12px;
}

.ms-social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0a0a0;
  transition: color 0.2s;
}

.ms-social-icon:hover {
  color: #fff;
}

.ms-social-icon svg {
  width: 20px;
  height: 20px;
}

.ms-help-footer {
  gap: 2px;
  padding: 16px 16px;
}

.ms-help-version {
  font-size: 13px;
  font-weight: 600;
  color: #e0e0e0;
}

.ms-help-date {
  font-size: 12px;
  color: #888;
}
""")
