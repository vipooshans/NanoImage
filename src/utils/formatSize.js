/**
 * Format byte count to human-readable string
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatSize(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Calculate percentage reduction between two sizes
 * @param {number} original - original file size in bytes
 * @param {number} compressed - compressed file size in bytes
 * @returns {string} e.g. "72.4%"
 */
export function calcReduction(original, compressed) {
  if (!original || original === 0) return '0%';
  const reduction = ((original - compressed) / original) * 100;
  return `${Math.max(0, reduction).toFixed(1)}%`;
}

/**
 * Calculate percentage reduction as a number (0-100)
 * @param {number} original
 * @param {number} compressed
 * @returns {number}
 */
export function calcReductionNumber(original, compressed) {
  if (!original || original === 0) return 0;
  return Math.max(0, ((original - compressed) / original) * 100);
}

/**
 * Determine color coding for reduction percentage
 * @param {number} percent - reduction as 0-100 number
 * @returns {'green'|'cyan'|'orange'|'red'}
 */
export function reductionColor(percent) {
  if (percent >= 60) return 'green';
  if (percent >= 30) return 'cyan';
  if (percent >= 10) return 'orange';
  return 'red';
}
