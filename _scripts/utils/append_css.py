css = """
/* ── Assets Browser ── */
.ms-assets-browser {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ms-assets-tabs {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
}

.ms-asset-tab {
  background: transparent;
  border: none;
  color: #888;
  font-size: 13px;
  font-weight: 500;
  padding: 0 0 12px 0;
  cursor: pointer;
  position: relative;
}

.ms-asset-tab.active {
  color: #fff;
}

.ms-asset-tab::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: transparent;
}

.ms-asset-tab.active::after {
  background: #fff;
}

.ms-assets-title {
  font-size: 13px;
  color: #888;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ms-assets-title span {
  background: rgba(255,255,255,0.1);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  color: #ccc;
}

.ms-assets-grid {
  display: flex;
  gap: 12px;
}

.ms-asset-card {
  width: 130px;
  height: 130px;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  color: #e0e0e0;
  transition: all 0.2s ease;
}

.ms-asset-card:hover {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.ms-asset-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ms-asset-icon svg {
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.ms-asset-label {
  font-size: 12px;
  font-weight: 500;
}
"""

with open("frontend/src/GooeyNodesMenu.css", "a") as f:
    f.write(css)
