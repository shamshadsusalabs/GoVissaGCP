const express = require('express');
const router = express.Router();
const visaController = require('../controller/visaConfig');
const { upload } = require('../Cloudinary');
const { verifyAccessToken } = require('../middileware/authMiddleware');
// CREATE Visa Submission (with image upload)
router.post('/add', verifyAccessToken,
  upload.array('images', 5), // अधिकतम 5 इमेज
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image' });
    }
    next();
  },
  visaController.createVisaSubmission
);

router.get('/GetAll',verifyAccessToken, visaController.getAllVisaSubmissions);
// GET all visa submissions
router.get('/visa-summaries', visaController.getAllVisaCountriesSummary);

router.get('/visa/images/:id', visaController.getVisaImagesById);

// GET a single visa submission by ID
router.get('/details/:id', visaController.getVisaSubmissionById);

router.get('/country-details/:id',  visaController.getCountryEssentialDetailsById);
router.get('/rejections/:id', visaController.getVisaRejectionReasons);

router.get('/documents/:id', visaController.getVisaDocuments);
// Delete Visa Submission by ID
router.delete('/delete/:id',verifyAccessToken, visaController.deleteVisaSubmission);
// UPDATE visa submission (with optional new image upload)
router.put('/:id', upload.array('images'), visaController.updateVisaSubmission);

// DELETE visa submission
router.delete('/:id', visaController.deleteVisaSubmission);

router.get('/documents/:id/documents-only', visaController.getOnlyVisaDocuments);

module.exports = router;
