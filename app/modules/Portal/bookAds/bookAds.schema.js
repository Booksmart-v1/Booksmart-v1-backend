const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bookAdsSchema = new schema({
  AdId: { type: String, required: false },
  bookId: { type: String, required: true },
  sellerId: { type: String, required: true },
  sellerName: { type: String, required: true },
  interestedBuyers: [
    {
      type: String,
      required: false,
    },
  ],
  sellerAddress: { type: String, required: true },
  sellerPincode: { type: String, required: true },
  bookName: { type: String, required: true },
  bookPrice: { type: Number, required: true },
  bookImageUrl: { type: String, required: false },
  bookAuthor: { type: String, required: true },
  bookDescription: { type: String, required: false },
  bookCondition: { type: String, required: true },
  sold: { type: Boolean, required: true },
  isLiked: { type: Boolean, required: true },

  tags: [
    {
      type: String,
      required: false,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("bookAds", bookAdsSchema, "bookAds");
