require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'visa_uploads',
    format: file.mimetype.split('/')[1], // फाइल फॉर्मेट ऑटो डिटेक्ट
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    transformation: [{ width: 800, crop: "limit", quality: "auto" }]
  }),
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
