const Manager = require('../shcema/manager');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../Util/tokenUtils'); // Adjust path if needed
const generateEmployeeId = require('../Util/generateEmployeeId');

const signup = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, employeeId } = req.body;

    // Validate required fields
    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    // Check if employeeId already exists
    const existingEmployeeId = await Manager.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Check if email already exists
    const existingEmail = await Manager.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newManager = new Manager({
      name,
      employeeId,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    await newManager.save();

    res.status(201).json({ message: 'Signup successful', employeeId });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};


// Manager Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(manager._id);
    const refreshToken = generateRefreshToken(manager._id);

    // Save refresh token in DB
    manager.refreshToken = refreshToken;
    await manager.save();

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      manager: {
        id: manager._id,
        name: manager.name,
        employeeId: manager.employeeId,
        email: manager.email,
        phoneNumber: manager.phoneNumber,
        isVerified: manager.isVerified,
        visaIds: manager.visaIds,
        points: manager.points,
        createdAt: manager.createdAt,
        updatedAt: manager.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


// Refresh Access Token
const refreshToken = async (req, res) => {
  try {
    // 1. Check all possible sources
    const token =
      req.body.token ||
      req.query.token ||
      req.headers['x-refresh-token'] ||
      req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 2. Check if token exists in DB
    const manager = await Manager.findOne({ refreshToken: token });
    if (!manager) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // 3. Verify token
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || decoded.id !== manager._id.toString()) {
        return res.status(403).json({ message: 'Token verification failed' });
      }

      // 4. Send new access token
      const newAccessToken = generateAccessToken(manager._id);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Refresh failed', error: error.message });
  }
};


// Logout
const logout = async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers['x-refresh-token'] ||
      req.cookies?.refreshToken;

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const manager = await Manager.findOne({ refreshToken: token });
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    // Clear from DB
    manager.refreshToken = null;
    await manager.save();

    // Clear cookie (optional)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};


// Get All Managers
const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().select('-password -refreshToken');
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch managers', error: error.message });
  }
};

// Get Manager By ID
const getManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const manager = await Manager.findById(id).select('-password -refreshToken');
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manager', error: error.message });
  }
};

// Update Manager By ID
const updateManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedManager = await Manager.findByIdAndUpdate(id, updates, { new: true }).select('-password -refreshToken');

    if (!updatedManager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({ message: 'Manager updated successfully', manager: updatedManager });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Delete Manager By ID
const deleteManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Manager.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({ message: 'Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};


const  verifyManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body; // 🟡 True ya False yahan se milega

    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({ message: 'isVerified must be a boolean (true or false)' });
    }

    const employee = await  Manager.findById(id);
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
module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  getAllManagers,
  updateManagerById,
  deleteManagerById,
  getManagerById,
  verifyManager
};
