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
      let { userId, type, userName, receiverId, bookAdId, notifId } =
        this.req.body;
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
        let bookAd = await bookAds.findOne({
          _id: bookAdId,
        });
        let buyers = bookAd.interestedBuyers;
        buyers.push(userId);

        await bookAds.updateOne(
          {
            _id: bookAdId,
          },
          { $set: { interestedBuyers: buyers } }
        );
        const newNotif = new notifs({
          senderId: userId,
          type: type,
          senderName: userName,
          receiverId: receiverId,
          bookAdId: bookAdId,
          message: `${userName} is interested in buying your book: ${bookAd.bookName} `,
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
      if (notifId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please provide correspoding Notification Id.",
        });
      }
      // let bookAd = await bookAds.find({
      //   _id: bookAdId,
      // });
      const newNotif = new notifs({
        senderId: userId,
        type: type,
        senderName: userName,
        receiverId: receiverId,
        message:
          type === "accept"
            ? `${userName} has accepted your request to buy the book.`
            : `${userName} has rejected your request to buy the book.`,
        isRead: false,
      });

      //IF TYPE IS ACCEPT CREATE NEW CHAT DOC IN MONGODB
      const a = await notifs.deleteOne({ _id: notifId });
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

  async removeNotif() {
    try {
      let { notifId } = this.req.body;
      if (notifId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      const a = await notifs.deleteOne({ _id: notifId });
      return this.res.status(200).json({
        success: true,
        message: `Notification Deleted Successfully`,
        data: a,
      });
    } catch (err) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
  async removeInterestNotification() {
    try {
      let { bookAdId, userId } = this.req.body;
      if (bookAdId === undefined || userId === undefined) {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      let bookAd = await bookAds.findOne({
        _id: bookAdId,
      });
      let buyers = bookAd.interestedBuyers;
      console.log(buyers);
      var filtered = buyers.filter(function (value, index, arr) {
        return value !== userId;
      });
      console.log(filtered);
      await bookAds.updateOne(
        {
          _id: bookAdId,
        },
        { $set: { interestedBuyers: filtered } }
      );

      const a = await notifs.deleteMany({
        type: "interest",
        senderId: userId,
        bookAdId: bookAdId,
      });

      return this.res.status(200).json({
        success: true,
        message: `Notification Retracted Successfully`,
        data: a,
      });
    } catch (err) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
  async readNotif() {
    try {
      let { id } = this.req.body;
      if (id === "") {
        return this.res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
      let readNotifications = await notifs.find({
        _id: id,
      });
      console.log(readNotifications);
      if (
        readNotifications[0].type === "accept" ||
        readNotifications[0].type === "reject"
      ) {
        console.log(readNotifications);
        const a = await notifs.deleteOne(readNotifications[0]);
      } else {
        const updateDoc = {
          $set: {
            isRead: true,
          },
        };
        const result = await notifs.updateOne({ _id: id }, updateDoc);
      }
      return this.res.status(200).json({
        success: true,
        message: `The notification has been read.`,
        data: readNotifications,
      });
    } catch (err) {
      console.log(e);
      return this.res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}

module.exports = NotificationsController;
