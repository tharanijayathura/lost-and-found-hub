# 🛠️ Utilities Guide

## Overview

This app now includes comprehensive utility functions organized by purpose. All utilities are located in the `utils/` directory.

## Available Utilities

### 1. **Validation** (`utils/validation.ts`)

Form validation functions for all input types:

```typescript
import { validateEmail, validatePassword, validateItemTitle } from '../utils/validation';

// Validate email
const emailResult = validateEmail('user@example.com');
if (!emailResult.isValid) {
  console.error(emailResult.error);
}

// Validate password
const passwordResult = validatePassword('mypassword');
if (!passwordResult.isValid) {
  console.error(passwordResult.error);
}

// Validate item title
const titleResult = validateItemTitle('Lost iPhone');
if (!titleResult.isValid) {
  console.error(titleResult.error);
}
```

**Available Functions:**
- `validateEmail(email)` - Email validation
- `validatePassword(password)` - Password validation
- `validateName(name)` - Name validation
- `validatePhone(phone)` - Phone number validation
- `validateItemTitle(title)` - Item title validation
- `validateItemDescription(description)` - Item description validation
- `validateItemLocation(location)` - Location validation
- `validateDate(date)` - Date format validation
- `validateImage(uri, size?)` - Image validation
- `validateFields(fields)` - Validate multiple fields at once

### 2. **Image Utilities** (`utils/imageUtils.ts`)

Image compression and manipulation:

```typescript
import { compressImage, resizeImage, createThumbnail } from '../utils/imageUtils';

// Compress image before upload
const compressedUri = await compressImage(imageUri, 1200, 1200);

// Resize image
const resizedUri = await resizeImage(imageUri, 800, 600);

// Create thumbnail
const thumbnailUri = await createThumbnail(imageUri, 200);
```

**Available Functions:**
- `compressImage(uri, maxWidth?, maxHeight?)` - Compress image
- `getImageDimensions(uri)` - Get image dimensions
- `resizeImage(uri, width, height)` - Resize image
- `createThumbnail(uri, size?)` - Create thumbnail

### 3. **Error Handling** (`utils/errorHandler.ts`)

User-friendly error messages:

```typescript
import { handleError, getFirebaseErrorMessage, logError } from '../utils/errorHandler';

try {
  await someOperation();
} catch (error) {
  const userMessage = handleError(error, 'OperationName');
  Alert.alert('Error', userMessage);
}
```

**Available Functions:**
- `getFirebaseErrorMessage(error)` - Get user-friendly error message
- `logError(error, context?)` - Log error for debugging
- `handleError(error, context?)` - Handle and return user message
- `isNetworkError(error)` - Check if network error
- `isPermissionError(error)` - Check if permission error

### 4. **Formatters** (`utils/formatters.ts`)

Data formatting functions:

```typescript
import { formatDate, formatRelativeTime, truncateText, formatPhoneNumber } from '../utils/formatters';

// Format date
const formatted = formatDate('2025-01-15'); // "January 15, 2025"

// Relative time
const relative = formatRelativeTime(date); // "2 hours ago"

// Truncate text
const short = truncateText(longText, 100);

// Format phone
const phone = formatPhoneNumber('1234567890'); // "(123) 456-7890"
```

**Available Functions:**
- `formatDate(date)` - Format date to readable string
- `formatRelativeTime(date)` - Format as relative time
- `truncateText(text, maxLength)` - Truncate text
- `capitalize(text)` - Capitalize first letter
- `formatPhoneNumber(phone)` - Format phone number
- `formatFileSize(bytes)` - Format file size
- `formatEmailForDisplay(email)` - Format email for display

### 5. **Helpers** (`utils/helpers.ts`)

General utility functions:

```typescript
import { debounce, isEmpty, deepClone, retry } from '../utils/helpers';

// Debounce search
const debouncedSearch = debounce((query) => {
  searchItems(query);
}, 300);

// Check if empty
if (isEmpty(value)) {
  // handle empty
}

// Deep clone
const cloned = deepClone(object);

// Retry with backoff
const result = await retry(async () => {
  return await apiCall();
}, 3, 1000);
```

**Available Functions:**
- `debounce(func, wait)` - Debounce function calls
- `generateId()` - Generate unique ID
- `isEmpty(value)` - Check if value is empty
- `deepClone(obj)` - Deep clone object
- `sleep(ms)` - Delay execution
- `retry(fn, maxRetries?, delay?)` - Retry with backoff
- `isOnline()` - Check if online
- `safeJsonParse(json, fallback)` - Safe JSON parse
- `groupBy(array, key)` - Group array by key
- `sortBy(array, key, order?)` - Sort array by key

## App Configuration

### `constants/AppConfig.ts`

Centralized app configuration:

```typescript
import { AppConfig } from '../constants/AppConfig';

// Access configuration
const maxImageSize = AppConfig.item.maxImageSize;
const categories = AppConfig.item.categories;
const errorMessage = AppConfig.errors.item.notFound;
```

**Configuration Sections:**
- App information (name, version)
- Item configuration (max sizes, categories)
- User configuration (password rules, etc.)
- Storage paths
- Validation regexes
- UI settings
- Error messages
- Success messages

## Usage Examples

### Example 1: Form Validation

```typescript
import { validateFields, validateEmail, validatePassword } from '../utils/validation';

const handleSubmit = () => {
  const validation = validateFields({
    email: validateEmail(email),
    password: validatePassword(password),
  });

  if (!validation.isValid) {
    Alert.alert('Validation Error', Object.values(validation.errors)[0]);
    return;
  }

  // Proceed with submission
};
```

### Example 2: Image Upload with Compression

```typescript
import { compressImage } from '../utils/imageUtils';
import { uploadImage } from './upload';

const handleImageUpload = async (uri: string) => {
  // Compress first
  const compressed = await compressImage(uri);
  
  // Then upload
  const url = await uploadImage(compressed);
  return url;
};
```

### Example 3: Error Handling

```typescript
import { handleError } from '../utils/errorHandler';

try {
  await deleteItem(itemId);
  Alert.alert('Success', 'Item deleted!');
} catch (error) {
  const message = handleError(error, 'DeleteItem');
  Alert.alert('Error', message);
}
```

## Best Practices

1. **Always validate inputs** before submitting
2. **Compress images** before uploading
3. **Handle errors gracefully** with user-friendly messages
4. **Use debounce** for search inputs
5. **Format data** for display (dates, phone numbers, etc.)
6. **Use AppConfig** for constants instead of hardcoding

## TypeScript Support

All utilities are fully typed with TypeScript:
- Type-safe function parameters
- Return types defined
- Interface definitions included

---

**These utilities make your code cleaner, more maintainable, and less error-prone!** ✨

