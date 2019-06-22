const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
// const session = require('express-session')
const passport = require("passport");
const flash = require("connect-flash");
const validator = require("express-validator");
const app = express();

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then(db =>
    console.log(
      `Successfully connected to database '${db.connection.db.databaseName}'`
    )
  )
  .catch(err => console.error(err));

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(validator());
app.use(cors());
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(flash());

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

// Routes
app.use("/api/todos", require("./routes/todos"));
app.use("/api/users", require("./routes/users"));

// Static Files
app.use(express.static(__dirname + "/public"));

// Start server
app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
});
