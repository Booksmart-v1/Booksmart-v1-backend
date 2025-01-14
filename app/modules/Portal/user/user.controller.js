const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const user = mongoose.model("user");
const wishlist = mongoose.model("wishlist");
const StreamChat = require("stream-chat").StreamChat;
const { generateOTP, fast2sms } = require("../../../../utils/otp.util");
const e = require("connect-timeout");
require("dotenv").config();

class UsersController extends Controller {
  async addUser() {
    try {
      let newCandidate = this.req.body;

      let { mobile, name, email, profilePicUrl } = this.req.body;

      if (mobile === undefined || name === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Mobile and name fields are required.",
        });
      }

      // check duplicate phone Number
      const phoneExist = await user.findOne({ mobile });

      if (phoneExist) {
        return this.res.status(400).json({
          success: false,
          message: "Phone Number already exists. Please Sign in.",
        });
      }

      const candidate = new user({
        ...newCandidate,
        usersInContact: [],
        booksSold: [],
        booksBought: [],
      });
      const user1 = await candidate.save();
      const newWishlist = new wishlist({
        userId: user1._id,
        bookIds: [],
      });
      const wl = await newWishlist.save();
      // generate otp
      const otp = generateOTP(6);
      // save otp to user collection
      user1.phoneOtp = otp;
      console.log(otp);
      user1.isAccountVerified = false;
      await user1.save();

      // send otp to phone number
      await fast2sms({
        // message: `Welcome ${name} to Booksmart! Your OTP for Booksmart sign Up is ${otp}`,
        message: `Your OTP for Booksmart sign Up is ${otp}.\n${name}, Welcome to Booksmart!\n${process.env.APP_HASH_KEY}`,
        mobile: user1.mobile,
      });
      let text = user1.mobile.toString();
      console.log(text.length);
      if (text.length === 10) {
        return this.res.status(200).json({
          success: true,
          message: `OTP sent to mobile number <b>${mobile}</b>`,
          data: {
            userId: user1._id,
          },
        });
      } else {
        return this.res.status(400).json({
          success: false,
          message: "Invalid Mobile Number",
        });
      }
      // return this.res.status(200).json({
      //   success: true,
      //   message: `OTP sent to mobile number <b>${mobile}</b>`,
      //   data: {
      //     userId: user1._id,
      //   },
      // });
    } catch (error) {
      const result = await user.deleteOne({ _id: user1._id });
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in adding candidate",
        error: error,
      });
    }
  }

  async updateUser() {
    try {
      let newCandidate = this.req.body;

      let { userId, name, email, profilePicUrl, story, status } = this.req.body;

      if (userId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "userId field is required.",
        });
      }

      let updateDoc = { $set: {} };
      if (name !== undefined) updateDoc.$set.name = name;
      if (email !== undefined) updateDoc.$set.email = email;
      if (profilePicUrl !== undefined)
        updateDoc.$set.profilePicUrl = profilePicUrl;

      if (story !== undefined) updateDoc.$set.story = story;
      if (status !== undefined) updateDoc.$set.status = status;

      const updateUser = await user.updateOne({ _id: userId }, updateDoc);

      return this.res.status(200).json({
        success: true,
        message: `Candidate updated successfully`,
        data: {
          userId: userId,
          name: name,
        },
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in updating candidate",
        error: error,
      });
    }
  }

  async getUser() {
    try {
      const { id } = this.req.query;
      if (id === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Requested id is undefined",
        });
      }
      const candidates = await user.find({ _id: id });
      return this.res.status(200).json({
        success: true,
        message: "Candidates fetched successfully",
        data: candidates[0],
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in fetching candidates",
        error: error,
      });
    }
  }

  async getOneUser() {
    try {
      let { userId } = this.req.query;
      const candidate = await user.findOne({ _id: userId });
      return this.res.status(200).json({
        success: true,
        message: "Candidates fetched successfully",
        data: candidate,
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in fetching candidate",
        error: error,
      });
    }
  }

  async loginUser() {
    try {
      let { mobile } = this.req.body;

      // check duplicate phone Number
      const user1 = await user.findOne({ mobile });
      if (!user1) {
        return this.res.status(400).json({
          success: false,
          message: "Phone Number does not exist. Please Sign up",
        });
      }
      console.log("mobile", user1.mobile.length);

      // if (user1.mobile.length != 10) {
      //   return this.res.status(400).json({
      //     success: false,
      //     message: "Invalid Mobile Number",
      //   });
      // }

      if (!user1.isAccountVerified) {
        await user1.deleteOne();
        return this.res.status(400).json({
          success: false,
          message: "User is not verified. Please Sign Up",
        });
      }

      //   newCandidate["candidateId"] = await this.verifyAndPrepareCandidateId();
      // create new user

      // const user1 = await candidate.save();
      // generate otp
      const otp = generateOTP(6);
      // save otp to user collection
      user1.phoneOtp = otp;
      await user1.save();
      console.log(otp);
      // send otp to phone number
      await fast2sms({
        // message: `Welcome ${name} to Booksmart! Your OTP for Booksmart sign Up is ${otp}`,
        message: `Your OTP for Booksmart sign in is ${otp}.\n${user1.name}, Welcome to Booksmart!\n${process.env.APP_HASH_KEY}`,
        mobile: user1.mobile,
      });

      console.log(user1.mobile);
      let text = user1.mobile.toString();
      console.log(text.length);
      if (text.length === 10) {
        return this.res.status(200).json({
          success: true,
          message: `OTP sent to mobile number <b>${mobile}</b>`,
          data: {
            userId: user1._id,
            authorization: this.req.authToken,
          },
        });
      } else if (text.length === 0) {
        return this.res.status(400).json({
          success: false,
          message: "Please enter atleast one digit in mobile number",
        });
      } else {
        return this.res.status(400).json({
          success: false,
          message: "Invalid Mobile Number",
        });
      }
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in adding candidate",
        error: error,
      });
    }
  }

  async verifyUser() {
    const { userId, otp } = this.req.body;
    const user1 = await user.findOne({ _id: userId });

    if (!user1) {
      return this.res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    console.log(this.req.authToken);
    console.log(this.req.refreshToken);
    console.log(user1);
    if (user1.phoneOtp === otp) {
      user1.phoneOtp = "";

      user1.isAccountVerified = true;
      await user1.save();

      return this.res.status(200).json({
        success: true,
        message: `Welcome back ${user1.name} !`,
        data: {
          userId: user1._id,
          name: user1.name,
          email: user1.email,
          authToken: this.req.authToken,
          refreshToken: this.req.refreshToken,
        },
      });
    } else {
      return this.res.status(400).json({
        success: false,
        message: "OTP does not match",
      });
    }
  }

  async refreshUser() {
    try {
      if (!this.req.token) {
        return this.res.status(400).json({
          success: false,
          message: "Token not found",
        });
      }
      return this.res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          token: this.req.token,
        },
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in refreshing token",
        error: error,
      });
    }
  }

  async verifyAndPrepareUserId(initial = "CAN") {
    let newId = await frequentUtility.generateNumber(6);
    let isUnique = false;
    while (!isUnique) {
      let candidateRecord = await user
        .findOne({
          candidateId: initial + newId,
        })
        .countDocuments();
      if (!candidateRecord) {
        isUnique = true;
      } else {
        newId = await frequentUtility.generateNumber(6);
      }
    }
    return initial + newId;
  }
}

module.exports = UsersController;
