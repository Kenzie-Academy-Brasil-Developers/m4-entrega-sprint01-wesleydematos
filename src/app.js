import express from "express";
import users from "./database";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

//services
const createUserService = (userData) => {
  let user = {
    ...userData,
    createdOn: new Date(),
    updatedOn: new Date(),
    uuid: uuidv4(),
  };

  users.push(user);

  let userToShow = { ...user };
  delete userToShow.password;

  return [201, userToShow];
};

const createSessionService = () => {};
const listUsersService = () => {};
const retrieveUserService = () => {};
const updateUserService = (userId) => {};

const deleteUserService = (userId) => {
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
};

//controllers
const createUserController = (req, res) => {
  const [status, data] = createUserService(req.body);

  return res.status(status).json(data);
};

const createSessionController = (req, res) => {};

const listUsersController = (req, res) => {
  return res.json(users);
};

const retrieveUserController = (req, res) => {};

const updateUserController = (req, res) => {};

const deleteUserController = (req, res) => {
  const [status, data] = deleteUserService(req.params.id);

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

// app.get("/users/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const foundUser = users.find((user) => user.uuid === userId);

//   if (!foundUser) {
//     return res.status(404).json({ message: "User not found!" });
//   }

//   return res.json(foundUser);
// });
