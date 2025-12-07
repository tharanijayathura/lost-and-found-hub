/**
 * Validation Utilities
 * Reusable validation functions for forms and inputs
 */

import { AppConfig } from '../constants/AppConfig';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: AppConfig.errors.general.required };
  }

  if (!AppConfig.validation.emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length === 0) {
    return { isValid: false, error: AppConfig.errors.general.required };
  }

  if (password.length < AppConfig.user.minPasswordLength) {
    return {
      isValid: false,
      error: `Password must be at least ${AppConfig.user.minPasswordLength} characters long.`,
    };
  }

  return { isValid: true };
};

/**
 * Validate name
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: AppConfig.errors.general.required };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long.' };
  }

  if (name.length > AppConfig.user.maxNameLength) {
    return {
      isValid: false,
      error: `Name must be less than ${AppConfig.user.maxNameLength} characters.`,
    };
  }

  return { isValid: true };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: true }; // Phone is optional
  }

  if (!AppConfig.validation.phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number.' };
  }

  return { isValid: true };
};

/**
 * Validate item title
 */
export const validateItemTitle = (title: string): ValidationResult => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: AppConfig.errors.general.required };
  }

  if (title.trim().length < 3) {
    return { isValid: false, error: 'Title must be at least 3 characters long.' };
  }

  if (title.length > AppConfig.item.maxTitleLength) {
    return {
      isValid: false,
      error: `Title must be less than ${AppConfig.item.maxTitleLength} characters.`,
    };
  }

  return { isValid: true };
};

/**
 * Validate item description
 */
export const validateItemDescription = (description: string): ValidationResult => {
  if (!description) {
    return { isValid: true }; // Description is optional
  }

  if (description.length > AppConfig.item.maxDescriptionLength) {
    return {
      isValid: false,
      error: `Description must be less than ${AppConfig.item.maxDescriptionLength} characters.`,
    };
  }

  return { isValid: true };
};

/**
 * Validate item location
 */
export const validateItemLocation = (location: string): ValidationResult => {
  if (!location || location.trim().length === 0) {
    return { isValid: false, error: AppConfig.errors.general.required };
  }

  if (location.trim().length < 3) {
    return { isValid: false, error: 'Location must be at least 3 characters long.' };
  }

  return { isValid: true };
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDate = (date: string): ValidationResult => {
  if (!date || date.trim().length === 0) {
    return { isValid: true }; // Date is optional
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { isValid: false, error: 'Please enter a valid date (YYYY-MM-DD).' };
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Please enter a valid date.' };
  }

  // Check if date is not in the future
  if (dateObj > new Date()) {
    return { isValid: false, error: 'Date cannot be in the future.' };
  }

  return { isValid: true };
};

/**
 * Validate image file
 */
export const validateImage = (uri: string, size?: number): ValidationResult => {
  if (!uri) {
    return { isValid: true }; // Image is optional
  }

  if (size && size > AppConfig.item.maxImageSize) {
    return {
      isValid: false,
      error: `Image size must be less than ${AppConfig.item.maxImageSize / 1024 / 1024}MB.`,
    };
  }

  // Check if it's a valid image URL or local file
  const isUrl = uri.startsWith('http://') || uri.startsWith('https://');
  const isLocal = uri.startsWith('file://') || uri.startsWith('content://');
  
  if (!isUrl && !isLocal) {
    return { isValid: false, error: 'Invalid image path.' };
  }

  return { isValid: true };
};

/**
 * Validate multiple fields at once
 */
export const validateFields = (
  fields: Record<string, ValidationResult>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.entries(fields).forEach(([key, result]) => {
    if (!result.isValid) {
      isValid = false;
      if (result.error) {
        errors[key] = result.error;
      }
    }
  });

  return { isValid, errors };
};

