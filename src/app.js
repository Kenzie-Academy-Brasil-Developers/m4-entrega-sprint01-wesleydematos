import express from "express";

import { createUserController } from "./controllers/users/createUserController";
import { createSessionController } from "./controllers/login/createSessionController";
import { listUsersController } from "./controllers/users/listUserController";
import { retrieveUserController } from "./controllers/users/retrieveUserController";
import { updateUserController } from "./controllers/users/updateUserController";
import { deleteUserController } from "./controllers/users/deleteUserController";
import { ensureAuthMiddleware } from "./middlewares/ensureAuthMiddleware";
import { ensureYourselfOrAdmMiddleware } from "./middlewares/ensureYourselfOrAdmMiddleware";

const app = express();
app.use(express.json());

//routes
app.post("/users", createUserController);
app.post("/login", createSessionController);
app.get(
  "/users",
  ensureAuthMiddleware,
  ensureYourselfOrAdmMiddleware,
  listUsersController
);
app.get("/users/profile", ensureAuthMiddleware, retrieveUserController);
app.patch(
  "/users/:id",
  ensureAuthMiddleware,
  ensureYourselfOrAdmMiddleware,
  updateUserController
);
app.delete(
  "/users/:id",
  ensureAuthMiddleware,
  ensureYourselfOrAdmMiddleware,
  deleteUserController
);

export default app;
