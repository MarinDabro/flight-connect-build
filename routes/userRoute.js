import express, { Router } from "express";
import {
  checkUserToken,
  getAllUsers,
  getUser,
  loginUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { userValidation } from "../middlewares/validateMiddleware.js";
const route = express.Router();

//===> Get All Users

route.get("/", verifyToken, isAdmin, getAllUsers);

// ===> Login
route.post("/login", loginUser);
//===> verifyToken get
route.get("/checkusertoken", checkUserToken);

//===> Get user
route.get("/:id", verifyToken, isAdmin, getUser);

//===> create user
route.post("/", userValidation, createUser);

//===> update user

route.patch("/:id", verifyToken, updateUser);

//===> Delete user

route.delete("/:id", verifyToken, deleteUser);

export default route;
