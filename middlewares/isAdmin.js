module.exports = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'ممنوع الوصول. هذه العملية للمسؤولين فقط'
  });
};
