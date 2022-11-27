import express from "express";
import users from "./database";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

//services
const createUserService = async (userData) => {
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

const createSessionService = async ({ email, password }) => {
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

  const token = jwt.sign({}, "SECRET_KEY", {
    expiresIn: "24h",
    subject: foundUser.uuid,
  });

  return [200, { token }];
};

const listUsersService = (authorization) => {
  if (!authorization) {
    return [401, { message: "Missing authorization headers" }];
  }

  authorization = authorization.split(" ")[1];

  return jwt.verify(authorization, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return [401, { message: "Missing authorization headers" }];
    }

    return [200, users];
  });
};
const retrieveUserService = (authorization) => {
  if (!authorization) {
    return [401, { message: "Missing authorization headers" }];
  }

  authorization = authorization.split(" ")[1];

  return jwt.verify(authorization, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return [401, { message: "Missing authorization headers" }];
    }
    const foundUser = users.find((user) => user.uuid === decoded.sub);
    const foudUserToShow = { ...foundUser };
    delete foudUserToShow.password;

    return [200, foudUserToShow];
  });
};
const updateUserService = (userId) => {};

const deleteUserService = (userId, authorization) => {
  if (!authorization) {
    return [401, { message: "Missing authorization headers" }];
  }

  authorization = authorization.split(" ")[1];

  return jwt.verify(authorization, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return [401, { message: "Missing authorization headers" }];
    }

    const foundUser = users.find((user) => user.uuid === userId);

    if (!foundUser) {
      return [
        404,
        {
          message: "User not found!",
        },
      ];
    }

    const index = users.findIndex((user) => user.uuid === userId);
    users.splice(index, 1);

    return [204, {}];
  });
};

//controllers
const createUserController = async (req, res) => {
  const [status, data] = await createUserService(req.body);

  return res.status(status).json(data);
};

const createSessionController = async (req, res) => {
  const [status, data] = await createSessionService(req.body);

  return res.status(status).json(data);
};

const listUsersController = (req, res) => {
  const token = req.headers.authorization;
  const [status, data] = listUsersService(token);

  return res.status(status).json(data);
};

const retrieveUserController = (req, res) => {
  const token = req.headers.authorization;
  const [status, data] = retrieveUserService(token);

  return res.status(status).json(data);
};

const updateUserController = (req, res) => {};

const deleteUserController = (req, res) => {
  const [status, data] = deleteUserService(
    req.params.id,
    req.headers.authorization
  );

  return res.status(status).json(data);
};

//routes
app.post("/users", createUserController);
app.post("/login", createSessionController);
app.get("/users", listUsersController);
app.get("/users/profile", retrieveUserController);
app.patch("/users/:id", updateUserController);
app.delete("/users/:id", deleteUserController);

app.listen(3000, () => {
  console.log("Server running in port 3000");
});

export default app;
