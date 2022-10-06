const jwt = require("jsonwebtoken");
// models
const mongoose = require("mongoose");

const userBody = mongoose.model("user");

const SECRET_KEY = "password234";

const encode = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const user = await userBody.findOne({ mobile: mobile });
    const payload = {
      userId: user._id,
      mobile: mobile,
    };
    const authToken = jwt.sign(payload, SECRET_KEY);
    console.log("Auth", authToken);
    req.authToken = authToken;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
};

const decode = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res
      .status(400)
      .json({ success: false, message: "No access token provided" });
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.userId;
    req.userType = decoded.type;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
module.exports = { encode: encode, docode: decode };
