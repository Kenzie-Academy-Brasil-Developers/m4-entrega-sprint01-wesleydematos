import { listUserService } from "../../services/users/listUserService";

export const listUsersController = (req, res) => {
  const [status, data] = listUserService();
  return res.status(status).json(data);
};
