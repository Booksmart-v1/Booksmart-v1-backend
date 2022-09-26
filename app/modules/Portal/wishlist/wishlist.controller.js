const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const wishlist = mongoose.model("wishlist");
// const StreamChat = require("stream-chat").StreamChat;
const e = require("connect-timeout");

class wishlistController extends Controller {
  async addBookToWishlist() {
    try {
      let toWishlist = this.req.body;
      let { userId, bookId } = this.req.body;
      if (bookId === undefined || userId === undefined) {
        console.log(bookId);
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }

      let currWishlist = await wishlist.findOne({ userId: userId });
      currWishlist.bookIds.push(bookId);
      const newWishlist = {
        $set: {
          bookIds: currWishlist.bookIds,
        },
      };
      const result = await wishlist.updateOne({ userId: userId }, newWishlist);

      return this.res.status(200).json({
        success: true,
        message: `Book added successfully to your wishlist`,
        data: result,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getWishlist() {
    try {
      let { userId } = this.req.query;
      if (userId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      //   let bookAds = await bookAd.find({});
      let list = await wishlist.find({ userId: userId });
      return this.res.status(200).json({
        success: true,
        message: "Book Ads fetched successfully",
        data: list,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = wishlistController;
