const mongoose = require('mongoose');
const Controller = require('../../Base/Controller');
const FrequentUtility = require('../../../services/Frequent');
const frequentUtility = new FrequentUtility();
const user = mongoose.model('user');
const wishlist = mongoose.model('wishlist');
const StreamChat = require('stream-chat').StreamChat;
const { generateOTP, fast2sms } = require('../../../../utils/otp.util');
const e = require('connect-timeout');
require('dotenv').config();

class UsersController extends Controller {
  async addUser() {
    try {
      let newCandidate = this.req.body;

      let { mobile, name } = this.req.body;

      // check duplicate phone Number
      const phoneExist = await user.findOne({ mobile });

      if (phoneExist) {
        return this.res.status(400).json({
          success: false,
          message: 'Phone Number already exists. Please Sign in.',
        });
      }

      //   newCandidate["candidateId"] = await this.verifyAndPrepareCandidateId();
      // create new user

      const candidate = new user({
        ...newCandidate,
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
          message: 'Invalid Mobile Number',
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
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: 'A110: Error in adding candidate',
        error: error,
      });
    }
  }

  async getUser() {
    try {
      const candidates = await user.find({});
      return this.res.status(200).json({
        success: true,
        message: 'Candidates fetched successfully',
        data: candidates,
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: 'A110: Error in fetching candidates',
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
          message: 'Phone Number does not exist. Please Sign up',
        });
      }
      console.log('mobile', user1.mobile.length);

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
          message: 'User is not verified. Please Sign Up',
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
          message: 'Please enter atleast one digit in mobile number',
        });
      } else {
        return this.res.status(400).json({
          success: false,
          message: 'Invalid Mobile Number',
        });
      }
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: 'A110: Error in adding candidate',
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
        message: 'User does not exist',
      });
    }

    console.log(user1);
    if (user1.phoneOtp === otp) {
      user1.phoneOtp = '';
      user1.isAccountVerified = true;
      await user1.save();
      const serverClient = StreamChat.getInstance(
        'unc9a4tjee5z',
        'qn9tf23rsvd2sfh35e5nvfp3uzag44q6zaqvrvksrgvaj6x82mbvmapycvq779gt'
      );
      const token = serverClient.createToken(user1.name);
      return this.res.status(200).json({
        success: true,
        message: `Welcome back ${user1.name} !`,
        data: {
          userId: user1._id,
          name: user1.name,
          email: user1.email,
          token: token,
        },
      });
    } else {
      return this.res.status(400).json({
        success: false,
        message: 'OTP does not match',
      });
    }
  }

  async verifyAndPrepareUserId(initial = 'CAN') {
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
