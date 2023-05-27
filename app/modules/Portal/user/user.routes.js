const { en, de } = require("../../../middlewares/auth");

const UserController = require("./user.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addUser", (req, res) => {
    return new UserController().boot(req, res).addUser();
  });

  router.post("/updateUser", de, (req, res) => {
    return new UserController().boot(req, res).updateUser();
  });

  router.get("/getUser", de, (req, res) => {
    return new UserController().boot(req, res).getUser();
  });

  router.get('/getOneUser', de, (req, res) => {
    return new UserController().boot(req, res).getOneUser();
  });

  router.post("/loginUser", (req, res) => {
    return new UserController().boot(req, res).loginUser();
  });

  router.post("/verifyUser", en, (req, res) => {
    return new UserController().boot(req, res).verifyUser();
  });

  app.use(config, router);
};
