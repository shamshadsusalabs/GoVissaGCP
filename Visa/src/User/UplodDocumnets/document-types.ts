export interface Document {
  id: string
  name: string
  description: string
  format: string
  example: string
  isMandatory: boolean
  requiresBothSides?: boolean
}

export interface PassportData {
  dateOfExpiry: string
  dateOfIssue: string
  dob: string
  fileNumber: string
  givenName: string
  nationality: string
  passportNumber: string
  placeOfBirth: string
  placeOfIssue: string
  sex: string
  surname: string
}

export interface TravellerData {
  travellerIndex: number
  uploadedFiles: Record<string, { front?: File; back?: File; frontPreview?: string; backPreview?: string }>
  ocrData: {
    extracted_text: string
    passport_data: PassportData
  } | null
  ocrError: string | null
}
