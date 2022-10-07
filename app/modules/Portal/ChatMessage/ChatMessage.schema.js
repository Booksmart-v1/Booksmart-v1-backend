const mongoose = require("mongoose");
// export const CHAT_ROOM_TYPES = {
//   CONSUMER_TO_CONSUMER: "consumer-to-consumer",
//   CONSUMER_TO_SUPPORT: "consumer-to-support",
// };
const MESSAGE_TYPES = {
  TYPE_TEXT: "text",
};

const readByRecipientSchema = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const chatMessageSchema = new mongoose.Schema({
  chatRoomId: String,
  message: mongoose.Schema.Types.Mixed,
  type: {
    type: String,
    default: () => MESSAGE_TYPES.TYPE_TEXT,
  },
  postedByUser: String,
  readByRecipients: [readByRecipientSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mongoose.model("ChatMessage", chatMessageSchema, "ChatMessage");
