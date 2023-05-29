const wishlistController = require("./wishlist.controller");
const { en, de } = require("../../../middlewares/auth");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addBookToWishlist",de, (req, res) => {
    return new wishlistController().boot(req, res).addBookToWishlist();
  });

  router.get("/getWishlist",de, (req, res) => {
    return new wishlistController().boot(req, res).getWishlist();
  });
  router.get("/searchWishlist", (req, res) => {
    return new wishlistController().boot(req, res).searchWishlist();
  });

  app.use(config, router);
};
