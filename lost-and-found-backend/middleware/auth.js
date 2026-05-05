const jwt = require('jsonwebtoken');

function getTokenPayload(req) {
  const secret = process.env.JWT_SECRET;
  const header = req.headers.authorization || '';
  if (!secret || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7);
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'JWT_SECRET not configured' });
  }

  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = { requireAuth, getTokenPayload };
