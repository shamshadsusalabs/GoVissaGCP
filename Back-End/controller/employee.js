require('dotenv').config();
const Employee = require('../shcema/employee'); // Update path if needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../Util/tokenUtils'); // Update path if needed
const mongoose = require('mongoose');
 // Your User model
const Visa = require('../shcema/VisaApplication'); 
const generateEmployeeId = require('../Util/generateEmployeeId');
// Signup
// Signup
exports.signup = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const employeeId = generateEmployeeId(); // Generate the employee ID

    const newEmployee = new Employee({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      employeeId, // Store generated ID
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

    const visaIds = user.visaIds || [];

    // Match against visaId field (not _id)
    const visas = await Visa.find({ visaId: { $in: visaIds } }).lean();

    return res.status(200).json({
      message: 'Visa details fetched successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        visaCount: visaIds.length,
      },
      visaDetails: visas,
    });
  } catch (error) {
    console.error('Error fetching user visa details:', error);
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

    // Optionally update points if visaIds changed
    const correctPoints = (employee.visaIds?.length || 0) * 50;
    if (employee.points !== correctPoints) {
      employee.points = correctPoints;
      await employee.save(); // triggers pre-save hook too
    }

    return res.status(200).json({
      success: true,
      employeeId: employee.employeeId,
      name: employee.name,
      points: employee.points,
      totalVisas: employee.visaIds.length
    });
  } catch (error) {
    console.error('Error getting employee points:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};