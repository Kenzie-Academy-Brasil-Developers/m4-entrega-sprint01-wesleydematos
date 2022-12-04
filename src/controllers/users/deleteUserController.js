import { deleteUserService } from "../../services/users/deleteUserService";

export const deleteUserController = (req, res) => {
  const [status, data] = deleteUserService(req.params.id);

  return res.status(status).json(data);
};
