import _ from "lodash";
import User from "../models/User.js";
import { verifyToken } from "../util/jwt.js";

export const access = async (req, res, next) => {
  const accessToken = req.headers;
  console.log(req.cookies);
  const { payload, expired } = verifyToken(accessToken);
  if (!payload || expired) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const isAccessTokenExist = await User.findOne({
    id: payload.id,
  });

  if (!isAccessTokenExist) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  req.user = isAccessTokenExist;
  return next();
};

export const refresh = async (req, res, next) => {
  const refreshToken = req.cookies;
  const isRefreshTokenExist = await User.findOne({
    refreshToken,
  });
  if (!isRefreshTokenExist) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  req.user = isRefreshTokenExist;
  return next();
};
