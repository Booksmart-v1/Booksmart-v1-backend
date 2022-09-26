const UserController = require("./user.controller");
const wishlistController = require("./wishlist.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addBookToWishlist", (req, res) => {
    return new wishlistController().boot(req, res).addBookToWishlist();
  });

  router.get("/getWishlist", (req, res) => {
    return new wishlistController().boot(req, res).getWishlist();
  });

  app.use(config, router);
};
