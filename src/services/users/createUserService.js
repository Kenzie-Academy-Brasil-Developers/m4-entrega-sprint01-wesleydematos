import users from "../../database";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";

export const createUserService = async (userData) => {
  let user = {
    ...userData,
    password: await hash(userData.password, 10),
    createdOn: new Date(),
    updatedOn: new Date(),
    uuid: uuidv4(),
  };

  const userExists = users.find((el) => {
    return el.email == userData.email;
  });

  if (userExists) {
    return [409, { message: "user already exists" }];
  }

  users.push(user);

  let userToShow = { ...user };
  delete userToShow.password;

  return [201, userToShow];
};
