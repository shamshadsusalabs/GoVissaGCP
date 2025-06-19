const VisaApplication = require('../shcema/VisaApplication');

const createVisaApplication = async (req, res) => {
  try {
    const { visaId, travellers, email,country, phone, paymentId } = req.body;

    // Parse passportData (should be an array of objects)
    let passportData = [];
    if (req.body.passportData) {
      try {
        passportData = typeof req.body.passportData === 'string'
          ? JSON.parse(req.body.passportData)
          : req.body.passportData;

        // Ensure it's always an array
        if (!Array.isArray(passportData)) {
          passportData = [passportData];
        }
      } catch (err) {
        console.warn('Failed to parse passportData:', err);
        passportData = [];
      }
    }

    // Parse documentsMetadata (for naming uploaded files)
    const documentsMetadata = JSON.parse(req.body.documentsMetadata || '[]');

    const documents = {};

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Expected format: documents[<docId>][front/back]
        const match = file.fieldname.match(/^documents\[(.+?)\]\[(front|back)\]$/);
        if (!match) continue;

        const docId = match[1];
        const side = match[2]; // 'front' or 'back'
        const meta = documentsMetadata.find(m => m.id === docId);
        const fileName = meta ? meta.name : file.originalname;

        if (!documents[docId]) {
          documents[docId] = {};
        }

        documents[docId][side] = {
          url: file.path,
          fileName,
        };
      }
    } else {
      console.log('No files received to process.');
    }

    // Create new visa application
    const visaApplication = new VisaApplication({
      visaId,
      travellers,
      email,
      phone,
      country,
      documents,
      paymentId,
      passportData,
    });

    const savedVisaApplication = await visaApplication.save();

    res.status(201).json({
      message: 'Visa application created successfully.',
      visaApplication: savedVisaApplication,
    });
  } catch (error) {
    console.error('Error in createVisaApplication:', error);
    res.status(500).json({ error: 'Internal server error' });
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
        if (lastStatus === 'approved') {
          approved++;
        } else if (lastStatus === 'rejected') {
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
    console.error('Error fetching visa application stats:', error);
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
    console.error('Error fetching visa applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const updateVisaStatus = async (req, res) => {
  try {
    const { id } = req.params; // VisaApplication ID
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ error: 'Status label is required.' });
    }

    const visa = await VisaApplication.findById(id);
    if (!visa) {
      return res.status(404).json({ error: 'Visa application not found.' });
    }

    visa.statusHistory.push({ label, date: new Date() });
    await visa.save();

    res.status(200).json({
      message: 'Status updated successfully.',
      statusHistory: visa.statusHistory,
    });
  } catch (error) {
    console.error('Error updating visa status:', error);
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
    console.error('Error fetching visa applications by phone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getVisaStatusByPaymentId = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required in params.' });
    }

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
    console.error('Error fetching visa status history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getPaymentByPaymentId = async (req, res) => {
  try {
    const { paymentId } = req.params;

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
          label: { $regex: /^rejected$/i } // case-insensitive match for 'rejected'
        }
      }
    });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error("Error fetching rejected submissions:", error);
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
          label: { $regex: /^approved$/i } // case-insensitive match for 'approved'
        }
      }
    });

    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error("Error fetching approved submissions:", error);
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
    console.error("Error fetching visa data:", error);
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
    console.error("Error fetching status history:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createVisaApplication , getAllVisaApplications,updateVisaStatus,getVisaApplicationById,
  getVisaApplicationsByPhone,getVisaApplicationStats,
  getVisaStatusByPaymentId,getPaymentByPaymentId,getRejectedByPhone,getApprovedByPhone,getVisasByPhone,getStatusHistoryById};
