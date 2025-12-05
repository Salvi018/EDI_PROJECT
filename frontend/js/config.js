// CODECADE Configuration
// Centralized configuration for API URLs and environment settings

// Auto-detect API URL based on environment
const getAPIBase = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production environment (deployed on server)
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `${protocol}//${window.location.host}`;
  }

  // Local development - detect Flask backend port
  // Default to 5000 for Flask backend
  return `${protocol}//localhost:5000`;
};

const API_BASE = getAPIBase();

// Development helper to see which API is being used
console.log(`🔌 API Base URL: ${API_BASE}`);

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { API_BASE };
}
