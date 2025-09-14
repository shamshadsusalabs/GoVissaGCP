// Utility functions for file validation that can be reused across components

export interface FileValidationResult {
  isValid: boolean
  error?: string
  code?: string
}

export interface FileValidationOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  allowedExtensions?: string[]
}

export const DEFAULT_VALIDATION_OPTIONS: FileValidationOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  allowedExtensions: ["jpg", "jpeg", "png", "webp"],
}

export const validateFile = (
  file: File,
  options: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS,
): FileValidationResult => {
  const {
    maxSize = DEFAULT_VALIDATION_OPTIONS.maxSize!,
    allowedTypes = DEFAULT_VALIDATION_OPTIONS.allowedTypes!,
    allowedExtensions = DEFAULT_VALIDATION_OPTIONS.allowedExtensions!,
  } = options

  // Check file type
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: `Invalid file format. Please upload only ${allowedExtensions.map((ext) => ext.toUpperCase()).join(", ")} images.`,
      code: "INVALID_FILE_TYPE",
    }
  }

  // Check file size
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
    return {
      isValid: false,
      error: `File size too large (${fileSizeMB}MB). Maximum allowed size is ${maxSizeMB}MB.`,
      code: "FILE_SIZE_EXCEEDED",
    }
  }

  // Check file extension as additional validation
  const fileExtension = file.name.split(".").pop()?.toLowerCase()
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Invalid file extension. Please use files with ${allowedExtensions.map((ext) => `.${ext}`).join(", ")} extensions.`,
      code: "INVALID_FILE_EXTENSION",
    }
  }

  return { isValid: true }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const getFileTypeIcon = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  const icons: Record<string, string> = {
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    webp: "🖼️",
    pdf: "📄",
  }
  return icons[extension || ""] || "📄"
}

// Validation for multiple files
export const validateMultipleFiles = (
  files: File[],
  options: FileValidationOptions = DEFAULT_VALIDATION_OPTIONS,
): { validFiles: File[]; errors: string[] } => {
  const validFiles: File[] = []
  const errors: string[] = []

  files.forEach((file, index) => {
    const validation = validateFile(file, options)
    if (validation.isValid) {
      validFiles.push(file)
    } else {
      errors.push(`File ${index + 1} (${file.name}): ${validation.error}`)
    }
  })

  return { validFiles, errors }
}
