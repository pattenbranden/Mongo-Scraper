require("dotenv").config();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

var express = require("express");
var Handlebars = require("handlebars");
var exphbs = require("express-handlebars");
var {
  allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");

// var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set("view engine", "handlebars");

// Routes
// require("./routes/apiRoutes.js")(app); FUTURE TODO FOR CODE CLEANUP
require("./routes/htmlRoutes.js")(app);

// Database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/PCGAMER-news-scrape";
mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to Mongoose!");
});

var routes = require("./routes/htmlRoutes");
app.use("/", routes);

app.listen(PORT, function() {
  console.log("Listening on PORT " + PORT);
});

module.exports = app;
