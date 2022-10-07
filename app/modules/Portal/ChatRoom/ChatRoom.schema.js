const mongoose = require("mongoose");

// export const CHAT_ROOM_TYPES = {
//   CONSUMER_TO_CONSUMER: "consumer-to-consumer",
//   CONSUMER_TO_SUPPORT: "consumer-to-support",
// };

const chatRoomSchema = new mongoose.Schema({
  userIds: Array,
  chatInitiator: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mongoose.model("ChatRoom", chatRoomSchema, "ChatRoom");
