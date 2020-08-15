const router = require("express").Router();

const { content } = require("../controllers/index");
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), content.getContents)
  .post(passport.authenticate("jwt", { session: false }), content.postContent);

router
  .route("/like")
  .put(passport.authenticate("jwt", { session: false }), content.like);

router
  .route("/unlike")
  .put(passport.authenticate("jwt", { session: false }), content.unlike);

router
  .route("/delete/:id")
  .delete(passport.authenticate("jwt", { session: false }), content.deletePost);

router
  .route("/comment")
  .put(passport.authenticate("jwt", { session: false }), content.comments);

router
  .route("/mypost")
  .get(passport.authenticate("jwt", { session: false }), content.mypost);

router
  .route("/getPostSubsribe")
  .get(
    passport.authenticate("jwt", { session: false }),
    content.getPostSubscribe
  );

module.exports = router;
