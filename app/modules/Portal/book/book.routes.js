const BookController = require("./book.controller");
const { en, de, newToken } = require("../../../middlewares/auth");

const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addBooks", (req, res) => {
    return new BookController().boot(req, res).addBooks();
  });

  router.get("/getBook", de, (req, res) => {
    return new BookController().boot(req, res).getBook();
  });
  router.get("/getBooks", de, (req, res) => {
    return new BookController().boot(req, res).getBooks();
  });

  //   router.post("/loginUser", (req, res) => {
  //     return new UserController().boot(req, res).loginUser();
  //   });

  //   router.post("/verifyUser", (req, res) => {
  //     return new UserController().boot(req, res).verifyUser();
  //   });

  app.use(config, router);
};
