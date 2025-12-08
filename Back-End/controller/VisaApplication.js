const VisaApplication = require('../shcema/VisaApplication');
const PaymentOrder = require('../shcema/Payment');

// controllers/visaApplication.controller.js


const createVisaApplication = async (req, res) => {
  try {
    const {
      visaId,
      travellers,
      email,
      country,
      phone,
      paymentId,
      processingMode,      // ✅ New field
      employeeId,          // ✅ New field
      promoCode,           // ✅ Promo code (fallback)
      promoCodeId,         // ✅ Promo code ID (fallback)
      paymentOrderId,      // ✅ Payment Order ID (fallback)
      isFinalSubmit: rawIsFinalSubmit, // ✅ yahan se aayega (string/boolean)
    } = req.body;

    // 🟢 Normalise isFinalSubmit -> true/false
    const isFinalSubmit =
      rawIsFinalSubmit === true ||
      rawIsFinalSubmit === "true" ||
      rawIsFinalSubmit === 1 ||
      rawIsFinalSubmit === "1";

    // ✅ Fetch promo code data from payment order using paymentId
    let promoCodeData = {
      promoCode: null,
      promoCodeId: null,
      discountAmount: 0,
      originalAmount: null,
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
            originalAmount: paymentOrder.originalAmount,
          };
        }
      } catch (error) {
        console.error("⚠️ [PAYMENT SEARCH ERROR]:", error.message);
      }
    }

    // ✅ Fallback to request body if not found in payment order
    const finalPromoCode = promoCodeData.promoCode || promoCode || null;
    const finalPromoCodeId = promoCodeData.promoCodeId || promoCodeId || null;
    const finalDiscountAmount = promoCodeData.discountAmount || 0;
    const finalOriginalAmount = promoCodeData.originalAmount || null;

    // ✅ Parse passportData (array of objects, optional)
    let passportData = [];
    if (req.body.passportData) {
      try {
        passportData =
          typeof req.body.passportData === "string"
            ? JSON.parse(req.body.passportData)
            : req.body.passportData;

        if (!Array.isArray(passportData)) {
          passportData = [passportData];
        }
      } catch (err) {
        console.error("⚠️ [PASSPORT PARSE ERROR]:", err.message);
        passportData = [];
      }
    }

    // ✅ Parse documentsMetadata safely
    let documentsMetadata = [];
    try {
      documentsMetadata = JSON.parse(req.body.documentsMetadata || "[]");
    } catch (err) {
      console.error("⚠️ [DOC META PARSE ERROR]:", err.message);
      documentsMetadata = [];
    }

    // ✅ Build documents object from uploaded files
    const incomingDocuments = {};
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Expected format: documents[<travellerIndex>][<docId>][front/back]
        const match = file.fieldname.match(
          /^documents\[(\d+)\]\[(.+?)\]\[(front|back)\]$/
        );
        if (!match) {
          continue;
        }

        const travellerIndex = match[1];
        const docId = match[2];
        const side = match[3]; // 'front' or 'back'

        // Find metadata for this traveller and document
        const travellerMeta = documentsMetadata.find(
          (m) => m.travellerIndex === Number.parseInt(travellerIndex)
        );
        const docMeta = travellerMeta?.documents?.find((d) => d.id === docId);
        const fileName = docMeta ? docMeta.name : file.originalname;

        // Create key: "<travellerIndex>_<docId>"
        const documentKey = `${travellerIndex}_${docId}`;
        if (!incomingDocuments[documentKey]) {
          incomingDocuments[documentKey] = {};
        }

        incomingDocuments[documentKey][side] = {
          url: file.path,
          fileName,
        };
      }
    }

    // 🧠 IMPORTANT PART: upsert logic
    // Try to find existing application for step-by-step saving
    let existingApp = null;

    // 1st preference: paymentId (online / offline cash ID)
    if (paymentId) {
      existingApp = await VisaApplication.findOne({ paymentId });
    }

    // Fallback: (visaId + phone) if needed
    if (!existingApp && visaId && phone) {
      existingApp = await VisaApplication.findOne({ visaId, phone });
    }

    // ✅ If application already exists → UPDATE (step-by-step save)
    if (existingApp) {
      console.log("ℹ️ [APPLY-VISA] Updating existing application:", existingApp._id.toString());

      // 🔹 Merge documents into existing Map
      if (!existingApp.documents) {
        existingApp.documents = new Map();
      }
      const docsMap = existingApp.documents;

      Object.entries(incomingDocuments).forEach(([key, value]) => {
        const prev = docsMap.get(key) || {};
        docsMap.set(key, { ...prev, ...value });
      });

      // 🔹 Merge passportData by travellerIndex (if provided)
      if (!existingApp.passportData) {
        existingApp.passportData = [];
      }

      if (passportData.length > 0) {
        passportData.forEach((pd) => {
          if (typeof pd.travellerIndex === "undefined") return;

          const idx = existingApp.passportData.findIndex(
            (p) => p.travellerIndex === Number(pd.travellerIndex)
          );

          if (idx >= 0) {
            // Update existing traveller passport data
            existingApp.passportData[idx] = {
              ...existingApp.passportData[idx]._doc,
              ...pd,
            };
          } else {
            // Add new traveller passport data
            existingApp.passportData.push(pd);
          }
        });
      }

      // 🔹 Update basic fields only if sent (so we can change processing mode, employee, etc.)
      if (processingMode) existingApp.processingMode = processingMode;
      if (typeof employeeId === "string" && employeeId.trim() !== "") {
        existingApp.employeeId = employeeId.trim();
      }

      // 🔹 Promo/payment fields – set if not already set, or overwrite
      if (finalPromoCode) existingApp.promoCode = finalPromoCode;
      if (finalPromoCodeId) existingApp.promoCodeId = finalPromoCodeId;
      if (typeof finalDiscountAmount === "number") {
        existingApp.discountAmount = finalDiscountAmount;
      }
      if (finalOriginalAmount) existingApp.originalAmount = finalOriginalAmount;
      if (paymentOrderMongoId || paymentOrderId) {
        existingApp.paymentOrderId =
          paymentOrderMongoId || paymentOrderId || existingApp.paymentOrderId;
      }

      // Optional: update travellers / email / phone / country if you want
      if (travellers) existingApp.travellers = travellers;
      if (email) existingApp.email = email;
      if (country) existingApp.country = country;
      if (phone) existingApp.phone = phone;

      // ✅ FINAL SUBMIT: sirf true pe set karo, kabhi false mat karo
      if (isFinalSubmit) {
        existingApp.isFinalSubmit = true;
      }

      const savedVisaApplication = await existingApp.save();

      return res.status(200).json({
        message: isFinalSubmit
          ? "Visa application finally submitted successfully."
          : "Visa application updated successfully (step saved).",
        visaApplication: savedVisaApplication,
      });
    }

    // ✅ If no existing application → CREATE NEW (first call)
    console.log("ℹ️ [APPLY-VISA] Creating new visa application");

    const applicationData = {
      visaId,
      travellers,
      email,
      phone,
      country,
      documents: incomingDocuments,
      paymentId, // ✅ Keep Razorpay payment ID for reference
      passportData,
      processingMode,                 // ✅ Save processing mode
      employeeId,                    // ✅ Save employee ID
      promoCode: finalPromoCode,     // ✅ Save promo code from payment order/body
      promoCodeId: finalPromoCodeId, // ✅ Save promo code ID
      discountAmount: finalDiscountAmount,
      originalAmount: finalOriginalAmount,
      paymentOrderId: paymentOrderMongoId || paymentOrderId,
      isFinalSubmit: !!isFinalSubmit, // ✅ yahan set ho jayega (true/false)
    };

    const visaApplication = new VisaApplication(applicationData);
    const savedVisaApplication = await visaApplication.save();

    res.status(201).json({
      message: isFinalSubmit
        ? "Visa application created & finally submitted successfully."
        : "Visa application created successfully (step saved).",
      visaApplication: savedVisaApplication,
    });
  } catch (error) {
    console.error("❌ [ERROR] Visa application creation/update failed!");
    console.error("❌ [ERROR MESSAGE]:", error.message);
    console.error("❌ [ERROR STACK]:", error.stack);
    console.error("❌ [ERROR NAME]:", error.name);
    if (error.errors) {
      console.error(
        "❌ [VALIDATION ERRORS]:",
        JSON.stringify(error.errors, null, 2)
      );
    }

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      errorName: error.name,
      validationErrors: error.errors ? Object.keys(error.errors) : null,
    });
  }
};











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

    // ✅ Check if visa application exists with this paymentId AND isFinalSubmit is true
    const visaApplication = await VisaApplication.findOne({ 
      paymentId 
    });

    if (visaApplication && visaApplication.isFinalSubmit === true) {
      return res.status(200).json({ 
        success: true, 
        message: "Payment found and application is finalized",
        isFinalSubmit: true
      });
    } else if (visaApplication && visaApplication.isFinalSubmit === false) {
      return res.status(404).json({ 
        success: false, 
        message: "Application found but not finalized yet",
        isFinalSubmit: false 
      });
    } else {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
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




const getVisaApplicationByPaymentId = async (req, res) => {
  try {
    const { paymentId } = req.params

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "paymentId is required in params",
      })
    }

    // 🔍 Find application by paymentId
    const application = await VisaApplication.findOne({ paymentId })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "No visa application found for this paymentId",
      })
    }

    // ----------------------------
    // ✅ RESTORE SUMMARY GENERATION
    // ----------------------------

    const progress = {} // traveller wise status

    if (application.documents) {
      for (const [key, value] of application.documents.entries()) {
        // key example => "0_1760608672798fl3lcdb61"
        const [travellerIndex, docId] = key.split("_")

        if (!progress[travellerIndex]) {
          progress[travellerIndex] = {
            travellerIndex: Number(travellerIndex),
            documents: {},
          }
        }

        progress[travellerIndex].documents[docId] = {
          hasFront: !!value.front,
          hasBack: !!value.back,
        }
      }
    }

    // ✅ passport data progress
    const passportProgress = {}
    if (Array.isArray(application.passportData)) {
      for (const p of application.passportData) {
        passportProgress[p.travellerIndex] = true
      }
    }

    // ----------------------------
    // ✅ FINAL RESPONSE
    // ----------------------------
    return res.status(200).json({
      success: true,
      message: "Visa application fetched successfully",
      visaApplication: application,

      meta: {
        isFinalSubmit: application.isFinalSubmit === true,

        totalTravellers: Number(application.travellers),

        // ✅ traveller-wise progress for restore
        uploadProgress: progress,

        // ✅ passport filled or not
        passportProgress: passportProgress,

        // simple counts
        documentsCount: application.documents
          ? application.documents.size || Object.keys(application.documents).length
          : 0,

        passportCount: Array.isArray(application.passportData)
          ? application.passportData.length
          : 0,
      },
    })
  } catch (error) {
    console.error("❌ [ERROR] Fetch by paymentId failed!")
    console.error("❌ [ERROR MESSAGE]:", error.message)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    })
  }
}



module.exports = { createVisaApplication , getAllVisaApplications,updateVisaStatus,getVisaApplicationById,  getVisaApplicationByPaymentId,
  getVisaApplicationsByPhone,getVisaApplicationStats, getLatestVisaApplications,getVisaStatusById,
  getVisaStatusByPaymentId,getPaymentByPaymentId,getRejectedByPhone,getApprovedByPhone,getVisasByPhone,getStatusHistoryById,getMonthlyStats};
