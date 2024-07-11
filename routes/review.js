const express = require("express");
//mergeParams sends the data to the child(route.post) from parent(app.post)
const router = express.Router({ mergeParams: true });
//IMPORTS THE WRAPASYNC FUNCTION
const wrapAsync = require("../utils/wrapError");

const {
  reviewValidate,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewear.js");

const reviewController = require("../controller/review.js");

//HANDLES THE POST REQUEST FOR THE REVIEW SECTION
router.post(
  "/",
  isLoggedIn,
  reviewValidate,
  wrapAsync(reviewController.createReview)
);

//DELETE THE REVIEWS FROM THE LIST
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
