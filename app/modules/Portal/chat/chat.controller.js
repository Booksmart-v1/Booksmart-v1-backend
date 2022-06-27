const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const chat = mongoose.model("chats");
const StreamChat = require("stream-chat").StreamChat;
const { generateOTP, fast2sms } = require("../../../../utils/otp.util");
const e = require("connect-timeout");

class ChatsController extends Controller {
  async addChannel() {
    const { userId, name, userName, image, mobile, email, members, role } =
      this.req.body;
    const serverClient = StreamChat.getInstance(
      "unc9a4tjee5z",
      "qn9tf23rsvd2sfh35e5nvfp3uzag44q6zaqvrvksrgvaj6x82mbvmapycvq779gt"
    );
    const token = serverClient.createToken(userId);

    const channel = serverClient.channel(
      "messaging",
      {
        name: name,
        created_by: { id: userId, name: userName },
        members: members,
        image: image,
        mobile: mobile,
        email: email,
        role: role,
      },
      token
    );
    await channel.create();

    // const channel = await StreamChat.createChannel(
    //   "messaging",
    //   {
    //     name,
    //     image,
    //     members: [userId, "U1"],
    //   },
    //   {
    //     userId,
    //     token: "token",
    //   }
    // );
    // channel.addMembers([userId, "U1"]);
    const channelId = channel.id;
    console.log(channelId);
    const channelData = {
      creator: userId,
      members,
      channelId,
      role,
      name,
      userName,
      image,
      mobile,
      email,
    };
    const chat1 = new chat(channelData);
    await chat1.save();
    return this.res.status(200).json({
      success: true,
      message: "Channel Created Successfully",
      data: {
        channelId,
        role,
        userId,
        name,
        userName,
        image,
        mobile,
        email,
        members,
      },
    });
  }
}

module.exports = ChatsController;
