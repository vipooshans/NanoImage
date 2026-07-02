import ImageResizer from 'react-native-image-resizer';
import {getFileSize, getExtension, getMimeType} from './fileService';

/**
 * Resize an image to custom dimensions
 * @param {string} imageUri - source image URI
 * @param {number} width - target width in pixels
 * @param {number} height - target height in pixels
 * @param {number} quality - output quality 1-100
 * @param {'JPEG'|'PNG'|'WEBP'} [format] - output format
 * @returns {Promise<{outputUri: string, originalSize: number, resizedSize: number, width: number, height: number}>}
 */
export async function resizeImage(
  imageUri,
  width,
  height,
  quality = 85,
  format = 'JPEG',
) {
  const originalSize = await getFileSize(imageUri);

  const response = await ImageResizer.createResizedImage(
    imageUri,
    width,
    height,
    format,
    quality,
    0,         // rotation
    undefined, // outputPath (use temp)
    false,     // keepMeta
    {
      mode: 'contain',
      onlyScaleDown: false,
    },
  );

  const resizedSize = await getFileSize(response.uri);

  return {
    outputUri: response.uri,
    originalSize,
    resizedSize,
    width: response.width,
    height: response.height,
    format: format.toLowerCase(),
  };
}

/**
 * Calculate proportional height given original dimensions and target width
 * @param {number} origWidth
 * @param {number} origHeight
 * @param {number} targetWidth
 * @returns {number} calculated height
 */
export function calcProportionalHeight(origWidth, origHeight, targetWidth) {
  if (!origWidth) return 0;
  return Math.round((origHeight / origWidth) * targetWidth);
}

/**
 * Calculate proportional width given original dimensions and target height
 * @param {number} origWidth
 * @param {number} origHeight
 * @param {number} targetHeight
 * @returns {number} calculated width
 */
export function calcProportionalWidth(origWidth, origHeight, targetHeight) {
  if (!origHeight) return 0;
  return Math.round((origWidth / origHeight) * targetHeight);
}
