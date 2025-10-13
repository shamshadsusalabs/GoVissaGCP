const VisaSubmission = require('../shcema/VisaConfig');
exports.getFirstFiveRejectionReasons = async (req, res) => {
  try {
    const allConfigs = await VisaSubmission.find().lean();

    const result = {};

    allConfigs.forEach(config => {
      if (Array.isArray(config.rejectionReasons) && config.rejectionReasons.length > 0) {
        const firstFive = config.rejectionReasons.slice(0, 5);
        result[config._id] = firstFive;
      }
    });

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Error in getFirstFiveRejectionReasons:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing rejection reasons.",
    });
  }
};
// ✅ Get only those visa submissions where documents.length === 5
exports.getFirstFiveDocumentsPerConfig = async (req, res) => {
  try {
    const allConfigs = await VisaSubmission.find().lean();

    const result = {};

    allConfigs.forEach(config => {
      if (Array.isArray(config.documents) && config.documents.length > 0) {
        // Get only first 5 documents
        const firstFive = config.documents.slice(0, 5);
        result[config._id] = firstFive;
      }
    });

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Error in getFirstFiveDocumentsPerConfig:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing visa configs.",
    });
  }
};

exports.saveStep = async (req, res) => {
  try {
    const { stepNumber, stepData, configId } = req.body

    let visaConfig

    if (configId) {
      // Update existing configuration
      visaConfig = await VisaSubmission.findById(configId)
      if (!visaConfig) {
        return res.status(404).json({ success: false, message: "Configuration not found" })
      }
    } else {
      // Create new configuration
      visaConfig = new VisaSubmission()
    }

    // Update the specific step data
    switch (stepNumber) {
      case 1:
        visaConfig.continent = stepData.continent
        break
      case 2:
        visaConfig.countryDetails = stepData.countryDetails
        break
      case 3:
        visaConfig.visaTypes = stepData.visaTypes
        break
      case 4:
        visaConfig.documents = stepData.documents
        break
      case 5:
        visaConfig.eligibility = stepData.eligibility
        break
      case 6:
        visaConfig.rejectionReasons = stepData.rejectionReasons
        break
      case 7:
        // Images will be handled separately
        break
    }

    // Update step tracking
    visaConfig.currentStep = Math.max(visaConfig.currentStep, stepNumber)
    visaConfig.lastSavedAt = new Date()

    await visaConfig.save()

    res.status(200).json({
      success: true,
      data: visaConfig,
      message: `Step ${stepNumber} saved successfully`,
    })
  } catch (error) {
    console.error("Save step error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    })
  }
}

// Save images for step 7
exports.saveImages = async (req, res) => {
  try {
    const { configId } = req.body

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" })
    }

    const visaConfig = await VisaSubmission.findById(configId)
    if (!visaConfig) {
      return res.status(404).json({ success: false, message: "Configuration not found" })
    }

    const imageUrl = req.file.path
    visaConfig.images = [imageUrl]
    visaConfig.currentStep = Math.max(visaConfig.currentStep, 7)
    visaConfig.lastSavedAt = new Date()

    await visaConfig.save()

    res.status(200).json({
      success: true,
      data: visaConfig,
      message: "Images saved successfully",
    })
  } catch (error) {
    console.error("Save images error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    })
  }
}

// Save document sample images
exports.saveDocumentSamples = async (req, res) => {
  try {
    const { configId, documentId } = req.body

   

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No sample images uploaded" })
    }

    const visaConfig = await VisaSubmission.findById(configId)
    if (!visaConfig) {
      return res.status(404).json({ success: false, message: "Configuration not found" })
    }

  

    // Find the document and update its sample images
    const documentIndex = visaConfig.documents.findIndex((doc) => doc.id === documentId)

    console.log("Document search:", {
      documentId,
      documentIndex,
      availableDocIds: visaConfig.documents.map((d) => d.id),
    })

    if (documentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
        debug: {
          searchingFor: documentId,
          availableDocuments: visaConfig.documents.map((d) => ({ id: d.id, name: d.name })),
        },
      })
    }

    // Get uploaded image URLs
    const sampleUrls = req.files.map((file) => file.path)

    // Initialize sample array if it doesn't exist
    if (!visaConfig.documents[documentIndex].sample) {
      visaConfig.documents[documentIndex].sample = []
    }

    // Add new sample images to existing ones
    visaConfig.documents[documentIndex].sample.push(...sampleUrls)

    visaConfig.lastSavedAt = new Date()
    await visaConfig.save()

    console.log("Successfully saved samples:", sampleUrls)

    res.status(200).json({
      success: true,
      data: visaConfig,
      message: "Document sample images saved successfully",
    })
  } catch (error) {
    console.error("Save document samples error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    })
  }
}

