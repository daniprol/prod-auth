const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const { NotExtended } = require("http-errors");
require("dotenv").config(); // We just need this!

const app = express();

app.get("/", (req, res) => {
  res.send("Response from the server");
});

app.use(async (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500); // 500 is the internal server error by default
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000; // If the env variable can't be found use the 3000 as default

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
