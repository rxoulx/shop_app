const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Chua dang nhap' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({
        message: 'Token khong hop le hoac da het han',
      });
    }
    req.user = payload; // Chứa { userId, username, role }
    next();
  });
}

function authorizeRoles(...rolesChoPhep) {
  return (req, res, next) => {
    if (!rolesChoPhep.includes(req.user.role)) {
      return res.status(403).json({
        message: `Vai tro '${req.user.role}' khong co quyen thuc hien thao tac nay`,
      });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
