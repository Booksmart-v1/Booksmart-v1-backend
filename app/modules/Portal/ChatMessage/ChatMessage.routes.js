const chatMessageSchema = require("./ChatMessage.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/postInChatRoom", (req, res) => {
    return new chatMessageSchema().boot(req, res).initiateChat();
  });

  app.use(config, router);
};
