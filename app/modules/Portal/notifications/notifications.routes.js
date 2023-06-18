const NotificationsController = require("./notifications.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
const { en, de, newToken } = require("../../../middlewares/auth");
module.exports = function (app, express) {
  const router = express.Router();

  // router.get("/getUserNotifs", (req, res) => {
  //   return new NotificationsController().boot(req, res).getUserNotifs();
  // });

  router.get("/getUserNotifs",de, (req, res) => {
    return new NotificationsController().boot(req, res).getUserNotifs();
  });
  router.post("/sendNotif",de, (req, res) => {
    return new NotificationsController().boot(req, res).sendNotif();
  });
  router.post("/broadcastNotif", (req, res) => {
    return new NotificationsController().boot(req, res).broadcastNotif();
  });
  router.post("/readNotif", de, (req, res) => {
    return new NotificationsController().boot(req, res).readNotif();
  });
  router.post("/removeNotif", de, (req, res) => {
    return new NotificationsController().boot(req, res).removeNotif();
  });
  router.post("/removeInterestNotification", de, (req, res) => {
    return new NotificationsController()
      .boot(req, res)
      .removeInterestNotification();
  });

  app.use(config, router);
};
