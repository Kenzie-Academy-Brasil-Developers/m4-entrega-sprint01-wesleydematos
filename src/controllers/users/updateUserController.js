import { updateUserService } from "../../services/users/updateUserService";

export const updateUserController = async (req, res) => {
  const [status, data] = await updateUserService(req.body, req.params.id);

  return res.status(status).json(data);
};
