import {Platform, PermissionsAndroid, Alert} from 'react-native';

/**
 * Request storage permissions for reading and writing images (Android)
 * Handles API 29 (Q) and API 33+ (READ_MEDIA_IMAGES) separately
 * @returns {Promise<boolean>} true if all granted
 */
export async function requestStoragePermissions() {
  if (Platform.OS !== 'android') {
    // iOS permissions are declared in Info.plist; no runtime request needed for photo library via picker
    return true;
  }

  try {
    const sdkVersion = Platform.Version;

    if (sdkVersion >= 33) {
      // Android 13+ (API 33): Use READ_MEDIA_IMAGES
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Media Access Required',
          message:
            'NanoImage needs access to your photos to compress and optimize images.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        },
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // Android < 13: Use READ_EXTERNAL_STORAGE + WRITE_EXTERNAL_STORAGE
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return (
        results[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        results[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
  } catch (error) {
    console.warn('[Permissions] Error requesting storage:', error);
    return false;
  }
}

/**
 * Show a user-friendly alert if permissions were denied
 */
export function showPermissionDeniedAlert() {
  Alert.alert(
    'Permission Required',
    'NanoImage needs storage access to process your images. Please enable it in Settings.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open Settings', onPress: () => {}},
    ],
  );
}
