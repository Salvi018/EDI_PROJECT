// CODECADE Configuration
// Centralized configuration for API URLs

// Auto-detect API URL (works for both local and production)
const getAPIBase = () => {
  // If we're in production (hosted), use current origin
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  // Local development
  return 'http://localhost:8080';
};

const API_BASE = getAPIBase();
const API_URL = API_BASE;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE, API_URL };
}

