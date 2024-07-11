const listings = require("./models/listing.js");
const review = require("./models/review.js");
const { listSchema, reviewSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must Login to interact with the page");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let Listing = await listings.findById(id);
  if (!Listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of the Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.listValidate = (req, res, next) => {
  let result = listSchema.validate(req.body);
  console.log(result);
  console.log(req.body);
  if (result.error) {
    return new expressError(400, result.error);
  } else {
    next();
  }
};
//HANDLES THE SERVER SIDE ERROR FOR REVIEWS
module.exports.reviewValidate = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new expressError(400, result.error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let Review = await review.findById(reviewId);
  if (!Review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
