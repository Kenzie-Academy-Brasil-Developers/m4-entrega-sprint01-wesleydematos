import users from "../../database";
import { hash } from "bcryptjs";

export const updateUserService = async (body, idUserToUpdate) => {
  const indexUserToUpdate = users.findIndex(
    (user) => user.uuid === idUserToUpdate
  );

  if (body.password) {
    body.password = await hash(body.password, 10);
  }

  users[indexUserToUpdate] = {
    ...users[indexUserToUpdate],
    ...body,
  };

  const { password, ...userWithoutPassword } = users[indexUserToUpdate];

  return [200, userWithoutPassword];
};
