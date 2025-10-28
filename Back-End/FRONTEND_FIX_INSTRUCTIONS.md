# Frontend Fix for Child/Young Child Visa Fees Display

## Problem
When editing a visa configuration, the Child and Young Child pricing fields show 0 instead of the actual values stored in the database (6000).

## Root Cause
The `VisaWizard.tsx` file is not loading the child pricing fields (`childVisaFee`, `childServiceFee`, `youngChildVisaFee`, `youngChildServiceFee`) when fetching existing visa configurations from the API.

## Solution

### File to Edit
`/Users/apple/Desktop/shamshad/govissa/GoVissaGCP-main/Visa/src/Admin/VisaConfiq/VisaWizard.tsx`

### Location
Around **line 167-179** in the `fetchConfiguration` function

### Current Code (INCORRECT)
```typescript
visaTypes:
  data.visaTypes?.map((vt: any) => ({
    id: vt.id || vt._id || Date.now().toString(),
    name: vt.name || "",
    code: vt.code || "",
    category: vt.category || "",
    processingTime: vt.processingTime || "",
    processingMethod: vt.processingMethod || "Standard",
    visaFee: vt.visaFee || 0,
    serviceFee: vt.serviceFee || 0,
    currency: vt.currency || "USD",
    validity: vt.validity || "",
    entries: vt.entries || "Single",
    stayDuration: vt.stayDuration || "",
    expectedVisaDays: vt.expectedVisaDays || 7,
    interviewRequired: vt.interviewRequired || false,
    biometricRequired: vt.biometricRequired || false,
    notes: vt.notes || "",
  })) || [],
```

### New Code (CORRECT)
```typescript
visaTypes:
  data.visaTypes?.map((vt: any) => ({
    id: vt.id || vt._id || Date.now().toString(),
    name: vt.name || "",
    code: vt.code || "",
    category: vt.category || "",
    processingTime: vt.processingTime || "",
    processingMethod: vt.processingMethod || "Standard",
    visaFee: vt.visaFee || 0,
    serviceFee: vt.serviceFee || 0,
    childVisaFee: vt.childVisaFee || 0,              // ✅ ADD THIS LINE
    childServiceFee: vt.childServiceFee || 0,        // ✅ ADD THIS LINE
    youngChildVisaFee: vt.youngChildVisaFee || 0,    // ✅ ADD THIS LINE
    youngChildServiceFee: vt.youngChildServiceFee || 0,  // ✅ ADD THIS LINE
    currency: vt.currency || "USD",
    validity: vt.validity || "",
    entries: vt.entries || "Single",
    stayDuration: vt.stayDuration || "",
    expectedVisaDays: vt.expectedVisaDays || 7,
    interviewRequired: vt.interviewRequired || false,
    biometricRequired: vt.biometricRequired || false,
    notes: vt.notes || "",
  })) || [],
```

## What Changed
Added 4 lines to map the child pricing fields from the API response:
1. `childVisaFee: vt.childVisaFee || 0,`
2. `childServiceFee: vt.childServiceFee || 0,`
3. `youngChildVisaFee: vt.youngChildVisaFee || 0,`
4. `youngChildServiceFee: vt.youngChildServiceFee || 0,`

## After This Fix
1. When you click "Edit" on a visa configuration
2. The Child and Young Child pricing fields will show the correct values (6000, 6000, 6000, 6000)
3. The form will preserve these values when you save

## Backend Status
✅ Backend is already fixed and working correctly
✅ API response includes all child pricing fields
✅ Update logic preserves values when fields are empty

## How to Apply This Fix
1. Open the file: `Visa/src/Admin/VisaConfiq/VisaWizard.tsx`
2. Find line 167 (look for `visaTypes:` inside `fetchConfiguration` function)
3. Add the 4 missing lines after `serviceFee: vt.serviceFee || 0,`
4. Save the file
5. Restart your React development server if running
6. Test by editing an existing visa configuration

---
Created: 2025-10-28
Issue: Child/Young Child visa fees showing 0.00 instead of actual database values
