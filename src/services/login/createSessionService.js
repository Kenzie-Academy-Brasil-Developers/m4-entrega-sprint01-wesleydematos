import users from "../../database/index";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

export const createSessionService = async ({ email, password }) => {
  const foundUser = users.find((user) => user.email === email);
  const passwordMatch = await compare(password, foundUser.password);

  if (!foundUser || !passwordMatch) {
    return [
      401,
      {
        message: "Wrong email/password",
      },
    ];
  }

  const token = jwt.sign({ isAdm: foundUser.isAdm }, "SECRET_KEY", {
    expiresIn: "24h",
    subject: foundUser.uuid,
  });

  return [200, { token }];
};
