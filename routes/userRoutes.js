const Express = require("express");
const Router = Express.Router();
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const fetchUser = require("./../middleware/fetchuser");

const toLower = (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  next();
};

Router.route("/signup").post(
  toLower,
  [
    body("name", "Enter a valid Name").isLength({ min: 2 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
  ],
  userController.addUser
);

Router.route("/login").post(
  toLower,
  [
    body("email", "Enter a valid Email.").isEmail(),
    body("password", "Password musts be at least 5 charachters.").isLength({
      min: 5,
    }),
  ],
  userController.login
);

Router.route("/getuser").post(fetchUser, userController.getUser);

Router.route("/getcount").get(userController.getUsersCount);

module.exports = Router;
