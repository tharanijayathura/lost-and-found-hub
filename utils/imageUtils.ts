/**
 * Image Utilities
 * Functions for image compression, resizing, and processing
 */

import * as ImageManipulator from 'expo-image-manipulator';
import { AppConfig } from '../constants/AppConfig';

/**
 * Compress and resize image before upload
 */
export const compressImage = async (
  uri: string,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<string> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        { resize: { width: maxWidth, height: maxHeight } },
      ],
      {
        compress: AppConfig.ui.imageQuality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original URI if compression fails
    return uri;
  }
};

/**
 * Get image dimensions
 */
export const getImageDimensions = async (
  uri: string
): Promise<{ width: number; height: number } | null> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { format: ImageManipulator.SaveFormat.JPEG }
    );

    return {
      width: manipResult.width,
      height: manipResult.height,
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
};

/**
 * Resize image to specific dimensions
 */
export const resizeImage = async (
  uri: string,
  width: number,
  height: number
): Promise<string> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width, height } }],
      {
        compress: AppConfig.ui.imageQuality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    return uri;
  }
};

/**
 * Create thumbnail from image
 */
export const createThumbnail = async (
  uri: string,
  size: number = 200
): Promise<string> => {
  return resizeImage(uri, size, size);
};

