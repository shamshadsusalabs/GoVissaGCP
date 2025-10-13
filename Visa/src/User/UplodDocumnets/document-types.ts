export interface Document {
  id: string
  name: string
  description: string
  format: string
  example: string
  isMandatory: boolean
  requiresBothSides?: boolean
}

// Updated to match Python OCR response
export interface PassportData {
  passport_number: string
  surname: string
  given_names: string
  date_of_birth: string
  date_of_issue: string
  date_of_expiry: string
  place_of_birth: string
  place_of_issue: string
  nationality: string
  sex: string
  father_name: string
  mother_name: string
  spouse_name: string
  address: string
  file_number: string
}

// Updated OCR response structure to match Python API
export interface OCRResponse {
  success: boolean
  filename: string
  data: PassportData
  timestamp: string
}

export interface TravellerData {
  travellerIndex: number
  uploadedFiles: Record<string, { front?: File; back?: File; frontPreview?: string; backPreview?: string }>
  ocrData: OCRResponse | null
  ocrError: string | null
  passportDataSaved: boolean // ✅ Add this field to track if passport data is saved
}
