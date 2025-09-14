const jwt = require('jsonwebtoken');

const extractToken = (req) => {
  return (
    req.body?.token ||
    req.query?.token ||
    req.headers['x-access-token'] ||
    req.headers['authorization']?.split(' ')[1] ||
    req.cookies?.token
  );
};

const verifyAccessToken = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.adminId = decoded.id;
    next();
  });
};

module.exports = { verifyAccessToken };
