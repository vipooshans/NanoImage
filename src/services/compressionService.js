import {Image} from 'react-native-compressor';
import {getFileSize, generateOutputPath, getExtension} from './fileService';

/**
 * Compress a single image with adjustable quality
 * @param {string} imageUri - source image URI
 * @param {number} quality - compression quality 1-100
 * @param {'jpeg'|'png'|'webp'} [outputFormat] - optional output format override
 * @returns {Promise<{outputUri: string, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(imageUri, quality = 80, outputFormat = null) {
  const ext = outputFormat || getExtension(imageUri) || 'jpg';
  const normalizedExt = ext === 'jpg' ? 'jpeg' : ext;

  // Get original file size before compression
  const originalSize = await getFileSize(imageUri);

  // Determine compressor format type
  let compressionType = 'jpeg';
  if (normalizedExt === 'png') compressionType = 'png';
  else if (normalizedExt === 'webp') compressionType = 'webp';

  const outputPath = generateOutputPath('compressed', compressionType === 'jpeg' ? 'jpg' : compressionType);

  const result = await Image.compress(imageUri, {
    compressionMethod: 'auto',
    quality: quality / 100, // compressor expects 0-1
    output: compressionType,
    returnableOutputType: 'uri',
  });

  const compressedSize = await getFileSize(result);

  return {
    outputUri: result,
    originalSize,
    compressedSize,
    quality,
    format: compressionType,
  };
}

/**
 * Get an estimated preview of compression at given quality (quick)
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
