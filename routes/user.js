const express = require("express");
const passport = require("passport");
const router = express.Router();

const { saveRedirectUrl } = require("../middlewear.js");

const userController = require("../controller/user.js");

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(userController.signUp);

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: `/login`,
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
