const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bookSchema = new schema({
  bookId: { type: String, required: true },
  bookName: { type: String, required: true },
  //   bookPrice: { type: Number, required: true },
  bookImageUrl: { type: String, required: false },
  bookAuthor: { type: String, required: true },
  bookDescription: { type: String, required: false },
  //   bookCondition: { type: String, required: true },
  //   sold: { type: Boolean, required: true },
  ISBN: { type: String, required: true },
  rating: { type: Number, required: false },
  // rating: { type: Number, required: true },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("book", bookSchema, "book");
