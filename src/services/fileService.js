import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

/**
 * Get the size of a file in bytes
 * @param {string} filePath - absolute file path
 * @returns {Promise<number>} size in bytes
 */
export async function getFileSize(filePath) {
  try {
    const stat = await RNFS.stat(filePath);
    return stat.size;
  } catch (error) {
    console.warn('[FileService] getFileSize error:', error);
    return 0;
  }
}

/**
 * Get file extension from path/uri
 * @param {string} path
 * @returns {string} e.g. 'jpg', 'png'
 */
export function getExtension(path) {
  if (!path) return '';
  const parts = path.split('.');
  return parts[parts.length - 1].toLowerCase().replace(/\?.*$/, '');
}

/**
 * Get MIME type from extension
 * @param {string} ext
 * @returns {string}
 */
export function getMimeType(ext) {
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
  };
  return map[ext?.toLowerCase()] || 'image/jpeg';
}

/**
 * Generate a unique output file path in the app's cache directory
 * @param {string} prefix - e.g. 'compressed', 'resized', 'converted'
 * @param {string} ext - e.g. 'jpg', 'png', 'webp'
 * @returns {string} absolute path
 */
export function generateOutputPath(prefix = 'output', ext = 'jpg') {
  const dir = RNFS.CachesDirectoryPath;
  const timestamp = Date.now();
  return `${dir}/nanoimage_${prefix}_${timestamp}.${ext}`;
}

/**
 * Copy a processed file to the device's Pictures/NanoImage folder (Android)
 * or DocumentsDirectory (iOS)
 * @param {string} sourcePath - processed file path
 * @param {string} filename - desired filename with extension
 * @returns {Promise<string>} saved file path
 */
export async function saveToGallery(sourcePath, filename) {
  try {
    let destDir;
    if (Platform.OS === 'android') {
      destDir = `${RNFS.PicturesDirectoryPath}/NanoImage`;
    } else {
      destDir = `${RNFS.DocumentDirectoryPath}/NanoImage`;
    }

    // Ensure directory exists
    const dirExists = await RNFS.exists(destDir);
    if (!dirExists) {
      await RNFS.mkdir(destDir);
    }

    const destPath = `${destDir}/${filename}`;
    await RNFS.copyFile(sourcePath, destPath);

    // On Android, scan the file so it appears in Gallery
    if (Platform.OS === 'android') {
      await RNFS.scanFile(destPath);
    }

    return destPath;
  } catch (error) {
    console.warn('[FileService] saveToGallery error:', error);
    throw new Error('Failed to save image to gallery.');
  }
}

/**
 * Clean up temp cache files older than 1 hour
 */
export async function cleanCache() {
  try {
    const cacheDir = RNFS.CachesDirectoryPath;
    const items = await RNFS.readDir(cacheDir);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const item of items) {
      if (item.name.startsWith('nanoimage_')) {
        const mtime = new Date(item.mtime).getTime();
        if (mtime < oneHourAgo) {
          await RNFS.unlink(item.path);
        }
      }
    }
  } catch (error) {
    // Non-critical, fail silently
    console.warn('[FileService] cleanCache error:', error);
  }
}
