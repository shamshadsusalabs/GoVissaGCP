const VisaApplication = require('../shcema/VisaApplication');
const PaymentOrder = require('../shcema/Payment');

const createVisaApplication = async (req, res) => {
  try {
    const {
      visaId,
      travellers,
      email,
      country,
      phone,
      paymentId,
      processingMode, // ✅ New field
      employeeId, // ✅ New field
      promoCode, // ✅ Promo code
      promoCodeId, // ✅ Promo code ID
      paymentOrderId, // ✅ Payment Order ID
    } = req.body

    // ✅ Fetch promo code data from payment order using paymentId
    let promoCodeData = {
      promoCode: null,
      promoCodeId: null,
      discountAmount: 0,
      originalAmount: null
    };
    let paymentOrderMongoId = null; // ✅ Store the MongoDB _id of payment order

    if (paymentId) {
      try {
        const paymentOrder = await PaymentOrder.findOne({ paymentId: paymentId });
        if (paymentOrder) {
          paymentOrderMongoId = paymentOrder._id; // ✅ Get the MongoDB _id
          promoCodeData = {
            promoCode: paymentOrder.promoCode,
            promoCodeId: paymentOrder.promoCodeId,
            discountAmount: paymentOrder.discountAmount || 0,
            originalAmount: paymentOrder.originalAmount
          };
        }
      } catch (error) {
        console.error('⚠️ [PAYMENT SEARCH ERROR]:', error.message);
      }
    }

    // ✅ Fallback to request body if not found in payment order
    const finalPromoCode = promoCodeData.promoCode || promoCode;
    const finalPromoCodeId = promoCodeData.promoCodeId || promoCodeId;
    const finalDiscountAmount = promoCodeData.discountAmount || 0;
    const finalOriginalAmount = promoCodeData.originalAmount;

    // Parse passportData (should be an array of objects)
    let passportData = []
    if (req.body.passportData) {
      try {
        passportData =
          typeof req.body.passportData === "string" ? JSON.parse(req.body.passportData) : req.body.passportData
        // Ensure it's always an array
        if (!Array.isArray(passportData)) {
          passportData = [passportData]
        }
      } catch (err) {
        console.error('⚠️ [PASSPORT PARSE ERROR]:', err.message);
        passportData = []
      }
    }

    // Parse documentsMetadata (for naming uploaded files)
    const documentsMetadata = JSON.parse(req.body.documentsMetadata || "[]")
    const documents = {}
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Expected format: documents[<travellerIndex>][<docId>][front/back]
        const match = file.fieldname.match(/^documents\[(\d+)\]\[(.+?)\]\[(front|back)\]$/)
        if (!match) {
          continue
        }

        const travellerIndex = match[1]
        const docId = match[2]
        const side = match[3] // 'front' or 'back'

        // Find metadata for this traveller and document
        const travellerMeta = documentsMetadata.find((m) => m.travellerIndex === Number.parseInt(travellerIndex))
        const docMeta = travellerMeta?.documents?.find((d) => d.id === docId)
        const fileName = docMeta ? docMeta.name : file.originalname

        // Create nested structure: documents[travellerIndex][docId][side]
        const documentKey = `${travellerIndex}_${docId}`
        if (!documents[documentKey]) {
          documents[documentKey] = {}
        }

        documents[documentKey][side] = {
          url: file.path,
          fileName,
        }
      }
    }

    // Create new visa application with new fields
    const applicationData = {
      visaId,
      travellers,
      email,
      phone,
      country,
      documents,
      paymentId, // ✅ Keep Razorpay payment ID for reference
      passportData,
      processingMode, // ✅ Save processing mode
      employeeId, // ✅ Save employee ID
      promoCode: finalPromoCode, // ✅ Save promo code from payment order
      promoCodeId: finalPromoCodeId, // ✅ Save promo code ID from payment order
      discountAmount: finalDiscountAmount, // ✅ Save discount amount from payment order
      originalAmount: finalOriginalAmount, // ✅ Save original amount from payment order
      paymentOrderId: paymentOrderMongoId || paymentOrderId, // ✅ Use MongoDB _id if found, fallback to original
    };
    
    const visaApplication = new VisaApplication(applicationData);
    const savedVisaApplication = await visaApplication.save();

    res.status(201).json({
      message: "Visa application created successfully.",
      visaApplication: savedVisaApplication,
    })
  } catch (error) {
    console.error('❌ [ERROR] Visa application creation failed!');
    console.error('❌ [ERROR MESSAGE]:', error.message);
    console.error('❌ [ERROR STACK]:', error.stack);
    console.error('❌ [ERROR NAME]:', error.name);
    if (error.errors) {
      console.error('❌ [VALIDATION ERRORS]:', JSON.stringify(error.errors, null, 2));
    }
    
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      errorName: error.name,
      validationErrors: error.errors ? Object.keys(error.errors) : null
    })
  }
}






