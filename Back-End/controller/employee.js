require('dotenv').config();
const Employee = require('../shcema/employee'); // Update path if needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../Util/tokenUtils'); // Update path if needed
const mongoose = require('mongoose');
const Visa = require('../shcema/VisaApplication');
// Signup
// Signup
exports.signup = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, employeeId } = req.body;

    // Validate required fields
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Check if employeeId already exists
    const existingEmployeeId = await Employee.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      employeeId, // Store provided ID
    });

    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      message: 'Employee registered successfully',
      employee: {
        id: savedEmployee._id,
        employeeId: savedEmployee.employeeId,
        name: savedEmployee.name,
        email: savedEmployee.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(employee._id);
    const refreshToken = generateRefreshToken(employee._id);

    employee.refreshToken = refreshToken;
    await employee.save();

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        
isVerified:employee.
isVerified,

      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // Get token from any source
    const token =
      req.headers['authorization']?.split(' ')[1] ||
      req.headers['x-access-token'] ||
      req.body.accessToken ||
      req.query.accessToken ||
      req.params.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    // Verify token and extract employeeId
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const employeeId = decoded.id;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.refreshToken = null;
    await employee.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};


// Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password -refreshToken');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve employees', error: error.message });
  }
};

// Verify Employee
exports.verifyEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body; // 🟡 True ya False yahan se milega

    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({ message: 'isVerified must be a boolean (true or false)' });
    }

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.isVerified = isVerified;
    await employee.save();

    res.status(200).json({
      message: `Employee verification status updated to ${isVerified}`,
     
    });
  } catch (error) {
    res.status(500).json({ message: 'Verification update failed', error: error.message });
  }
};

exports.addVisaId = async (req, res) => {
  try {
    const { id } = req.params;
    const { visaId } = req.body;

    if (!visaId) return res.status(400).json({ message: 'visaId is required' });

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (employee.visaIds.includes(visaId)) {
      return res.status(400).json({ message: 'Visa ID already exists for this employee' });
    }

    employee.visaIds.push(visaId);
    await employee.save();

    res.status(200).json({ message: 'Visa ID added successfully', visaIds: employee.visaIds });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add visa ID', error: error.message });
  }
};

// New endpoint for assigning individual applications
exports.addApplicationId = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationId } = req.body;

    if (!applicationId) return res.status(400).json({ message: 'applicationId is required' });

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Check if application exists
    const application = await Visa.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (employee.applicationIds.includes(applicationId)) {
      return res.status(400).json({ message: 'Application already assigned to this employee' });
    }

    // Check if application is already assigned to another employee
    const existingAssignment = await Employee.findOne({ applicationIds: applicationId });
    if (existingAssignment && existingAssignment._id.toString() !== id) {
      return res.status(400).json({ 
        message: `Application already assigned to employee: ${existingAssignment.name}` 
      });
    }

    employee.applicationIds.push(applicationId);
    await employee.save();

    res.status(200).json({ 
      message: 'Application assigned successfully', 
      applicationIds: employee.applicationIds,
      assignedApplication: {
        _id: application._id,
        visaId: application.visaId,
        country: application.country,
        email: application.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign application', error: error.message });
  }
};

// Remove application assignment (only removes from employee, keeps application in database)
exports.removeApplicationId = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationId } = req.body;

    if (!applicationId) return res.status(400).json({ message: 'applicationId is required' });

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (!employee.applicationIds.includes(applicationId)) {
      return res.status(400).json({ message: 'Application not assigned to this employee' });
    }

    employee.applicationIds = employee.applicationIds.filter(appId => appId !== applicationId);
    await employee.save();

    res.status(200).json({ 
      message: 'Application assignment removed successfully', 
      applicationIds: employee.applicationIds 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove application assignment', error: error.message });
  }
};

