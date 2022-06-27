const ChatsController = require("./chat.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addChannel", (req, res) => {
    return new ChatsController().boot(req, res).addChannel();
  });

  app.use(config, router);
};
