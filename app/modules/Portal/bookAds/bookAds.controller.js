const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const bookAd = mongoose.model("bookAds");
// const StreamChat = require("stream-chat").StreamChat;
const e = require("connect-timeout");

class BookAdsController extends Controller {
  async addBookAds() {
    try {
      let newBookAds = this.req.body;
      let {
        bookId,
        sellerId,
        sellerName,
        interestedBuyers,
        bookName,
        bookPrice,
        bookImageUrl,
        bookAuthor,
        bookDescription,
        bookCondition,
        tags,
        sellerAddress,
        sellerPincode,
        sold,
      } = this.req.body;
      if (
        bookId === undefined ||
        sellerId === undefined ||
        sellerName === undefined ||
        bookName === undefined ||
        bookPrice === undefined ||
        bookAuthor === undefined ||
        bookCondition === undefined ||
        tags === undefined ||
        sellerAddress === undefined ||
        sellerPincode === undefined ||
        sold === undefined
      ) {
        console.log(bookId);
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      if (sellerPincode.length !== 6) {
        return this.res.status(400).json({
          success: false,
          message: "Please enter valid pincode",
        });
      }
      console.log(bookId);
      const candidate = new bookAd({
        ...newBookAds,
      });
      const savedBookAd = await candidate.save();
      return this.res.status(200).json({
        success: true,
        message: `Book Ads added successfully`,
        data: {
          bookAdId: savedBookAd._id,
          bookPrice: savedBookAd.bookPrice,
          bookName: savedBookAd.bookName,
          bookAuthor: savedBookAd.bookAuthor,
          bookCondition: savedBookAd.bookCondition,
          tags: savedBookAd.tags,
          sellerAddress: savedBookAd.sellerAddress,
          sold: savedBookAd.sold,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getBookAds() {
    try {
      let { limit, userId } = this.req.query;
      if (limit === undefined || userId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      //   let bookAds = await bookAd.find({});
      let bookAdLimits = await bookAd.find({}).limit(limit);
      return this.res.status(200).json({
        success: true,
        message: "Book Ads fetched successfully",
        data: bookAdLimits,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getMyBookAds() {
    try {
      let { limit, userId } = this.req.query;
      if (limit === undefined || userId === undefined) {
        console.log(limit, userId);
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      let a = await bookAd.find({
        sellerId: userId,
      });
      // console.log(a);
      console.log(typeof a);
      if (a.length === 0) {
        a = [];
      }
      let b = await bookAd.find({}).where("interestedBuyers").all(userId);
      if (b.length === 0) {
        b = [];
      }
      // const union = [...new Set([...a, ...b])];

      return this.res.status(200).json({
        success: true,
        message: "My Book Ads fetched successfully",
        data: {
          selling: a,
          buying: b,
        },
      });
    } catch (e) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}
module.exports = BookAdsController;