const getVisaApplicationStats = async (req, res) => {
  try {
    const allApplications = await VisaApplication.find();

    const totalApplications = allApplications.length;

    let approved = 0;
    let rejected = 0;
    let pending = 0;

    allApplications.forEach(app => {
      const history = app.statusHistory;

      if (!history || history.length === 0) {
        pending++;
      } else {
        const lastStatus = history[history.length - 1].label?.toLowerCase();
        if (lastStatus === 'visa_approved') {
          approved++;
        } else if (lastStatus === 'visa_rejected') {
          rejected++;
        } else {
          pending++;
        }
      }
    });

    res.status(200).json({
      totalApplications,
      approved,
      rejected,
      pending,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllVisaApplications = async (req, res) => {
  try {
    // You can sort by createdAt desc, or update as needed
    const visaApplications = await VisaApplication.find({})
      .sort({ createdAt: -1 })   // newest first
      .lean()                    // returns plain JS objects for speed
      .exec();

    res.status(200).json({
      message: 'Visa applications fetched successfully',
      data: visaApplications,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



const updateVisaStatus = async (req, res) => {
  try {
    const { id } = req.params; // VisaApplication ID
    const { label, rejectionReason } = req.body;

    if (!label) {
      return res.status(400).json({ error: 'Status label is required.' });
    }

    // Validate rejection reason for visa_rejected status
    if (label === 'visa_rejected' && !rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason is required when status is visa_rejected.' });
    }

    const visa = await VisaApplication.findById(id);
    if (!visa) {
      return res.status(404).json({ error: 'Visa application not found.' });
    }

    // Create status entry with optional rejection reason
    const statusEntry = { 
      label, 
      date: new Date()
    };

    // Add rejection reason if provided and status is visa_rejected
    if (label === 'visa_rejected' && rejectionReason) {
      statusEntry.rejectionReason = rejectionReason;
    }

    visa.statusHistory.push(statusEntry);
    await visa.save();

    res.status(200).json({
      message: 'Status updated successfully.',
      statusHistory: visa.statusHistory,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get full visa application by ID
// Get visa application by ID without statusHistory
const getVisaApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Exclude statusHistory field using .select('-statusHistory')
    const visa = await VisaApplication.findById(id).select('-statusHistory');

    if (!visa) return res.status(404).json({ message: 'Visa application not found' });

    res.status(200).json(visa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getVisaApplicationsByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required in query params.' });
    }

    const visaApplications = await VisaApplication.find({ phone })
      .sort({ createdAt: -1 })
      .select('-documents -statusHistory')  // Exclude both fields
      .lean()
      .exec();

    res.status(200).json({
      message: `Visa applications for phone ${phone} fetched successfully.`,
      data: visaApplications,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getVisaStatusByPaymentId = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required in params.' });
    }

    // ✅ Works for both online paymentId and cash orderId
    const visa = await VisaApplication.findOne({ paymentId })
      .select('statusHistory')
      .lean()
      .exec();

    if (!visa) {
      return res.status(404).json({ error: 'Visa application not found.' });
    }

    res.status(200).json({
      message: `Status history for payment ID ${paymentId} fetched successfully.`,
      statusHistory: visa.statusHistory || [],
    });
  } catch (error) {
    console.error('❌ [GET STATUS ERROR]:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getVisaStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: '_id is required in params.' });
    }

    const visa = await VisaApplication.findById(id)
      .select('statusHistory')
      .lean()
      .exec();

    if (!visa) {
      return res.status(404).json({ error: 'Visa application not found.' });
    }

    res.status(200).json({
      message: `Status history for _id ${id} fetched successfully.`,
      statusHistory: visa.statusHistory || [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getPaymentByPaymentId = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // ✅ Check if visa application exists with this paymentId (works for both online and cash/orderId)
    const exists = await VisaApplication.exists({ paymentId });

    if (exists) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false});
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRejectedByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const submissions = await VisaApplication.find({
      phone: phone,
      statusHistory: {
        $elemMatch: {
          label: 'visa_rejected'
        }
      }
    });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all approved visa submissions by phone
const getApprovedByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const submissions = await VisaApplication.find({
      phone: phone,
      statusHistory: {
        $elemMatch: {
          label: 'visa_approved'
        }
      }
    });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const getVisasByPhone = async (req, res) => {
  try {
    const phone = req.params.phone || req.body.phone;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Find all visa applications with matching phone number
    const visas = await VisaApplication.find({ phone });

    if (!visas.length) {
      return res.status(404).json({ message: "No records found for this phone number" });
    }

    return res.status(200).json(visas);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


const getStatusHistoryById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Find document by _id and return only statusHistory field
    const visa = await VisaApplication.findById(id).select('statusHistory');

    if (!visa) {
      return res.status(404).json({ message: "Record not found with this ID" });
    }

    return res.status(200).json(visa.statusHistory);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getLatestVisaApplications = async (req, res) => {
  try {
    const latestApplications = await VisaApplication.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec();

    res.status(200).json({
      message: 'Latest 5 visa applications fetched successfully',
      data: latestApplications,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ NEW: Get monthly statistics for dashboard chart
const getMonthlyStats = async (req, res) => {
  try {
    const allApplications = await VisaApplication.find({})
      .select('createdAt statusHistory')
      .lean()
      .exec();

    // Initialize monthly data for all 12 months
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthlyStats = months.map(month => ({
      month,
      applications: 0,
      approved: 0,
      rejected: 0
    }));

    // Helper function to get latest status
    const getLatestStatus = (statusHistory) => {
      if (!statusHistory || statusHistory.length === 0) return 'pending';
      return statusHistory[statusHistory.length - 1].label?.toLowerCase() || 'pending';
    };

    // Count applications by month
    allApplications.forEach(app => {
      const date = new Date(app.createdAt);
      const monthIndex = date.getMonth(); // 0-11
      const status = getLatestStatus(app.statusHistory);

      // Increment total applications for this month
      monthlyStats[monthIndex].applications += 1;

      // Increment status-specific counts
      if (status === 'visa_approved') {
        monthlyStats[monthIndex].approved += 1;
      } else if (status === 'visa_rejected') {
        monthlyStats[monthIndex].rejected += 1;
      }
      // Note: pending applications are calculated as: applications - approved - rejected
    });

    res.status(200).json({
      success: true,
      message: 'Monthly statistics fetched successfully',
      data: monthlyStats,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
};


module.exports = { createVisaApplication , getAllVisaApplications,updateVisaStatus,getVisaApplicationById,
  getVisaApplicationsByPhone,getVisaApplicationStats, getLatestVisaApplications,getVisaStatusById,
  getVisaStatusByPaymentId,getPaymentByPaymentId,getRejectedByPhone,getApprovedByPhone,getVisasByPhone,getStatusHistoryById,getMonthlyStats};
