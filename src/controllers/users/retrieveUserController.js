import { retrieveUserService } from "../../services/users/retrieveUserService";

export const retrieveUserController = (req, res) => {
  const [status, data] = retrieveUserService(req.requestUser);

  return res.status(status).json(data);
};
