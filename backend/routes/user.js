const router = require("express").Router();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const { user } = require("../controllers/index");
const content = require("../models/content");

router.route("/register").post(user.register);
router.route("/signin").post(user.signin);
router.route("/reset-password").post(user.resetPassword);
router.route("/updatepassword").post(user.updatePassword);

router
  .route("/demo")
  .get(passport.authenticate("jwt", { session: false }), user.demo);

router
  .route("/:id")
  .get(passport.authenticate("jwt", { session: false }), user.getUser);

router
  .route("/follow")
  .put(passport.authenticate("jwt", { session: false }), user.follows);

router
  .route("/unfollow")
  .put(passport.authenticate("jwt", { session: false }), user.unfollows);

router
  .route("/update-avatar")
  .put(passport.authenticate("jwt", { session: false }), user.updateAvartar);

//search-user
router
  .route("/search-user")
  .post(passport.authenticate("jwt", { session: false }), user.searchUser);
module.exports = router;
