import auth from "../config/firebase-config.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  const maxResults = 10;
  let users = [];

  try {
    const userRecords = await auth.listUsers(maxResults);
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
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.params.userId);

    const { uid, email, displayName, photoURL } = userRecord;

    res.status(200).json({ uid, email, displayName, photoURL });
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (req, res) => {
  const findUser = await User.findOne().exec();
  if (findUser) {
    res.status(201).json({ message: "User with this username already exist" });
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
  });
  try {
    await newUser.save();
    return res
      .status(201)
      .json({ message: "New user have been created", data: newUser });
  } catch (error) {
    return res.status(409).json({
      message: error.message,
    });
  }
};
