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

const listUsersService = () => {};

//controllers
const createUserController = (req, res) => {
  const [status, data] = createUserService(req.body);

  return res.status(status).json(data);
};

const listUsersController = (req, res) => {
  return res.json(users);
};

app.post("/users", createUserController);
app.get("/users", listUsersController);

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
