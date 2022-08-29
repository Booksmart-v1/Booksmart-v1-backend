const mongoose = require("mongoose");
const schema = mongoose.Schema;

const notifSchema = new schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  receiverId: { type: String, required: true },
  //   receivers: [
  //     {
  //       type: String,
  //       required: false,
  //     },
  //   ],
  message: { type: String, required: true },
  type: { type: String, required: true }, //interest,res,admin
  IsRead: { type: Boolean, required: false },
  bookAdId: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("notifs", notifSchema, "notifs");
