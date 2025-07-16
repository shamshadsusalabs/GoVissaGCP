const VisaSubmission = require('../shcema/VisaConfig');
const { cloudinary } = require('../Cloudinary');



exports.createVisaSubmission = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const {
      continent,
      countryDetails,
      visaTypes,
      documents,
      eligibility,
      rejectionReasons
    } = req.body;

    const imageUrls = req.files.map(file => file.path); // Cloudinary gives 'path' as the HTTPS secure_url

    const newVisaSubmission = new VisaSubmission({
      continent,
      countryDetails: JSON.parse(countryDetails),
      visaTypes: JSON.parse(visaTypes),
      documents: JSON.parse(documents),
      eligibility,
      images: imageUrls,
      rejectionReasons: JSON.parse(rejectionReasons)
    });

    await newVisaSubmission.save();
    res.status(201).json({ success: true, data: newVisaSubmission });
  } catch (error) {
    console.error("Create VisaSubmission Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};


// Get All Visa Submissions
exports.getAllVisaCountriesSummary = async (req, res) => {
  try {
    const visaSummaries = await VisaSubmission.find({}, {
      '_id': 1,
      'countryDetails.name': 1,
      'images': 1,
      'visaTypes': 1
    });

    const formattedData = visaSummaries.map(entry => {
      const firstVisa = entry.visaTypes?.[0] || {};
      const visaFee = Number(firstVisa.visaFee) || 0;
      const serviceFee = Number(firstVisa.serviceFee) || 0;
      const totalFee = visaFee + serviceFee;
      const processingTime = firstVisa.processingTime || '';

      return {
        _id: entry._id,
        name: entry.countryDetails?.name || '',
        image: entry.images?.[0] || '',
        totalFee,
        processingTime
      };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


exports.getVisaImagesById = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await VisaSubmission.findById(id, 'images');

    if (!visa) {
      return res.status(404).json({ success: false, message: 'Visa submission not found' });
    }

    res.status(200).json({
      success: true,
      images: visa.images
    });
  } catch (error) {
    console.error("Image Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};


exports.getVisaSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const visaData = await VisaSubmission.findById(id).select(
      '-images -documents -eligibility -rejectionReasons'
    );

    if (!visaData) {
      return res.status(404).json({ message: 'Visa submission not found' });
    }

    res.status(200).json(visaData);
  } catch (error) {
    console.error('Error fetching visa submission:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.getCountryEssentialDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const visaData = await VisaSubmission.findById(id);

    if (!visaData) {
      return res.status(404).json({ message: 'Visa data not found for the given id.' });
    }

    const countryName = visaData.countryDetails?.name || '';

    // Sabhi document names le rahe hain
    const documentNames = visaData.documents
      ?.filter(doc => doc.name)
      .map(doc => doc.name);

    // Eligibility check karte hain:
    // 1) documents ke kisi bhi object me eligibility hai kya?
    let eligibility = visaData.documents?.find(doc => doc.eligibility)?.eligibility;

    // 2) agar documents me nahi, to root object me eligibility check karo
    if (!eligibility && visaData.eligibility) {
      eligibility = visaData.eligibility;
    }

    // 3) phir bhi nahi mila to default message
    if (!eligibility) {
      eligibility = "Eligibility not specified";
    }

    return res.status(200).json({
      countryName,
      documentNames,
      eligibility,
    });

  } catch (error) {
    console.error('Error fetching visa details by id:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getVisaRejectionReasons = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await VisaSubmission.findById(id).select('rejectionReasons');

    if (!visa) {
      return res.status(404).json({ message: 'Visa submission not found' });
    }

    res.status(200).json({ rejectionReasons: visa.rejectionReasons });
  } catch (error) {
    console.error('Error fetching visa rejection reasons:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getVisaDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await VisaSubmission.findById(id).select('documents');

    if (!visa) {
      return res.status(404).json({ message: 'Visa submission not found' });
    }

    res.status(200).json({ documents: visa.documents });
  } catch (error) {
    console.error('Error fetching visa documents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update Visa Submission
exports.updateVisaSubmission = async (req, res) => {
  try {
    const { continent, countryDetails, visaTypes, documents, eligibility, rejectionReasons } = req.body;

    // Upload new files if provided
    const newImageUrls = req.files?.map(file => file.path) || [];

    const updatedSubmission = await VisaSubmission.findByIdAndUpdate(
      req.params.id,
      {
        continent,
        countryDetails,
        visaTypes,
        documents,
        eligibility,
        rejectionReasons,
        ...(newImageUrls.length > 0 && { images: newImageUrls }) // replace images if new ones are provided
      },
      { new: true }
    );

    if (!updatedSubmission) return res.status(404).json({ message: 'Visa submission not found' });
    res.status(200).json(updatedSubmission);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: 'Failed to update visa submission' });
  }
};

// Delete Visa Submission (No Cloudinary cleanup)
exports.deleteVisaSubmission = async (req, res) => {
  try {
    const submission = await VisaSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Visa submission not found' });
    }

    await submission.deleteOne();
    res.status(200).json({ message: 'Visa submission deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: 'Failed to delete visa submission' });
  }
};



// Get Documents Only by Visa ID
exports.getOnlyVisaDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await VisaSubmission.findById(id).select('documents');

    if (!visa || !visa.documents) {
      return res.status(404).json({ message: 'Documents not found for the given ID' });
    }

    res.status(200).json({ success: true, documents: visa.documents });
  } catch (error) {
    console.error("Fetch Documents Error:", error);
    res.status(500).json({ success: false, message: 'Server error while fetching documents' });
  }
};


// Get All Visa Submissions (Full Detailed Data)
exports.getAllVisaSubmissions = async (req, res) => {
  try {
    const allVisaSubmissions = await VisaSubmission.find(); // Full document fetch

    res.status(200).json({
      success: true,
      data: allVisaSubmissions
    });
  } catch (error) {
    console.error('Error fetching all visa submissions:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Get counts of visaTypes by name across all submissions
exports.getVisaTypeCounts = async (req, res) => {
  try {
    // Aggregation pipeline:
    // 1) unwind visaTypes array
    // 2) group by visaTypes.name, count occurrences
    const results = await VisaSubmission.aggregate([
      { $unwind: "$visaTypes" },
      { $group: { _id: "$visaTypes.name", count: { $sum: 1 } } },
      { $project: { _id: 0, visaType: "$_id", count: 1 } },
      { $sort: { count: -1, visaType: 1 } }  // sorted descending by count, then name
    ]);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching visa type counts:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
