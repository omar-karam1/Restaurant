// middleware/authMiddleware.js
module.exports = (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ 
      success: false,
      message: 'غير مصرح بالوصول. يرجى تسجيل الدخول أولاً' 
    });
  };