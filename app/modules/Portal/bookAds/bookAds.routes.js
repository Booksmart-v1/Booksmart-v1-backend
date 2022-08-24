const BookAdsController = require("./bookAds.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addBookAds", (req, res) => {
    return new BookAdsController().boot(req, res).addBookAds();
  });

  router.get("/getBookAds", (req, res) => {
    return new BookAdsController().boot(req, res).getBookAds();
  });
  router.get("/getMyBookAds", (req, res) => {
    return new BookAdsController().boot(req, res).getMyBookAds();
  });

  //   router.post("/loginUser", (req, res) => {
  //     return new UserController().boot(req, res).loginUser();
  //   });

  //   router.post("/verifyUser", (req, res) => {
  //     return new UserController().boot(req, res).verifyUser();
  //   });

  app.use(config, router);
};
