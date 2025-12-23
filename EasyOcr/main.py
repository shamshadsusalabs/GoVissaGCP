from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import cv2
import numpy as np
import re
from typing import Dict, Any, List
import fitz  # PyMuPDF
from PIL import Image
import io
import os
from datetime import datetime

app = FastAPI(title="Indian Passport OCR API")

"""
Configure CORS properly:
- When allow_credentials=True, allow_origins cannot be ["*"] per the CORS spec.
- Explicitly list the front-end origins that should be allowed (e.g., local dev and prod).
"""
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000", 
    "https://govisaa-83693.web.app" # Common React dev port
    # Add your production frontend origin(s) below, e.g.:
    # "https://your-frontend.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize EasyOCR - English only
try:
    reader = easyocr.Reader(['en'], gpu=True)
    print("✅ GPU enabled")
except:
    reader = easyocr.Reader(['en'], gpu=False)
    print("✅ CPU mode")

"""
Warm-up EasyOCR at startup to minimize cold-start latency causing 503s on first POST /extract.
This runs a tiny OCR on a blank image so the models are loaded before handling user traffic.
"""
@app.on_event("startup")
async def warmup_ocr():
    try:
        dummy = np.zeros((50, 200), dtype=np.uint8)
        _ = reader.readtext(dummy, detail=0)
        print("✅ EasyOCR warm-up complete")
    except Exception as e:
        print(f"⚠️ EasyOCR warm-up failed: {e}")

# Optional endpoint to trigger warm-up manually after deploy
@app.get("/warmup")
async def warmup():
    try:
        dummy = np.zeros((50, 200), dtype=np.uint8)
        _ = reader.readtext(dummy, detail=0)
        return {"status": "warmed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Warm-up error: {str(e)}")

def extract_passport_data(text_lines: List[str]) -> Dict[str, Any]:
    """Extract passport data from OCR text"""
    data = {
        'passport_number': None,
        'surname': None,
        'given_names': None,
        'date_of_birth': None,
        'date_of_issue': None,
        'date_of_expiry': None,
        'place_of_birth': None,
        'place_of_issue': None,
        'nationality': None,
        'sex': None,
        'father_name': None,
        'mother_name': None,
        'spouse_name': None,
        'address': None,
        'file_number': None,
        'raw_text': text_lines
    }
    
    full_text = ' '.join(text_lines).upper()
    
    # Extract all dates first
    all_dates = re.findall(r'\d{2}/\d{2}/\d{4}', full_text)
    print(f"Found dates: {all_dates}")
    
    # Passport number
    passport_match = re.search(r'[A-Z]\d{7}', full_text)
    if passport_match:
        data['passport_number'] = passport_match.group()
    
    # Process each line
    for i, line in enumerate(text_lines):
        line_upper = line.upper().strip()
        next_line = text_lines[i + 1].strip() if i + 1 < len(text_lines) else ""
        
        # Extract fields
        if 'SURNAME' in line_upper:
            data['surname'] = next_line
        elif 'GIVEN NAME' in line_upper:
            data['given_names'] = next_line
        elif 'DATE OF BIRTH' in line_upper:
            for j in range(i, min(i + 3, len(text_lines))):
                date_match = re.search(r'\d{2}/\d{2}/\d{4}', text_lines[j])
                if date_match:
                    data['date_of_birth'] = date_match.group()
                    break
        elif 'DATE OF ISSUE' in line_upper:
            for j in range(i, min(i + 3, len(text_lines))):
                date_match = re.search(r'\d{2}/\d{2}/\d{4}', text_lines[j])
                if date_match:
                    data['date_of_issue'] = date_match.group()
                    break
        elif 'DATE OF EXPIRY' in line_upper:
            for j in range(i, min(i + 3, len(text_lines))):
                date_match = re.search(r'\d{2}/\d{2}/\d{4}', text_lines[j])
                if date_match:
                    data['date_of_expiry'] = date_match.group()
                    break
        elif 'PLACE OF BIRTH' in line_upper:
            data['place_of_birth'] = next_line
        elif 'PLACE OF ISSUE' in line_upper:
            data['place_of_issue'] = next_line
        elif 'NATIONALITY' in line_upper:
            if 'INDIAN' in line_upper:
                data['nationality'] = 'INDIAN'
        elif 'SEX' in line_upper:
            if 'M' in line_upper:
                data['sex'] = 'M'
            elif 'F' in line_upper:
                data['sex'] = 'F'
        elif 'FATHER' in line_upper and 'NAME' in line_upper:
            if next_line and not re.match(r'[A-Z]?\d+', next_line):
                data['father_name'] = next_line
        elif 'MOTHER' in line_upper and 'NAME' in line_upper:
            data['mother_name'] = next_line
        elif 'SPOUSE' in line_upper:
            data['spouse_name'] = next_line
        elif 'ADDRESS' in line_upper:
            address_parts = []
            for j in range(i + 1, min(i + 5, len(text_lines))):
                if text_lines[j].strip() and not re.match(r'[A-Z]\d{7}', text_lines[j]):
                    address_parts.append(text_lines[j].strip())
            data['address'] = ' '.join(address_parts)
        
        # File number #sddsd
        file_match = re.search(r'[A-Z]{2}\d{13}', line)
        if file_match:
            data['file_number'] = file_match.group()
    
    # Assign dates if still None
    if all_dates:
        if not data['date_of_birth'] and len(all_dates) >= 1:
            data['date_of_birth'] = all_dates[0]
        if not data['date_of_issue'] and len(all_dates) >= 2:
            data['date_of_issue'] = all_dates[1]
        if not data['date_of_expiry'] and len(all_dates) >= 3:
            data['date_of_expiry'] = all_dates[2]
    
    return data

@app.get("/")
async def root():
    return {"message": "Indian Passport OCR API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.on_event("startup")
async def warmup_ocr():
    """Warm-up EasyOCR at startup to minimize cold-start latency"""
    try:
        dummy = np.zeros((50, 200), dtype=np.uint8)
        _ = reader.readtext(dummy, detail=0)
        print("✅ EasyOCR warm-up complete")
    except Exception as e:
        print(f"⚠️ EasyOCR warm-up failed: {e}")

@app.get("/warmup")
async def warmup():
    """Manual warmup endpoint"""
    try:
        dummy = np.zeros((50, 200), dtype=np.uint8)
        _ = reader.readtext(dummy, detail=0)
        return {"status": "warmed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Warm-up error: {str(e)}")

@app.post("/extract")
async def extract_passport(file: UploadFile = File(...)):
    """Extract passport data from image/PDF"""
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file")
    
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    try:
        file_content = await file.read()
        all_text = []
        
        if file.content_type == 'application/pdf':
            # PDF processing
            pdf_doc = fitz.open(stream=file_content, filetype="pdf")
            for page_num in range(pdf_doc.page_count):
                page = pdf_doc[page_num]
                mat = fitz.Matrix(2, 2)
                pix = page.get_pixmap(matrix=mat)
                img_data = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_data))
                image_np = np.array(image)
                
                # OCR
                results = reader.readtext(image_np, detail=0)
                all_text.extend(results)
            pdf_doc.close()
        else:
            # Image processing
            image = Image.open(io.BytesIO(file_content))
            image_np = np.array(image)
            
            # Preprocess
            if len(image_np.shape) == 3:
                gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
            else:
                gray = image_np
            
            # OCR
            results = reader.readtext(gray, detail=0)
            all_text = results
        
        # Extract passport data
        passport_data = extract_passport_data(all_text)
        
        return {
            "success": True,
            "filename": file.filename,
            "data": passport_data,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
