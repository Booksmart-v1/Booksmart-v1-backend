const chatRoomSchema = require("./ChatRoom.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/initiateChat", (req, res) => {
    return new chatRoomSchema().boot(req, res).initiateChat();
  });

  app.use(config, router);
};
