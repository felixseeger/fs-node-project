/**
 * History Service
 * Manages generated images/videos in localStorage for search and reuse
 */

const STORAGE_KEY = 'ai_pipeline_history';
const MAX_ITEMS = 500; // Maximum number of history items to store

/**
 * Generate a unique ID for history items
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all history items from localStorage
 * @returns {Array} Array of history items
 */
export function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

/**
 * Save history items to localStorage
 * @param {Array} items - Array of history items
 */
function saveHistory(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving history:', error);
    // If storage is full, remove oldest items and try again
    if (error.name === 'QuotaExceededError') {
      const reduced = items.slice(-Math.floor(MAX_ITEMS / 2));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
      } catch (e) {
        console.error('Still unable to save history:', e);
      }
    }
  }
}

/**
 * Add a new item to history
 * @param {Object} item - The history item to add
 * @param {string} item.type - Type: 'image', 'video', 'audio', 'svg'
 * @param {string} item.url - The data URL or blob URL
 * @param {string} item.prompt - The prompt used to generate
 * @param {string} item.nodeType - The node type that generated it
 * @param {string} item.nodeLabel - The node label
 * @returns {Object} The created history item with ID
 */
export function addToHistory(item) {
  const history = getHistory();
  
  const newItem = {
    id: generateId(),
    type: item.type || 'image',
    url: item.url,
    prompt: item.prompt || '',
    nodeType: item.nodeType || 'unknown',
    nodeLabel: item.nodeLabel || 'Unknown',
    createdAt: new Date().toISOString(),
  };
  
  // Add to beginning of array (newest first)
  history.unshift(newItem);
  
  // Limit to MAX_ITEMS
  if (history.length > MAX_ITEMS) {
    history.pop();
  }
  
  saveHistory(history);
  return newItem;
}

/**
 * Remove an item from history
 * @param {string} id - The ID of the item to remove
 */
export function removeFromHistory(id) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  saveHistory(filtered);
}

/**
 * Clear all history
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Search history items
 * @param {string} query - Search query string
 * @returns {Array} Filtered history items
 */
export function searchHistory(query) {
  const history = getHistory();
  if (!query || query.trim() === '') {
    return history;
  }
  
  const lowerQuery = query.toLowerCase();
  return history.filter(item => 
    (item.prompt && item.prompt.toLowerCase().includes(lowerQuery)) ||
    (item.nodeLabel && item.nodeLabel.toLowerCase().includes(lowerQuery)) ||
    (item.nodeType && item.nodeType.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get history items by type
 * @param {string} type - Type to filter by
 * @returns {Array} Filtered history items
 */
export function getHistoryByType(type) {
  const history = getHistory();
  return history.filter(item => item.type === type);
}

/**
 * Download a history item
 * @param {string} id - The ID of the item to download
 */
export function downloadHistoryItem(id) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  
  if (!item || !item.url) {
    console.error('History item not found or has no URL');
    return;
  }
  
  const extension = item.type === 'svg' ? 'svg' : 
                    item.type === 'video' ? 'mp4' : 
                    item.type === 'audio' ? 'mp3' : 'png';
  
  const filename = `${item.nodeLabel.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${extension}`;
  
  const link = document.createElement('a');
  link.href = item.url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get stats about history
 * @returns {Object} Stats object
 */
export function getHistoryStats() {
  const history = getHistory();
  return {
    total: history.length,
    byType: history.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {}),
    oldest: history[history.length - 1]?.createdAt,
    newest: history[0]?.createdAt,
  };
}
