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

    const userId = decoded.sub;
    const foundUser = users.find((user) => user.uuid === userId);

    if (!foundUser.isAdm) {
      return [
        403,
        {
          message: "missing admin permissions",
        },
      ];
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
const updateUserService = async (body, userId, authorization) => {
  // body.password = await hash(body.password, 10);
  // uuid: uuidv4(),

  if (!authorization) {
    return [401, { message: "Missing authorization headers" }];
  }

  authorization = authorization.split(" ")[1];

  return jwt.verify(authorization, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return [401, { message: "Missing authorization headers" }];
    }
    const foundAdm = users.find((user) => user.uuid === decoded.sub);
    const foundUser = users.find((user) => user.uuid === userId);
    const foundIndex = users.findIndex((user) => user.uuid === userId);

    if (decoded.sub === userId && !foundAdm.isAdm) {
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
  });
};

const deleteUserService = (userId, authorization) => {
  if (!authorization) {
    return [401, { message: "Missing authorization headers" }];
  }

  authorization = authorization.split(" ")[1];

  return jwt.verify(authorization, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return [401, { message: "Missing authorization headers" }];
    }
    const foundIndex = users.findIndex((user) => user.uuid === userId);
    const userRequest = users.find((user) => user.uuid === decoded.sub);

    if (userId === decoded.sub) {
      users.splice(foundIndex, 1);

      return [204, {}];
    }

    if (userRequest.isAdm) {
      users.splice(foundIndex, 1);

      return [204, {}];
    }

    return [
      403,
      {
        message: "missing admin permissions",
      },
    ];
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

const updateUserController = async (req, res) => {
  const [status, data] = await updateUserService(
    req.body,
    req.params.id,
    req.headers.authorization
  );

  return res.status(status).json(data);
};

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
