exports.authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.session?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
};
