module.exports = (req, res, next) => {
  console.log('🔐 auth middleware session:', req.session);

  if (req.session && req.session.authenticated) {
    return next();
  }

  return res.status(401).json({ message: 'Non authentifié' });
};
