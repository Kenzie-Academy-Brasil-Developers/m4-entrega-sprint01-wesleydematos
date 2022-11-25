import express from "express";
import users from "./database";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

app.post("/users", (req, res) => {
  let user = {
    ...req.body,
    createdOn: new Date(),
    updatedOn: new Date(),
    uuid: uuidv4(),
  };
  users.push(user);

  let userToShow = { ...user };
  delete userToShow.password;

  return res.status(201).json(userToShow);
});

app.get("/users", (req, res) => {
  return res.json(users);
});

app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;
  const foundUser = users.find((user) => user.uuid === userId);

  if (!foundUser) {
    return res.status(404).json({ message: "User not found!" });
  }

  return res.json(foundUser);
});

app.listen(3000, () => {
  console.log("Server running in port 3000");
});

export default app;
