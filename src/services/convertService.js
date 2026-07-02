import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Image as RNImage} from 'react-native';
import {getFileSize} from './fileService';

const FORMAT_MAP = {
  jpeg: 'JPEG',
  jpg: 'JPEG',
  png: 'PNG',
  webp: 'WEBP',
};

/**
 * Convert an image to a different format
 * Uses react-native-image-resizer v1.4.x API
 * @param {string} imageUri - source image URI
 * @param {'jpeg'|'png'|'webp'} targetFormat
 * @param {number} quality - 1-100
 * @returns {Promise<{outputUri, originalSize, convertedSize, format}>}
 */
export async function convertImage(imageUri, targetFormat = 'jpeg', quality = 90) {
  const originalSize = await getFileSize(imageUri);

  const dimensions = await getImageDimensions(imageUri);
  const width = dimensions.width || 1920;
  const height = dimensions.height || 1080;

  const resizerFormat = FORMAT_MAP[targetFormat.toLowerCase()] || 'JPEG';

  // v1.4.x API: createResizedImage(path, maxWidth, maxHeight, format, quality, rotation, outputPath)
  const response = await ImageResizer.createResizedImage(
    imageUri,
    width,
    height,
    resizerFormat,
    quality,
    0,
    undefined,
  );

  const convertedSize = await getFileSize(response.uri);

  return {
    outputUri: response.uri,
    originalSize,
    convertedSize,
    format: targetFormat.toLowerCase(),
    width: response.width,
    height: response.height,
  };
}

/**
 * Get image dimensions via React Native's Image.getSize
 * @param {string} uri
 * @returns {Promise<{width: number, height: number}>}
 */
function getImageDimensions(uri) {
  return new Promise(resolve => {
    RNImage.getSize(
      uri,
      (w, h) => resolve({width: w, height: h}),
      () => resolve({width: 1920, height: 1080}),
    );
  });
}

/**
 * Returns supported target formats for a given source format
 * @param {string} sourceExt
 * @returns {string[]}
 */
export function getAvailableFormats(sourceExt) {
  const all = ['jpeg', 'png', 'webp'];
  const src = sourceExt?.toLowerCase().replace('jpg', 'jpeg');
  return all.filter(f => f !== src);
}

/**
 * Human-readable format labels
 */
export const FORMAT_LABELS = {
  jpeg: 'JPEG',
  png: 'PNG',
  webp: 'WebP',
};
