const listings = require("../models/listing.js");
const reviews = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let Listings = await listings.findById(req.params.id);
  let newReview = new reviews(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  Listings.review.push(newReview);
  await newReview.save();
  await Listings.save();
  req.flash("sucess", "Review added Sucessfully");
  res.redirect(`/listings/${Listings._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  //deletes the review ID from the review array in the listing
  await listings.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  //deletes the review from the review database
  await reviews.findByIdAndDelete(reviewId);
  req.flash("sucess", "Review deleted Sucessfully");
  res.redirect(`/listings/${id}`);
};
