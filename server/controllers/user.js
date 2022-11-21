import User from "../models/User.js";
import { comparePassword, hashPassword } from "../util/bcrypt.js";
import { generateToken } from "../util/jwt.js";
import _ from "lodash";

export const getAllUsers = async (req, res) => {
  const maxResults = 10;
  let users = [];

  try {
    const findAll = await User.find({});
    console.log(findAll);
    userRecords.users.forEach((user) => {
      const { uid, email, displayName, photoURL } = user;
      const username = findAll.filter((v) => v.email === email);
      console.log(username);
      users.push({
        uid,
        email,
        displayName,
        photoURL,
        username: username[0] ? username[0].username : null,
      });
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const usernm = await User.findOne({ email: userRecord.email }).exec();
    console.log(usernm["username"]);
    const result = {
      ...userRecord,
      username:
        usernm["username"] !== null ? usernm["username"] : userRecord["email"],
    };

    const { uid, email, displayName, photoURL, username } = result;

    return res
      .status(200)
      .json({ uid, email, displayName, photoURL, username });
  } catch (error) {
    console.log(error);
  }
};

export const bulkDeleteUsers = async (req, res) => {
  console.log("delete");
  await User.deleteMany();
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({
    email,
  }).exec();
  if (findUser) {
    return res
      .status(201)
      .json({ message: "User with this email already exist" });
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return res
      .status(201)
      .json({ message: "New user have been created", data: newUser });
  } catch (error) {
    console.log(error);
    return res.status(409).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({
      email,
    }).exec();
    if (!findUser) {
      return res
        .status(201)
        .json({ message: "Email or password are incorrect" });
    }
    if (!(await comparePassword(password, findUser.password))) {
      return res
        .status(201)
        .json({ message: "Email or password are incorrect" });
    }

    const accessToken = generateToken({
      id: findUser._id,
      ..._.pick(findUser, ["firstname", "lastname", "email"]),
    });

    const refreshToken = generateToken(
      {
        id: findUser._id,
        ..._.pick(findUser, ["firstname", "lastname", "email"]),
      },
      "1y"
    );

    await User.updateOne(
      { _id: findUser._id },
      {
        refreshToken,
      }
    );

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res.status(200).json({
      message: "You've logged in successfully",
      data: findUser,
      token: refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(409).json({
      message: error.message,
    });
  }
};

export const refreshToken = (req, res) => {
  const { _id } = req.user;
  const accessToken = generateToken({
    id: _id,
    ..._.pick(req.user, ["firstName", "lastName", "email"]),
  });
  req.cookie("accessToken", accessToken, { httpOnly: true });
  return res.status(200).json({
    message: "Access token has been refreshed successfully",
    data: undefined,
    token: accessToken,
  });
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({
    message: "logged out",
  });
};
