const jwt = require("jsonwebtoken");
// models
const mongoose = require("mongoose");

const userUtil = mongoose.model("user");

const SECRET_KEY = process.env.JWTSECRET
  ? process.env.JWTSECRET
  : "qpalzmwoskxn";

const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY 
  ? process.env.REFRESH_SECRET_KEY
  : "mznxbclaksjdhf";

const authenticate = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await userUtil.findOne({ _id: userId });
    const payload = {
      userId: user._id,
      userName: user.name,
      mobile: user.mobile,
    };
    console.log(SECRET_KEY);
    const authToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    console.log("Auth", authToken);
    req.authToken = authToken;
    req.refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "5d" });
    next();
  } catch (error) {
    console.log(error);

    return res.status(400).json({ success: false, message: error.error });
  }
};

const deAuthenticate = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      success: false,
      message: "No auth token providied in authorization",
    });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.userId;
    req.userName = decoded.userName;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

const newToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      success: false,
      message: "No auth token providied in authorization",
    });
  }
  const refreshToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, REFRESH_SECRET_KEY);
    req.token = jwt.sign( decoded, SECRET_KEY, { expiresIn: "1h" });
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { en: authenticate, de: deAuthenticate, newToken };
