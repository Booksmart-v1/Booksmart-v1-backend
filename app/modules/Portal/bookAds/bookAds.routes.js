const BookAdsController = require("./bookAds.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
const { en, de, newToken } = require("../../../middlewares/auth");
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addBookAds", de, (req, res) => {
    return new BookAdsController().boot(req, res).addBookAds();
  });

  router.post("/updateBookAds", de, (req, res) => {
    return new BookAdsController().boot(req, res).updateBookAds();
  });

  router.get("/getBookAds", de, (req, res) => {
    return new BookAdsController().boot(req, res).getBookAds();
  });
  router.get("/getMyBookAds", de, (req, res) => {
    return new BookAdsController().boot(req, res).getMyBookAds();
  });

  router.post("/uploadImageS3", de, (req, res) => {
    return new BookAdsController().boot(req, res).uploadImageS3();
  });

  router.post("/markAsSold", de, (req, res) => {
    return new BookAdsController().boot(req, res).markAsSold();
  });

  router.post("/markAsUnsold", de, (req, res) => {
    return new BookAdsController().boot(req, res).markAsUnsold();
  });

  router.post("/deleteAd", de, (req, res) => {
    return new BookAdsController().boot(req, res).deleteAd();
  });
  router.get("/getBookAd", de, (req, res) => {
    return new BookAdsController().boot(req, res).getBookAd();
  });
  //   router.post("/loginUser", (req, res) => {
  //     return new UserController().boot(req, res).loginUser();
  //   });

  //   router.post("/verifyUser", (req, res) => {
  //     return new UserController().boot(req, res).verifyUser();
  //   });

  app.use(config, router);
};
