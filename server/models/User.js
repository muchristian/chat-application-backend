import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    refreshToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
