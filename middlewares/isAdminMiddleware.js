export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    if (
      req.user._id.toString() === req.params.id ||
      req.user.flights.includes(req.params.id)
    ) {
      next();
    } else {
      const error = new Error("Unauthorized access");
      error.status = 403;
      next(error);
    }
  }
};
