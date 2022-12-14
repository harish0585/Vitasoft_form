const express = require("express");
const app = express();
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./middlewares/errors");

// Setting up config file
// if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
dotenv.config({ path: "backend/config/config.env" });

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());


// Import all routes

const auth = require("./routes/authRoute");

app.use("/api/v1", auth);


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;