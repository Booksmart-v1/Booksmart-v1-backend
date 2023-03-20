const mongoose = require('mongoose');
const Controller = require('../../Base/Controller');
const FrequentUtility = require('../../../services/Frequent');
const frequentUtility = new FrequentUtility();
const ChatRoomUtil = mongoose.model('ChatRoom');
const UserUtil = mongoose.model('user');
// const StreamChat = require("stream-chat").StreamChat;
const e = require('connect-timeout');

class ChatRoomController extends Controller {
  // async getChats() {
  //   try {

  //     const { userId } = this.req.query;

  //   } catch(e) {
  //     console.log('error on start chat method', error);
  //     return this.res.status(500).json({
  //       success: false,
  //       message: 'Something went wrong',
  //     });
  //   }
  // }

  async initiateChat() {
    try {
      const { sellerId, buyerId, bookAdId, chatInitiator } = this.req.body;
      if (sellerId === undefined || buyerId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: 'Please provide seller and buyer Id.',
        });
      }
      

      const availableRooms = await ChatRoomUtil.find({
        userIds: {
          $size: 2,
          $all: [sellerId, buyerId],
        },
        // bookAdId: bookAdId
      });
      const userIds = [sellerId, buyerId];
      console.log(userIds);
      availableRoomIds=[]

      for(let i =0;i<availableRooms.length;i++){
        availableRoomIds.push(availableRooms[i]._doc._id);
      }

      if (availableRoom) {
        console.log('Room available');
        return this.res.status(200).json({
          success: true,
          message: 'Retrieving an old chat room',
          data: {
            isNew: false,
            chatRoomIds: availableRoomIds,
          },
        });
      }

      if (chatInitiator === undefined) {
        return this.res.status(400).json({
          success: false,
          message: 'Please provide initiator of new chat.',
        });
      }
      if (bookAdId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: 'Please provide id of book Ad the chat will pertain to.',
        });
      }

      const newRoom = await ChatRoomUtil.create({ userIds, bookAdId, chatInitiator });

      let seller = UserUtil.findOne({ _id: sellerId });
      let buyer = UserUtil.findOne({ _id: buyerId });

      let a = seller.usersInContact;
      let b = buyer.usersInContact;

      a = a ? [...a, buyerId] : [buyerId];
      b = b ? [...b, sellerId] : [sellerId];

      console.log(a);
      console.log(b);

      await seller.updateOne(
        { _id: sellerId },
        { $set: { usersInContact: a } }
      );
      await buyer.updateOne({ _id: buyerId }, { $set: { usersInContact: b } });

      return this.res.status(200).json({
        success: true,
        message: 'Creating a new chat room...',
        data: {
          isNew: true,
          chatRoomId: newRoom._doc._id,
        },
      });
    } catch (error) {
      console.log('error on start chat method', error);
      return this.res.status(500).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }
}
module.exports = ChatRoomController;
