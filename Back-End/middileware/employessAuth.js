require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  // Try to get token from all possible sources
  let token =
    req.headers['authorization']?.split(' ')[1] || // Bearer token
    req.headers['x-access-token'] ||               // custom header
    req.body.accessToken ||                        // in body
    req.query.accessToken ||                       // in query
    req.params.accessToken;                        // in URL params

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    req.userId = decoded.id; // Attach user ID to request
    next();
  });
};

module.exports = verifyAccessToken;
