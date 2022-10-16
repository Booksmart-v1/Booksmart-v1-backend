const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const ChatMessageUtil = mongoose.model("ChatMessage");
// const StreamChat = require("stream-chat").StreamChat;
const e = require("connect-timeout");

class ChatMessageController extends Controller {
  async postInChatRoom() {
    try {
      const { chatRoomId, message, postedByUser } = this.req.body;
      const post = await ChatMessageUtil.create({
        chatRoomId,
        message,
        postedByUser,
        readByRecipients: { readByUserId: postedByUser },
      });
      const aggregate = await ChatMessageUtil.aggregate([
        // get post where _id = post._id
        { $match: { _id: post._id } },
        // do a join on another table called users, and
        // get me a user whose _id = postedByUser
        {
          $lookup: {
            from: "users",
            localField: "postedByUser",
            foreignField: "_id",
            as: "postedByUser",
          },
        },
        { $unwind: "$postedByUser" },
        // do a join on another table called chatrooms, and
        // get me a chatroom whose _id = chatRoomId
        {
          $lookup: {
            from: "chatrooms",
            localField: "chatRoomId",
            foreignField: "_id",
            as: "chatRoomInfo",
          },
        },
        { $unwind: "$chatRoomInfo" },
        { $unwind: "$chatRoomInfo.userIds" },
        // do a join on another table called users, and
        // get me a user whose _id = userIds
        {
          $lookup: {
            from: "users",
            localField: "chatRoomInfo.userIds",
            foreignField: "_id",
            as: "chatRoomInfo.userProfile",
          },
        },
        { $unwind: "$chatRoomInfo.userProfile" },
        // group data
        {
          $group: {
            _id: "$chatRoomInfo._id",
            postId: { $last: "$_id" },
            chatRoomId: { $last: "$chatRoomInfo._id" },
            message: { $last: "$message" },
            type: { $last: "$type" },
            postedByUser: { $last: "$postedByUser" },
            readByRecipients: { $last: "$readByRecipients" },
            chatRoomInfo: { $addToSet: "$chatRoomInfo.userProfile" },
            createdAt: { $last: "$createdAt" },
            updatedAt: { $last: "$updatedAt" },
          },
        },
      ]);
      return this.res.status(200).json({
        success: true,
        message: "Message was sent successfully",
        data: aggregate[0],
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
module.exports = ChatMessageController;
