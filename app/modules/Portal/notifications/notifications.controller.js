const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const notifs = mongoose.model("notifs");
const bookAds = mongoose.model("bookAds");
const e = require("connect-timeout");

class NotificationsController extends Controller {
  async getUserNotifs() {
    try {
      let { userId } = this.req.query;
      if (userId === "" || userId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      let userNotifs = await notifs.find({
        receiverId: userId,
      });
      return this.res.status(200).json({
        success: true,
        message: "User notifs have been fetched successfully.",
        data: userNotifs,
      });
    } catch (e) {
      console.log(e);
      return this.res.status(400).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  }
  async sendNotif() {
    try {
      let { userId, type, userName, receiverId, bookAdId } = this.req.body;
      if (
        userId === "" ||
        userId === undefined ||
        userName === undefined ||
        receiverId === undefined ||
        type === undefined
      ) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      if (type === "interest") {
        if (bookAdId === undefined) {
          return this.res.status(400).json({
            success: false,
            message: "Please provide correspoding book ad Id.",
          });
        }
        let bookAd = await bookAds.find({
          _id: bookAdId,
        });
        const newNotif = new notifs({
          senderId: userId,
          type: type,
          senderName: userName,
          receiverId: receiverId,
          bookAdId: bookAdId,
          message: `${userName} is interested in buying your book: ${bookAd[0].bookName} `,
          isRead: false,
        });
        const saveNotif = await newNotif.save();
        return this.res.status(200).json({
          success: true,
          message: `Notification sent successfully`,
          data: saveNotif,
        });
      }
      if (type !== "accept" && type !== "reject") {
        return this.res.status(400).json({
          success: false,
          message: "Wrong type of notification",
        });
      }
      const newNotif = new notifs({
        senderId: userId,
        type: type,
        senderName: userName,
        receiverId: receiverId,
        message:
          type === "accept"
            ? `${userName} has accepted your request.`
            : `${userName} has rejected your request.`,
        isRead: false,
      });

      const saveNotif = await newNotif.save();
      return this.res.status(200).json({
        success: true,
        message: `Notification sent successfully`,
        data: saveNotif,
      });
    } catch (e) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  async broadcastNotif() {}

  async readNotif() {}
}

module.exports = NotificationsController;
