const listings = require("../models/listing");

module.exports.index = async (req, res) => {
  let listing = await listings.find({});
  res.render("index.ejs", { listing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};
//READ LISTING
module.exports.showList = async (req, res) => {
  let { id } = req.params;
  let list = await listings
    .findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
   res.redirect("/listings");
  if (list.length == 0) {
    req.flash("error", "Listing you requested for does not exists");
    res.redirect("/listings");
  }else{
 res.render("show.ejs", { list });
  }
};
//CREATE LISTING
module.exports.createListing = async (req, res, next) => {
  let newData = new listings(req.body.listing);
  newData.owner = req.user._id;
  let url = req.file.url;
  let filename = req.file.public_id;
  newData.image = { url, filename };
  await newData.save().then((result) => console.log(result));
  req.flash("sucess", "New User Registered");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let list = await listings.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested for does not exists");
    res.redirect("/listings");
  }
  res.render("edit.ejs", { list });
};
//UPDATE LISTING
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let list = await listings.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };
    list.save();
  }
  req.flash("sucess", "Listing Updated");
  res.redirect(`/listings/${id}`);
};
//DELETE LISTING
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedData = await listings.findByIdAndDelete(id);
  console.log(deletedData);
  req.flash("sucess", "Listing Deleted");
  res.redirect("/listings");
};
