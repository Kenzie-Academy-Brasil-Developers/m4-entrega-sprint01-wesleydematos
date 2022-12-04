export const ensureYourselfOrAdmMiddleware = (req, res, next) => {
  const isRequestUserAdm = req.isAdm;
  const idRequestUser = req.requestUser;
  const idForExecution = req.params.id;

  if (!isRequestUserAdm && idRequestUser == idForExecution) {
    return next();
  }

  if (!isRequestUserAdm) {
    return res.status(403).json({
      message: "missing admin permissions",
    });
  }

  next();
};
