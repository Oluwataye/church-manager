/**
 * File validation utilities for secure file uploads
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate image file type and size
 */
export function validateImageFile(
  file: File,
  maxSize: number = MAX_FILE_SIZE
): FileValidationResult {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Only JPEG, PNG, and WEBP images are allowed.`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  // Check file extension matches mime type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  
  if (!extension || !validExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file extension.',
    };
  }

  return { valid: true };
}

/**
 * Validate profile photo upload
 */
export function validateProfilePhoto(file: File): FileValidationResult {
  return validateImageFile(file, MAX_PROFILE_PHOTO_SIZE);
}

/**
 * Validate file name to prevent path traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
  // Remove any path separators and special characters
  return fileName
    .replace(/[/\\]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255); // Limit length
}

/**
 * Basic malware scanning - check for suspicious patterns
 * Note: This is a basic check. For production, consider using a dedicated malware scanning service.
 */
export async function scanFileForMalware(file: File): Promise<FileValidationResult> {
  try {
    // Read first few bytes to check file signature
    const buffer = await file.slice(0, 4).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check for common executable signatures
    const suspiciousSignatures = [
      [0x4D, 0x5A], // EXE
      [0x50, 0x4B, 0x03, 0x04], // ZIP (could contain executables)
    ];
    
    for (const signature of suspiciousSignatures) {
      if (bytes.length >= signature.length) {
        let match = true;
        for (let i = 0; i < signature.length; i++) {
          if (bytes[i] !== signature[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          return {
            valid: false,
            error: 'File appears to be an executable or archive, which is not allowed.',
          };
        }
      }
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error scanning file:', error);
    return {
      valid: false,
      error: 'Failed to scan file for security threats.',
    };
  }
}
