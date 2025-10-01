const express = require("express")
const router = express.Router()
const visaController = require("../controller/visaConfig")
const { upload } = require("../Cloudinary")
const { verifyAccessToken } = require("../middileware/authMiddleware")

// New step-by-step routes
router.post("/save-step", verifyAccessToken, visaController.saveStep)
router.post("/save-images", verifyAccessToken, upload.single("images"), visaController.saveImages)
router.post(
  "/save-document-samples",
  verifyAccessToken,
  upload.array("samples", 10),
  visaController.saveDocumentSamples,
)
router.post("/remove-document-sample", verifyAccessToken, visaController.removeDocumentSample)
router.post("/complete", verifyAccessToken, visaController.completeConfiguration)

// Legacy routes for backward compatibility
router.post(
  "/add",
  verifyAccessToken,
  upload.single("images"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload one image file" })
    }
    next()
  },
  visaController.createVisaSubmission,
)


router.put("/update/:id", verifyAccessToken, upload.single("images"), visaController.updateVisaSubmissionById);
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
router.get('/getById/:id',  visaController.getVisaSubmissionById);

// ✅ NEW: Route to get visa configurations with 5 documents
router.get('/visa-with-5-docs', visaController.getFirstFiveDocumentsPerConfig);

// Update by ID

// routes/visa.js
router.get('/first-five-rejections', visaController.getFirstFiveRejectionReasons);

router.get('/counts/types',verifyAccessToken, visaController.getVisaTypeCounts);

module.exports = router;
