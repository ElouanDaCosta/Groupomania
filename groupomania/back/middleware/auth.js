const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valide';
    } else {
      req.userId = userId;
      req.isAdmin = decodedToken.isAdmin;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};