exports.getUserVisaDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await Employee.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use applicationIds if available, otherwise fall back to visaIds for backward compatibility
    const applicationIds = user.applicationIds || [];
    const visaIds = user.visaIds || [];
    

    // If we have applicationIds, use them directly to fetch individual applications
    if (applicationIds.length > 0) {
      // Convert string IDs to ObjectIds for proper MongoDB querying
      const applicationObjectIds = applicationIds.map(id => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch (error) {
          return null;
        }
      }).filter(id => id !== null);

      const visaApplications = await Visa.find({ _id: { $in: applicationObjectIds } }).lean();
      
      return res.status(200).json({
        message: 'Visa details fetched successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          visaCount: visaApplications.length,
        },
        visaDetails: visaApplications,
      });
    }

    // Fallback to old visaIds system if no applicationIds
    // Convert string IDs to ObjectIds for proper MongoDB querying
    const objectIds = visaIds.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (error) {
        return null;
      }
    }).filter(id => id !== null);

    // Try multiple approaches to find the employee's visa applications
    const visasByObjectId = await Visa.find({ _id: { $in: objectIds } }).lean();
    
    // Fix: Only find visas that match the employee's specific visa IDs
    const visasByVisaId = await Visa.find({ 
      visaId: { $in: visaIds } 
    }).lean();
    
    // Also try finding visas by employee email (seems to be how they're actually linked)
    const visasByEmail = await Visa.find({ email: user.email }).lean();
    
    // If no results by exact email, try to find by partial email match or common emails
    let visasByPartialEmail = [];
    if (visasByEmail.length === 0) {
      // Try some common email patterns that might be associated with this employee
      const possibleEmails = [
        'shamshadalamansari2@gmail.com', // Most common in the visa applications
        user.email,
        user.name.toLowerCase().replace(/\s+/g, '') + '@gmail.com'
      ];
      
      visasByPartialEmail = await Visa.find({ 
        email: { $in: possibleEmails }
      }).lean();
    }
    
    // Filter visasByVisaId to only include the employee's specific visa IDs
    const filteredVisasByVisaId = visasByVisaId.filter(visa => {
      const isMatch = visaIds.includes(visa.visaId);
      return isMatch;
    });
    
    // Remove duplicates - keep only the latest visa application for each visaId
    const uniqueVisas = [];
    const seenVisaIds = new Set();
    
    // Sort by createdAt or updatedAt to get the latest ones first
    filteredVisasByVisaId.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    
    for (const visa of filteredVisasByVisaId) {
      if (!seenVisaIds.has(visa.visaId)) {
        uniqueVisas.push(visa);
        seenVisaIds.add(visa.visaId);
      }
    }
    
    // Only use visaIds array - no email-based matching
    let visas = [];
    if (visasByObjectId.length > 0) {
      visas = visasByObjectId;
    } else if (uniqueVisas.length > 0) {
      visas = uniqueVisas;
    }

    // If we found some visas but not all, clean up the employee's visaIds array
    if (visas.length > 0 && visas.length < visaIds.length) {
      const foundVisaIds = visas.map(visa => visa._id.toString());
      const updatedVisaIds = visaIds.filter(id => foundVisaIds.includes(id));
      
      // Update the employee's visaIds array to remove non-existent visa IDs
      await Employee.findByIdAndUpdate(userId, { 
        visaIds: updatedVisaIds,
        points: updatedVisaIds.length * 50 // Update points based on actual visas
      });
    }

    return res.status(200).json({
      message: 'Visa details fetched successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        visaCount: visas.length,
      },
      visaDetails: visas,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).select('-password -refreshToken');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve employee', error: error.message });
  }
};
exports.deleteEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};
exports.updateEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.refreshToken;

    const updated = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: '-password -refreshToken'
    });

    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
};

exports.getEmployeePoints = async (req, res) => {
  try {
    const { id } = req.params; // can be _id or employeeId

    // You can switch between _id or employeeId as needed
    const employee = await Employee.findOne({
      $or: [
        { _id: id },
        { employeeId: id }
      ]
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Use applicationIds if available, otherwise fall back to visaIds
    const assignmentCount = (employee.applicationIds && employee.applicationIds.length) ? employee.applicationIds.length : 
                           (employee.visaIds && employee.visaIds.length) ? employee.visaIds.length : 0;
    
    const correctPoints = assignmentCount * 50;
    if (employee.points !== correctPoints) {
      employee.points = correctPoints;
      await employee.save(); // triggers pre-save hook too
    }

    return res.status(200).json({
      success: true,
      employeeId: employee.employeeId,
      name: employee.name,
      points: employee.points,
      totalAssignments: assignmentCount,
      applicationIds: employee.applicationIds || [],
      visaIds: employee.visaIds || [] // For debugging
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Migration endpoint to convert visaId assignments to applicationId assignments
exports.migrateVisaIdsToApplicationIds = async (req, res) => {
  try {
    // Get all employees with visaIds but no applicationIds
    const employees = await Employee.find({
      $and: [
        { visaIds: { $exists: true, $not: { $size: 0 } } }, // Has visaIds
        { $or: [
          { applicationIds: { $exists: false } }, // No applicationIds field
          { applicationIds: { $size: 0 } } // Empty applicationIds array
        ]}
      ]
    });
    
    let migratedCount = 0;
    let totalApplicationsAssigned = 0;

    for (const employee of employees) {
      const applicationIds = [];
      
      // For each visaId, find all applications with that visaId
      for (const visaId of employee.visaIds) {
        const applications = await Visa.find({ visaId: visaId });
        
        for (const app of applications) {
          applicationIds.push(app._id.toString());
        }
      }

      // Update employee with applicationIds
      if (applicationIds.length > 0) {
        employee.applicationIds = [...new Set(applicationIds)]; // Remove duplicates
        await employee.save();
        
        migratedCount++;
        totalApplicationsAssigned += employee.applicationIds.length;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Migration completed successfully',
      employeesMigrated: migratedCount,
      totalApplicationsAssigned: totalApplicationsAssigned,
      details: employees.map(emp => ({
        name: emp.name,
        oldVisaIds: emp.visaIds,
        newApplicationIds: emp.applicationIds || []
      }))
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Migration failed', 
      error: error.message 
    });
  }
};