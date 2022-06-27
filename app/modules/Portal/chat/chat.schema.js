const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ChatSchema = new schema({
  creator: { type: String, required: true },
  members: [{ type: String, required: true }],
  channelId: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  userName: { type: String, required: true },
  image: { type: String, required: false },
  mobile: { type: Number, required: false },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("chats", ChatSchema, "chats");
