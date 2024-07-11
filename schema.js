const joi = require("joi");
//USED TO VALIDATE THE MONGOOSE SCHEMA IN SERVER-SIDE
module.exports.listSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required(),
      country: joi.string().required(),
      location: joi.string().required(),
      // image: joi.string().required(),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});
