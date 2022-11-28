import express from "express";
import users from "./database";
import { v4 as uuidv4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

//middlewares
const ensureAuthMiddleware = (req, res, next) => {
  let authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "Missing authorization headers" });
  }

  authorization = authorization.split(" ")[1];

  return jwt.verify(authorization, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Missing authorization headers" });
    }

    req.isAdm = decoded.isAdm;
    req.requestUser = decoded.sub;

    return next();
  });
};

const ensureAdmMiddleware = (req, res, next) => {
  if (!req.isAdm) {
    return res.status(403).json({
      message: "missing admin permissions",
    });
  }

  next();
};

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

  const token = jwt.sign({ isAdm: foundUser.isAdm }, "SECRET_KEY", {
    expiresIn: "24h",
    subject: foundUser.uuid,
  });

  return [200, { token }];
};

const retrieveUserService = (requestUser) => {
  const foundUser = users.find((user) => user.uuid === requestUser);
  const foudUserToShow = { ...foundUser };
  delete foudUserToShow.password;

  return [200, foudUserToShow];
};

const updateUserService = async (body, userId, requestUser) => {
  const foundAdm = users.find((user) => user.uuid === requestUser);
  const foundUser = users.find((user) => user.uuid === userId);
  const foundIndex = users.findIndex((user) => user.uuid === userId);

  if (requestUser === userId && !foundAdm.isAdm) {
    body.updatedOn = new Date();
    body.createdOn = foundUser.createdOn;
    body.email = foundUser.email;
    body.isAdm = foundUser.isAdm;
    body.uuid = foundUser.uuid;
    users.splice(foundIndex, 1, body);
    delete body.password;

    return [200, body];
  }

  if (!foundAdm.isAdm) {
    return [
      403,
      {
        message: "missing admin permissions",
      },
    ];
  }

  if (!foundUser) {
    return [
      404,
      {
        message: "User not found!",
      },
    ];
  }

  body.updatedOn = new Date();
  users.splice(foundIndex, 1, body);
  return [200, body];
};

const deleteUserService = (userId, requestUser) => {
  const foundIndex = users.findIndex((user) => user.uuid === userId);
  const userRequest = users.find((user) => user.uuid === requestUser);

  if (userId === requestUser) {
    users.splice(foundIndex, 1);

    return [204, {}];
  }

  if (userRequest.isAdm) {
    users.splice(foundIndex, 1);

    return [204, {}];
  }
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
  return res.status(200).json(users);
};

const retrieveUserController = (req, res) => {
  const [status, data] = retrieveUserService(req.requestUser);

  return res.status(status).json(data);
};

const updateUserController = async (req, res) => {
  const [status, data] = await updateUserService(
    req.body,
    req.params.id,
    req.requestUser
  );

  return res.status(status).json(data);
};

const deleteUserController = (req, res) => {
  const [status, data] = deleteUserService(req.params.id, req.requestUser);

  return res.status(status).json(data);
};

//routes
app.post("/users", createUserController);
app.post("/login", createSessionController);
app.get(
  "/users",
  ensureAuthMiddleware,
  ensureAdmMiddleware,
  listUsersController
);
app.get("/users/profile", ensureAuthMiddleware, retrieveUserController);
app.patch("/users/:id", ensureAuthMiddleware, updateUserController);
app.delete(
  "/users/:id",
  ensureAuthMiddleware,
  ensureAdmMiddleware,
  deleteUserController
);

app.listen(3000, () => {
  console.log("Server running in port 3000");
});

export default app;
