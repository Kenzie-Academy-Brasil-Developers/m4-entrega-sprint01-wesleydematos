import users from "../../database";

export const listUserService = () => {
  return [200, users];
};
