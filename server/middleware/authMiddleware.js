const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'servify_secret_key_123456789_super_secure');

      // Add user info from payload
      req.user = {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name
      };

      next();
    } catch (error) {
      console.error('Token validation error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
}

module.exports = { protect };
