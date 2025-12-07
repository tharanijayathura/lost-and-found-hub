/**
 * Error Handling Utilities
 * Centralized error handling and user-friendly error messages
 */

import { AppConfig } from '../constants/AppConfig';
import { FirebaseError } from 'firebase/app';

/**
 * Get user-friendly error message from Firebase error
 */
export const getFirebaseErrorMessage = (error: any): string => {
  if (!error) {
    return AppConfig.errors.general.unknown;
  }

  // Handle Firebase Auth errors
  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return AppConfig.errors.auth.userNotFound;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return AppConfig.errors.auth.invalidCredentials;
      case 'auth/email-already-in-use':
        return AppConfig.errors.auth.emailInUse;
      case 'auth/weak-password':
        return AppConfig.errors.auth.weakPassword;
      case 'auth/requires-recent-login':
        return AppConfig.errors.auth.requiresRecentLogin;
      case 'auth/network-request-failed':
        return AppConfig.errors.network;
      case 'permission-denied':
        return 'Permission denied. You may not have access to perform this action.';
      case 'unavailable':
        return AppConfig.errors.network;
      default:
        return error.message || AppConfig.errors.general.unknown;
    }
  }

  // Handle custom error messages
  if (error.message) {
    return error.message;
  }

  return AppConfig.errors.general.unknown;
};

/**
 * Log error for debugging (in production, send to error tracking service)
 */
export const logError = (error: any, context?: string): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[${context || 'App'}] Error:`, errorMessage);
  if (errorStack) {
    console.error('Stack:', errorStack);
  }

  // In production, you would send this to an error tracking service like:
  // Sentry.captureException(error, { tags: { context } });
};

/**
 * Handle error and return user-friendly message
 */
export const handleError = (error: any, context?: string): string => {
  logError(error, context);
  return getFirebaseErrorMessage(error);
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    error.code === 'auth/network-request-failed' ||
    error.code === 'unavailable' ||
    error.message?.includes('network') ||
    error.message?.includes('Network')
  );
};

/**
 * Check if error is a permission error
 */
export const isPermissionError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    error.code === 'permission-denied' ||
    error.message?.includes('permission') ||
    error.message?.includes('Permission')
  );
};

