export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {

    // 🔥 FIX: support both formats
    const userRoles = req.user.roles || [req.user.role];

    const hasRole = userRoles.some(role =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};