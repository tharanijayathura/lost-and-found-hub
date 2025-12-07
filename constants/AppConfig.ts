/**
 * App Configuration
 * Centralized configuration for the Lost & Found Hub app
 */

export const AppConfig = {
  // App Information
  appName: 'Lost & Found Hub',
  appVersion: '1.0.0',
  universityName: 'University',

  // Item Configuration
  item: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxDescriptionLength: 1000,
    maxTitleLength: 100,
    categories: [
      'Electronics',
      'Personal Items',
      'Clothing',
      'Books',
      'Accessories',
      'Other'
    ] as const,
  },

  // User Configuration
  user: {
    maxProfileImageSize: 2 * 1024 * 1024, // 2MB
    minPasswordLength: 6,
    maxNameLength: 50,
  },

  // Storage Configuration
  storage: {
    itemsPath: 'items',
    profilesPath: 'profiles',
  },

  // Validation
  validation: {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneRegex: /^[\d\s\-\+\(\)]+$/,
  },

  // UI Configuration
  ui: {
    imageQuality: 0.8,
    imageAspectRatio: [4, 3] as [number, number],
    debounceDelay: 300, // ms for search
  },

  // Error Messages
  errors: {
    network: 'Network error. Please check your connection.',
    auth: {
      invalidCredentials: 'Invalid email or password.',
      userNotFound: 'User not found.',
      emailInUse: 'This email is already registered.',
      weakPassword: 'Password should be at least 6 characters.',
      requiresRecentLogin: 'Please login again to perform this action.',
    },
    item: {
      notFound: 'Item not found.',
      unauthorized: 'You can only modify your own items.',
      uploadFailed: 'Failed to upload image. Please try again.',
      deleteFailed: 'Failed to delete item. Please try again.',
    },
    general: {
      unknown: 'An unexpected error occurred. Please try again.',
      required: 'This field is required.',
    },
  },

  // Success Messages
  success: {
    itemCreated: 'Item added successfully!',
    itemUpdated: 'Item updated successfully!',
    itemDeleted: 'Item deleted successfully!',
    itemFound: 'Item marked as found!',
    profileUpdated: 'Profile updated successfully!',
    passwordReset: 'Password reset email sent!',
  },
} as const;

export type ItemCategory = typeof AppConfig.item.categories[number];

