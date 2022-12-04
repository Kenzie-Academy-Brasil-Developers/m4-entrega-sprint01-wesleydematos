import users from "../../database";

export const deleteUserService = (userId) => {
  const foundIndex = users.findIndex((user) => user.uuid === userId);
  users.splice(foundIndex, 1);

  return [204, {}];
};
