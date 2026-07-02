import ImageResizer from 'react-native-image-resizer';
import {Image as ImageInfo} from 'react-native';
import {getFileSize} from './fileService';

const FORMAT_MAP = {
  jpeg: 'JPEG',
  jpg: 'JPEG',
  png: 'PNG',
  webp: 'WEBP',
};

/**
 * Convert an image to a different format
 * @param {string} imageUri - source image URI
 * @param {'jpeg'|'png'|'webp'} targetFormat - desired output format
 * @param {number} quality - 1-100
 * @returns {Promise<{outputUri: string, originalSize: number, convertedSize: number, format: string}>}
 */
export async function convertImage(imageUri, targetFormat = 'jpeg', quality = 90) {
  const originalSize = await getFileSize(imageUri);

  // Get image dimensions so we can preserve them
  const dimensions = await getImageDimensions(imageUri);
  const width = dimensions.width || 1920;
  const height = dimensions.height || 1080;

  const resizerFormat = FORMAT_MAP[targetFormat.toLowerCase()] || 'JPEG';

  const response = await ImageResizer.createResizedImage(
    imageUri,
    width,
    height,
    resizerFormat,
    quality,
    0,
    undefined,
    false,
    {mode: 'contain', onlyScaleDown: false},
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
    ImageInfo.getSize(
      uri,
      (w, h) => resolve({width: w, height: h}),
      () => resolve({width: 1920, height: 1080}), // fallback
    );
  });
}

/**
 * Returns supported target formats for a given source format
 * @param {string} sourceExt - e.g. 'jpg', 'png', 'webp'
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
