const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
  }

  try {
    const token = tokenHeader.startsWith('Bearer ')
      ? tokenHeader.slice(7, tokenHeader.length).trim()
      : tokenHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careercraft_ai_super_secret_jwt_key_2026');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
