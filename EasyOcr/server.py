from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import os
import uuid
import tempfile
from werkzeug.utils import secure_filename
from pdf2image import convert_from_path
import re

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all origins

# EasyOCR reader for Hindi and English
reader = easyocr.Reader(['hi', 'en'], gpu=False)

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}
ALLOWED_PDF_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_IMAGE_EXTENSIONS or ext in ALLOWED_PDF_EXTENSIONS

def extract_text_from_images(image_paths):
    all_text = []
    for path in image_paths:
        results = reader.readtext(path, detail=0)
        all_text.append("\n".join(results))
    return "\n\n--- PAGE BREAK ---\n\n".join(all_text)

def convert_pdf_to_images(pdf_path):
    return convert_from_path(pdf_path, dpi=300)

def clean_text(text):
    return text.replace('\n', ' ').replace('\r', ' ').upper()

def extract_dob(text):
    matches = re.findall(r'\d{2}/\d{2}/\d{4}', text)
    if matches:
        return matches[0]
    matches = re.findall(r'\d{2}/\d{2}/\d{2}', text)
    if matches:
        return matches[0]
    return ""

def extract_issue_and_expiry_dates(dates):
    if len(dates) >= 2:
        return dates[-2], dates[-1]
    elif len(dates) == 1:
        return dates[0], ""
    return "", ""

def parse_passport_text(raw_text: str) -> dict:
    text = clean_text(raw_text)

    # Passport number from MRZ
    mrz_match = re.search(r'P<IND([A-Z0-9<]+)', text)
    passport_number = ""
    if mrz_match:
        raw_mrz = mrz_match.group(1).replace('<', '')
        passport_number = raw_mrz[:8] if len(raw_mrz) >= 8 else raw_mrz

    # Name extraction
    surname = re.search(r'P<IND([A-Z]+)<<', text)
    given_name = re.search(r'<<([A-Z<]+)\s', text)

    # DOB and dates
    dob = extract_dob(text)
    dates = re.findall(r'\d{2}/\d{2}/\d{4}', text)
    date_of_issue, date_of_expiry = extract_issue_and_expiry_dates(dates)

    # File number extraction
    file_number_match = re.search(r'FILE NUMBER[:\s]*([A-Z0-9]+)', text)
    if not file_number_match:
        file_number_match = re.search(r'([A-Z0-9]{6,})\s+\d{2}/\d{2}/\d{4}', text)

    # Place of birth or issue
    place_of_birth = re.search(r'PLACE OF BIRTH[:\s]*([A-Z\s]+)', text)
    if not place_of_birth and "DELHI" in text:
        place_of_birth = re.search(r'DELHI', text)

    return {
        "passportNumber": passport_number,
        "surname": surname.group(1) if surname else "",
        "givenName": given_name.group(1).replace('<', ' ').strip() if given_name else "",
        "nationality": "INDIAN" if "INDIAN" in text or "IND" in text else "",
        "dob": dob,
        "sex": re.search(r'\b(M|F)\b', text).group(1) if re.search(r'\b(M|F)\b', text) else "",
        "dateOfIssue": date_of_issue,
        "dateOfExpiry": date_of_expiry,
        "placeOfBirth": place_of_birth.group(0) if place_of_birth else "",
        "placeOfIssue": place_of_birth.group(0) if place_of_birth else "",
        "fileNumber": file_number_match.group(1) if file_number_match else ""
    }

@app.route('/upload', methods=['POST'])
def upload_multiple_files():
    files = request.files.getlist('files')

    if not files or len(files) == 0:
        return jsonify({"error": "No files uploaded"}), 400

    temp_image_paths = []

    try:
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                ext = filename.rsplit('.', 1)[1].lower()

                if ext in ALLOWED_IMAGE_EXTENSIONS:
                    temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}_{filename}")
                    file.save(temp_path)
                    temp_image_paths.append(temp_path)

                elif ext == 'pdf':
                    temp_pdf_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}_{filename}")
                    file.save(temp_pdf_path)

                    images = convert_pdf_to_images(temp_pdf_path)
                    for i, img in enumerate(images):
                        img_temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}_{i}.jpg")
                        img.save(img_temp_path, 'JPEG')
                        temp_image_paths.append(img_temp_path)

                    os.remove(temp_pdf_path)
            else:
                return jsonify({"error": f"Invalid file format for {file.filename}"}), 400

        extracted_text = extract_text_from_images(temp_image_paths)
        structured_data = parse_passport_text(extracted_text)

        return jsonify({
            "extracted_text": extracted_text,
            "passport_data": structured_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        for path in temp_image_paths:
            if os.path.exists(path):
                os.remove(path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
