export const ensureUserExistsMiddleware = (req, res, next) => {
  const foundUser = users.find((user) => user.uuid === req.params.id);

  if (!foundUser) {
    return res.status(404).json({
      message: "User not found!",
    });
  }

  return next();
};
