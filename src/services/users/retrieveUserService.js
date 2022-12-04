import users from "../../database";

export const retrieveUserService = (requestUser) => {
  const foundUser = users.find((user) => user.uuid === requestUser);
  const { password, ...foundUserToShow } = foundUser;

  return [200, foundUserToShow];
};
