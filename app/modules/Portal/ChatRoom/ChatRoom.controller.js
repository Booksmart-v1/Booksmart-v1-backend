const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const ChatRoomUtil = mongoose.model("ChatRoom");
// const StreamChat = require("stream-chat").StreamChat;
const e = require("connect-timeout");

class ChatRoomController extends Controller {
  async initiateChat() {
    try {
      const { userIds, chatInitiator } = this.req.body;
      const availableRoom = await ChatRoomUtil.findOne({
        userIds: {
          $size: userIds.length,
          $all: [...userIds],
        },
      });
      if (availableRoom) {
        return this.res.status(200).json({
          success: true,
          message: "Retrieving an old chat room",
          data: {
            isNew: false,
            chatRoomId: availableRoom._doc._id,
          },
        });
      }

      const newRoom = await ChatRoomUtil.create({ userIds, chatInitiator });
      return this.res.status(200).json({
        success: true,
        message: "Creating a new chat room...",
        data: {
          isNew: true,
          chatRoomId: newRoom._doc._id,
        },
      });
    } catch (error) {
      console.log("error on start chat method", error);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}
module.exports = ChatRoomController;
