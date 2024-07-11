const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

let listSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },

  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

listSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const listing = new mongoose.model("listing", listSchema);

module.exports = listing;
