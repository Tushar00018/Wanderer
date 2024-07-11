const user = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("user.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, Password } = req.body;
    const newUser = new user({ email, username });
    const registerdUser = await user.register(newUser, Password);
    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("sucess", "User Logged-In Succesfully!!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("sucess", "Logged-In Succesfully");
  let redirectUrl = res.locals.redirectUrl || "listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("sucess", "Logged out Succesfully");
    res.redirect("/listings");
  });
};
