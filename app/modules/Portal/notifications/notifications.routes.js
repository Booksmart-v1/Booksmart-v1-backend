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
  router.post("/readNotif", (req, res) => {
    return new NotificationsController().boot(req, res).readNotif();
  });
  router.post("/removeNotif", (req, res) => {
    return new NotificationsController().boot(req, res).removeNotif();
  });
  router.post("/removeInterestNotification", (req, res) => {
    return new NotificationsController()
      .boot(req, res)
      .removeInterestNotification();
  });

  app.use(config, router);
};
