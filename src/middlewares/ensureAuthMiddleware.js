import jwt from "jsonwebtoken";

export const ensureAuthMiddleware = (req, res, next) => {
  let authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "Missing authorization headers" });
  }

  authorization = authorization.split(" ")[1];

  return jwt.verify(authorization, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Missing authorization headers" });
    }

    req.isAdm = decoded.isAdm;
    req.requestUser = decoded.sub;

    return next();
  });
};
