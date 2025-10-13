const express = require('express');
const router = express.Router();
const parser = require('../middileware/Uplod');
const { verifyAccessToken } = require('../middileware/authMiddleware');
const { createVisaApplication,getAllVisaApplications,updateVisaStatus ,
    getVisaApplicationById,getVisaApplicationsByPhone,getVisaStatusById,
    getVisaStatusByPaymentId,getPaymentByPaymentId,getVisaApplicationStats,getLatestVisaApplications,
    getRejectedByPhone,getApprovedByPhone,getVisasByPhone,getStatusHistoryById,getMonthlyStats} = require('../controller/VisaApplication');

router.post('/apply-visa',verifyAccessToken, parser.any(), createVisaApplication);
router.get('/GetAll',verifyAccessToken, getAllVisaApplications);


router.post('/visa-status/:id',verifyAccessToken, updateVisaStatus);

// GET visa application by ID
router.get('/getById/:id',verifyAccessToken, getVisaApplicationById);

router.get('/getby/byPhone',verifyAccessToken, getVisaApplicationsByPhone);

router.get('/status/:paymentId',verifyAccessToken, getVisaStatusByPaymentId);


// GET /api/payments/:paymentId
router.get('/getbyPaymentID/:paymentId',verifyAccessToken, getPaymentByPaymentId);

router.get('/rejected/:phone',verifyAccessToken, getRejectedByPhone);

// ✅ GET /api/visa/approved/:phone
router.get('/approved/:phone',verifyAccessToken, getApprovedByPhone);

router.get('/by-phone/:phone',verifyAccessToken, getVisasByPhone);
router.get('/visa/status/:id', getVisaStatusById);


router.get('/status-history/:id',verifyAccessToken, getStatusHistoryById);

router.get('/stats',verifyAccessToken, getVisaApplicationStats);
router.get('/getLatest',verifyAccessToken, getLatestVisaApplications);
// ✅ NEW: Monthly statistics route for dashboard chart
router.get('/monthly-stats',verifyAccessToken, getMonthlyStats);
module.exports = router;
