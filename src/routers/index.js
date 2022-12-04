import { Router } from "express";
import { createUserController } from "../controllers/users/createUserController";
import { createSessionController } from "../controllers/login/createSessionController";
import { ensureAuthMiddleware } from "../middlewares/ensureAuthMiddleware";
import { ensureYourselfOrAdmMiddleware } from "../middlewares/ensureYourselfOrAdmMiddleware";
import { listUsersController } from "../controllers/users/listUserController";
import { retrieveUserController } from "../controllers/users/retrieveUserController";
import { updateUserController } from "../controllers/users/updateUserController";
import { deleteUserController } from "../controllers/users/deleteUserController";

export const router = Router();

router.post("/users", createUserController);
router.post("/login", createSessionController);
router.get(
  "/users",
  ensureAuthMiddleware,
  ensureYourselfOrAdmMiddleware,
  listUsersController
);
router.get("/users/profile", ensureAuthMiddleware, retrieveUserController);
router.patch(
  "/users/:id",
  ensureAuthMiddleware,
  ensureYourselfOrAdmMiddleware,
  updateUserController
);
router.delete(
  "/users/:id",
  ensureAuthMiddleware,
  ensureYourselfOrAdmMiddleware,
  deleteUserController
);
