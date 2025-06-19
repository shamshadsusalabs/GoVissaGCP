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
      resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw'
    };
  }
});

const parser = multer({ storage });

module.exports = parser;
