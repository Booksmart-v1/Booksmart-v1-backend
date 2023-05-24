const mongoose = require("mongoose");
const schema = mongoose.Schema;

const wishlistSchema = new schema({
  userId: { type: String, required: true },
  bookIds: [
    {
      type: String,
      required: true,
    },
  ],
  bookName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("wishlist", wishlistSchema, "wishlist");
