/**
 * Pure utility functions shared between app.js and tests.
 */

/**
 * Clamps a numeric value between min and max (inclusive).
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a short random string suitable for use as a task ID.
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Minimal HTML escaping to prevent XSS from user-supplied strings.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Export for Node.js (tests); in the browser these are global via <script>.
if (typeof module !== 'undefined') {
  module.exports = { clamp, generateId, escapeHtml };
}
