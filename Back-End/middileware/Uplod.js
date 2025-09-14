// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Util/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'visa_documents',
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
      resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
      // Preserve original quality - no compression
      transformation: []
    };
  }
});

const parser = multer({ 
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit for HD images
});

module.exports = parser;
