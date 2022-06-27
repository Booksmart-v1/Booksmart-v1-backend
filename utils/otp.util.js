const fast2sms = require("fast-two-sms");
const { fast2smsAPI } = require("../configs/configs.js");
const apikey = fast2smsAPI.authorization;
console.log(fast2smsAPI);

exports.generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

exports.fast2sms = async ({ message, mobile }) => {
  try {
    console.log(apikey);
    const res = await fast2sms.sendMessage({
      authorization: apikey,
      message,
      numbers: [mobile],
    });
    console.log(res);
  } catch (error) {
    console.log(error);
    console.log(fast2sms);
  }
};
