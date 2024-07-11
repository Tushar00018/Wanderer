//PARSE THE DATA FROM THE CLOUD
require("dotenv").config();

const express = require("express");
const app = express();
const port = 5050;
const mongoose = require("mongoose");
//OVERRRIDESS THE POST REQUEST
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//can add all the layouts(EJS FILES) to the ejs file
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
//CUSTOM ERROR HANDLER
const expressError = require("./utils/expressError");
//access the VIEW folder
app.set("view engine", "ejs");
//enCodes the URL
app.use(express.urlencoded({ extended: true }));
//access the PUBLIC folder
app.use(express.static("public"));

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}
main().then(console.log("Connected to Mongoose  Succesfully.."));
main().catch((Error) => console.log(Error));

//GENERATES THE SESSION
const session = require("express-session");
//STOREES THE SESSION RELATED DATA INTO THE ATLAS MONGOO
const MongoStore = require("connect-mongo");
//CREATES THE SESSION STORE IN THE MONGO-DATABASE
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessioOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    exprire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//MIDDLEWEAR THE GENERATE THE SESSION
app.use(session(sessioOptions));

//FLASH MESSAGE
const flash = require("connect-flash");
app.use(flash());

//AUTHENTICATION
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user.js");

//INIALLIZE THE PASSPORT
app.use(passport.initialize());
//PASSPORT DATA IS STORE IN THE SESSION
app.use(passport.session());
//ALL THE NEW USERS ARE AUTHENICATED VIA LOCALSTASTERGY USING the method USER.AUTHENTICATION
passport.use(new localStratergy(User.authenticate()));

//SAVES THE DATA IN THE SESSION
passport.serializeUser(User.serializeUser());
//REMOVES THE DATA WHEN THE SESSION EXPIRES
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.listen(port, () => {
  console.log(`Listening at the port:${port}`);
});

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);

//HANDLES ALL THE UNKNOWN ROUTES
app.all("*", (req, res, next) => {
  throw new expressError(404, "PAGE NOT FOUND");
});

// CUSTOM ERROR HANDLER
app.use((err, req, res, next) => {
  let { status = 500, message = "SOMETHING WENT WRONG" } = err;
  res.render("error.ejs", { message });
});
