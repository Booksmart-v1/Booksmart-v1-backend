const BookAdsController = require("./bookAds.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addBookAds", (req, res) => {
    return new BookAdsController().boot(req, res).addBookAds();
  });

  router.post("/updateBookAds", (req, res) => {
    return new BookAdsController().boot(req, res).updateBookAds();
  });

  router.get("/getBookAds", (req, res) => {
    return new BookAdsController().boot(req, res).getBookAds();
  });
  router.get("/getMyBookAds", (req, res) => {
    return new BookAdsController().boot(req, res).getMyBookAds();
  });

  router.post("/uploadImageS3", (req, res) => {
    return new BookAdsController().boot(req, res).uploadImageS3();
  });

  router.post("/markAsSold", (req, res) => {
    return new BookAdsController().boot(req, res).markAsSold();
  });

  router.post("/markAsUnsold", (req, res) => {
    return new BookAdsController().boot(req, res).markAsUnsold();
  });

  router.post("/deleteAd", (req, res) => {
    return new BookAdsController().boot(req, res).deleteAd();
  });

  //   router.post("/loginUser", (req, res) => {
  //     return new UserController().boot(req, res).loginUser();
  //   });

  //   router.post("/verifyUser", (req, res) => {
  //     return new UserController().boot(req, res).verifyUser();
  //   });

  app.use(config, router);
};
