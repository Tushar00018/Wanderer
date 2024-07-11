const mongoose = require("mongoose");
const initdata = require("./data.js");
const listSchema = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}
main().then(console.log("Connection established succesfully.."));
main().catch((Error) => console.log(Error));

async function add() {
  await listSchema.deleteMany();
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "667b9e04266bd81fe6437e7e",
  }));
  await listSchema.insertMany(initdata.data).then((res) => console.log(res));
}
add();
