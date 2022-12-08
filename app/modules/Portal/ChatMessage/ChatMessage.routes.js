const chatMessageSchema = require("./ChatMessage.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/postInChatRoom", (req, res) => {
    return new chatMessageSchema().boot(req, res).postInChatRoom();
  });

  router.get('/getMessagesInChatRoom', (req, res) => {
    return new chatMessageSchema().boot(req, res).getMessagesInChatRoom();
  });

  app.use(config, router);
};
