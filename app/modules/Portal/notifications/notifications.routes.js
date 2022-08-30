const NotificationsController = require("./notifications.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  // router.get("/getUserNotifs", (req, res) => {
  //   return new NotificationsController().boot(req, res).getUserNotifs();
  // });

  router.get("/getUserNotifs", (req, res) => {
    return new NotificationsController().boot(req, res).getUserNotifs();
  });
  router.post("/sendNotif", (req, res) => {
    return new NotificationsController().boot(req, res).sendNotif();
  });
  router.post("/broadcastNotif", (req, res) => {
    return new NotificationsController().boot(req, res).broadcastNotif();
  });

  app.use(config, router);
};
