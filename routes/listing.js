const express = require("express");
const router = express.Router();
//IMPORTS THE WRAPASYNC FUNCTION
const wrapAsync = require("../utils/wrapError");

const { isLoggedIn, isOwner, listValidate } = require("../middlewear.js");

const listingController = require("../controller/listing.js");

const { storage } = require("../cloudConfig.js");

//parse the form data(IMAGE)
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  //SHOWS ALL THE LISTINGS(READ OPERATION)
  .get(wrapAsync(listingController.index))
  //GETS THE DATA OF THE NEW LIST(CREATE OPERATION)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    listValidate,
    wrapAsync(listingController.createListing)
  );

//NEW ROUTE TO ADD THE NEW LIST
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  //SHOWS the PLACE IN DETAIL(READ OPERATION)
  .get(wrapAsync(listingController.showList))
  //GETS THE DATA TO PATCH REQUEST to UPDATE THE PLACE
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    listValidate,
    wrapAsync(listingController.editListing)
  )
  //DELETE THE PLACE(DELETE OPERATION)
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//EDIT THE PLACE(UPDATE OPERATION)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
