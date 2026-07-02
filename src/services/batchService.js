import {compressImage} from './compressionService';
import {getFileSize} from './fileService';

/**
 * @typedef {Object} BatchItem
 * @property {string} uri - source image URI
 * @property {string} name - display filename
 * @property {'pending'|'processing'|'done'|'error'} status
 * @property {number} [originalSize]
 * @property {number} [compressedSize]
 * @property {string} [outputUri]
 * @property {string} [error]
 */

/**
 * Process a batch of images sequentially with progress callbacks
 * @param {BatchItem[]} items - array of images to process
 * @param {number} quality - compression quality 1-100
 * @param {object} callbacks
 * @param {(index: number, item: BatchItem) => void} callbacks.onItemStart - called when each item starts
 * @param {(index: number, item: BatchItem) => void} callbacks.onItemComplete - called when each item finishes
 * @param {(progress: number) => void} callbacks.onProgress - overall progress 0-1
 * @param {() => boolean} callbacks.isCancelled - return true to abort
 * @returns {Promise<BatchItem[]>} processed items with results
 */
export async function processBatch(items, quality = 80, callbacks = {}) {
  const {onItemStart, onItemComplete, onProgress, isCancelled} = callbacks;
  const results = [...items];

  for (let i = 0; i < items.length; i++) {
    // Check cancellation before each item
    if (isCancelled && isCancelled()) {
      break;
    }

    const item = items[i];

    // Mark as processing
    results[i] = {...item, status: 'processing'};
    onItemStart && onItemStart(i, results[i]);

    try {
      const originalSize = await getFileSize(item.uri);
      const compressed = await compressImage(item.uri, quality);

      results[i] = {
        ...results[i],
        status: 'done',
        originalSize,
        compressedSize: compressed.compressedSize,
        outputUri: compressed.outputUri,
      };
    } catch (error) {
      results[i] = {
        ...results[i],
        status: 'error',
        error: error.message || 'Compression failed',
      };
    }

    onItemComplete && onItemComplete(i, results[i]);
    onProgress && onProgress((i + 1) / items.length);
  }

  return results;
}

/**
 * Calculate batch summary statistics
 * @param {BatchItem[]} results
 * @returns {{totalOriginal: number, totalCompressed: number, successCount: number, errorCount: number}}
 */
export function getBatchSummary(results) {
  return results.reduce(
    (acc, item) => {
      if (item.status === 'done') {
        acc.successCount++;
        acc.totalOriginal += item.originalSize || 0;
        acc.totalCompressed += item.compressedSize || 0;
      } else if (item.status === 'error') {
        acc.errorCount++;
      }
      return acc;
    },
    {totalOriginal: 0, totalCompressed: 0, successCount: 0, errorCount: 0},
  );
}
