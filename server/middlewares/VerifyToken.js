import * as jwt from "../util/jwt";

export const VerifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodeValue = jwt.verifyToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth.token;

  try {
    const decodeValue = jwt.verifyToken(token);

    if (decodeValue) {
      socket.user = decodeValue;

      return next();
    }
  } catch (e) {
    return next(new Error("Internal Error"));
  }
};
