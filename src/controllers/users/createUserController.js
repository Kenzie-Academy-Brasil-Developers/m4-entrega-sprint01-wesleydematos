import { createUserService } from "../../services/users/createUserService";

export const createUserController = async (req, res) => {
  const [status, data] = await createUserService(req.body);

  return res.status(status).json(data);
};