// Remove document sample image
exports.removeDocumentSample = async (req, res) => {
  try {
    const { configId, documentId, sampleUrl } = req.body

    const visaConfig = await VisaSubmission.findById(configId)
    if (!visaConfig) {
      return res.status(404).json({ success: false, message: "Configuration not found" })
    }

    // Find the document and remove the sample image
    const documentIndex = visaConfig.documents.findIndex((doc) => doc.id === documentId)
    if (documentIndex === -1) {
      return res.status(404).json({ success: false, message: "Document not found" })
    }

    if (visaConfig.documents[documentIndex].sample) {
      visaConfig.documents[documentIndex].sample = visaConfig.documents[documentIndex].sample.filter(
        (url) => url !== sampleUrl,
      )
    }

    visaConfig.lastSavedAt = new Date()
    await visaConfig.save()

    res.status(200).json({
      success: true,
      data: visaConfig,
      message: "Document sample image removed successfully",
    })
  } catch (error) {
    console.error("Remove document sample error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    })
  }
}

// Complete configuration (final submit)
exports.completeConfiguration = async (req, res) => {
  try {
    const { configId } = req.body

    const visaConfig = await VisaSubmission.findById(configId)
    if (!visaConfig) {
      return res.status(404).json({ success: false, message: "Configuration not found" })
    }

    visaConfig.isComplete = true
    visaConfig.currentStep = 8
    visaConfig.lastSavedAt = new Date()

    await visaConfig.save()

    res.status(200).json({
      success: true,
      data: visaConfig,
      message: "Configuration completed successfully",
    })
  } catch (error) {
    console.error("Complete configuration error:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    })
  }
}

// Legacy methods for backward compatibility
exports.createVisaSubmission = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" })
    }
    const { continent, countryDetails, visaTypes, documents, eligibility, rejectionReasons } = req.body
    const imageUrl = req.file.path
    const newVisaSubmission = new VisaSubmission({
      continent,
      countryDetails: JSON.parse(countryDetails),
      visaTypes: JSON.parse(visaTypes),
      documents: JSON.parse(documents),
      eligibility,
      images: [imageUrl],
      rejectionReasons: JSON.parse(rejectionReasons),
      isComplete: true,
      currentStep: 8,
    })
    await newVisaSubmission.save()
    res.status(201).json({ success: true, data: newVisaSubmission })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    })
  }
}

exports.updateVisaSubmissionById = async (req, res) => {
  try {
    const { id } = req.params
    const { continent, countryDetails, visaTypes, documents, eligibility, rejectionReasons } = req.body
    const updatedFields = {
      continent,
      eligibility,
      lastSavedAt: new Date(),
    }
    if (countryDetails) updatedFields.countryDetails = JSON.parse(countryDetails)
    if (visaTypes) updatedFields.visaTypes = JSON.parse(visaTypes)
    if (documents) updatedFields.documents = JSON.parse(documents)
    if (rejectionReasons) updatedFields.rejectionReasons = JSON.parse(rejectionReasons)
    if (req.file) {
      updatedFields.images = [req.file.path]
    }
    const updatedVisa = await VisaSubmission.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    })
    if (!updatedVisa) {
      return res.status(404).json({ success: false, message: "Visa Submission not found" })
    }
    res.status(200).json({ success: true, data: updatedVisa })
  } catch (error) {
    console.error("Update VisaSubmission Error:", error)
    res.status(500).json({ success: false, message: error.message || "Server Error" })
  }
}
// Get All Visa Submissions
exports.getAllVisaCountriesSummary = async (req, res) => {
  try {
    const visaSummaries = await VisaSubmission.find(
      { isComplete: true }, // ✅ Only fetch documents where isComplete is true
      {
        '_id': 1,
        'countryDetails.name': 1,
        'images': 1,
        'visaTypes': 1
      }
    );

    const formattedData = visaSummaries.map(entry => {
      const firstVisa = entry.visaTypes?.[0] || {};
      // Use adult pricing (12+ years) as default for summary display
      const visaFee = Number(firstVisa.visaFee) || 0;
      const serviceFee = Number(firstVisa.serviceFee) || 0;
      const totalFee = visaFee + serviceFee;
      const processingTime = firstVisa.processingTime || '';

      return {
        _id: entry._id,
        name: entry.countryDetails?.name || '',
        image: entry.images?.[0] || '',
        totalFee, // Adult pricing shown by default
        processingTime,
        // Include age-based pricing for frontend to use if needed
        pricing: {
          adult: { visaFee, serviceFee, total: totalFee },
          child: { 
            visaFee: Number(firstVisa.childVisaFee) || 0, 
            serviceFee: Number(firstVisa.childServiceFee) || 0,
            total: (Number(firstVisa.childVisaFee) || 0) + (Number(firstVisa.childServiceFee) || 0)
          },
          youngChild: { 
            visaFee: Number(firstVisa.youngChildVisaFee) || 0, 
            serviceFee: Number(firstVisa.youngChildServiceFee) || 0,
            total: (Number(firstVisa.youngChildVisaFee) || 0) + (Number(firstVisa.youngChildServiceFee) || 0)
          }
        }
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
    const applicationTips = visaData.countryDetails?.applicationTips || '';

    // name + description + sample URLs
    const documentDetails = visaData.documents?.map(doc => ({
      name: doc.name || '',
      description: doc.description || '',
      sample: doc.sample || [], // this will be an array of URLs
    })) || [];

    // Eligibility check
    let eligibility = visaData.documents?.find(doc => doc.eligibility)?.eligibility;

    if (!eligibility && visaData.eligibility) {
      eligibility = visaData.eligibility;
    }

    if (!eligibility) {
      eligibility = "Eligibility not specified";
    }

    return res.status(200).json({
      countryName,
      applicationTips,
      documentDetails,
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

// ✅ NEW: Get only documents array from VisaConfig
exports.getDocumentsOnly = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the visa config and select only the documents field
    const visaConfig = await VisaSubmission.findById(id).select('documents');

    if (!visaConfig) {
      return res.status(404).json({ 
        success: false, 
        message: 'Visa configuration not found' 
      });
    }

    if (!visaConfig.documents || visaConfig.documents.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No documents found for this visa configuration' 
      });
    }

    // Return only the documents array
    res.status(200).json({
      success: true,
      message: 'Documents fetched successfully',
      data: visaConfig.documents
    });

  } catch (error) {
    console.error("Error fetching documents only:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching documents' 
    });
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


exports.getVisaSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const visaSubmission = await VisaSubmission.findById(id);

    if (!visaSubmission) {
      return res.status(404).json({ success: false, message: 'Visa Submission not found' });
    }

    res.status(200).json({ success: true, data: visaSubmission });
  } catch (error) {
    console.error("Get VisaSubmission Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

