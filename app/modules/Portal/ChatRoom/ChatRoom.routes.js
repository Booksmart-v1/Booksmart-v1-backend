const chatRoomSchema = require("./ChatRoom.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/initiateChat",de, (req, res) => {
    return new chatRoomSchema().boot(req, res).initiateChat();
  });
  router.post("/closedChat",de, (req, res) => {
    return new chatRoomSchema().boot(req, res).closedChat();
  });

  app.use(config, router);
};
