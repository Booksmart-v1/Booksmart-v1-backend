const { encode } = require("../../../middlewares/jwt");

const UserController = require("./user.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addUser", (req, res) => {
    return new UserController().boot(req, res).addUser();
  });

  router.get("/getUser", (req, res) => {
    return new UserController().boot(req, res).getUser();
  });

  router.get('/getOneUser', (req, res) => {
    return new UserController().boot(req, res).getOneUser();
  });

  router.post("/loginUser", encode, (req, res, next) => {
    return new UserController().boot(req, res).loginUser();
  });

  router.post("/verifyUser", (req, res) => {
    return new UserController().boot(req, res).verifyUser();
  });

  app.use(config, router);
};
