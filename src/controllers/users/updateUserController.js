import { updateUserService } from "../../services/users/updateUserService";

export const updateUserController = (req, res) => {
  const [status, data] = updateUserService(
    req.body,
    req.params.id,
    req.requestUser
  );

  return res.status(status).json(data);
};
