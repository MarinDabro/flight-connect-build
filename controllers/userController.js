import UserCollection from "../models/usersschema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserCollection.find();
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserCollection.findById(id);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    const error = new Error("This user does not exist");
    error.status = 404;
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = new UserCollection(req.body);
    if (req.file) {
      user.profileImage = `/${req.file.filename}`;
    }
    await user.save();
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    let user = await UserCollection.findById(req.params.id);
    if (req.file) {
      user.profileImage = `/${req.file.filename}`;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();

    let newBody = {};
    for (const key in req.body) {
      if (req.body[key] !== "" && key !== "password") {
        newBody[key] = req.body[key];
      }
    }
    const updateUser = await UserCollection.findByIdAndUpdate(
      req.params.id,
      newBody,
      { new: true }
    ).populate("flights");
    res.json({
      success: true,
      data: updateUser,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existUser = await UserCollection.findById(id);
    if (existUser) {
      const deleteStatus = await UserCollection.deleteOne({ _id: existUser });
      res.json({ success: true, status: deleteStatus });
    }
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await UserCollection.findOne({ email: req.body.email });
    if (user) {
      const check = await bcrypt.compare(req.body.password, user.password);
      if (check) {
        let token = jwt.sign(
          { _id: user._id, firstName: user.firstName },
          process.env.TOKEN_SECRET_KEY,
          { expiresIn: "1h", issuer: "user", audience: "travelers" }
        );

        const updateUser = await UserCollection.findByIdAndUpdate(
          user._id,
          { token: token },
          { new: true }
        ).populate("flights");
        res.header("token", token);
        res.json({
          success: true,
          data: updateUser,
        });
      } else {
        const error = new Error("Password does not match");
        console.log(error);
        throw error;
      }
    } else {
      throw new Error("Email does not match");
    }
  } catch (err) {
    next(err);
  }
};

export const checkUserToken = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const user = await UserCollection.findById(payload._id).populate("flights");
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
