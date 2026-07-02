import {Image} from 'react-native-compressor';
import {getFileSize, getExtension} from './fileService';

/**
 * Compress a single image with adjustable quality
 * Supports react-native-compressor v2.x
 * @param {string} imageUri - source image URI
 * @param {number} quality - compression quality 1-100
 * @param {'jpeg'|'png'|'webp'} [outputFormat] - optional output format override
 * @returns {Promise<{outputUri: string, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(imageUri, quality = 80, outputFormat = null) {
  // Get original file size before compression
  const originalSize = await getFileSize(imageUri);

  const ext = outputFormat || getExtension(imageUri) || 'jpeg';
  const normalizedExt = ext === 'jpg' ? 'jpeg' : ext;

  // react-native-compressor v2 API
  const result = await Image.compress(imageUri, {
    compressionMethod: 'auto',
    quality: quality / 100,  // expects 0-1
    output: normalizedExt === 'webp' ? 'webp' : normalizedExt === 'png' ? 'png' : 'jpg',
    returnableOutputType: 'uri',
    progressDivider: 10,
  });

  const compressedSize = await getFileSize(result);

  return {
    outputUri: result,
    originalSize,
    compressedSize,
    quality,
    format: normalizedExt,
  };
}

/**
 * Get an estimated preview of compression at given quality
 * @param {string} imageUri
 * @param {number} quality
 * @returns {Promise<number>} estimated compressed size in bytes
 */
export async function estimateCompressedSize(imageUri, quality) {
  try {
    const result = await compressImage(imageUri, quality);
    return result.compressedSize;
  } catch {
    return 0;
  }
}
