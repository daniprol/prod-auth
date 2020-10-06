const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config(); // We just need this!
// After defining the dotenv config we can require the database:
require("./helpers/database");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const redisClient = require("./helpers/init_redis");

// Import routes
const authRouter = require("./routes/Auth.route");

const app = express();

// Middleware:
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessToken, (req, res, next) => {
  console.log("Authorization:", req.headers["authorization"]);
  console.log("Payload", req.payload);
  res.send("Response from the server");
});

// Routes:
app.use("/auth", authRouter);

// Create 404 error route
app.use(async (req, res, next) => {
  //   const error = new Error("Not Found");
  //   error.status = 404;
  //   next(error);
  // next(createError.NotFound())
  next(createError.NotFound("This route does not exist!"));
});

// Create a middleware to handle all errors and send a response to the user:
app.use((err, req, res, next) => {
  res.status(err.status || 500); // 500 is the internal server error by default
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// const redis = require("redis");
// redisClient.set("foo", "bar");
// redisClient.get("foo", redis.print);
// redisClient.get("foo", (err, value) => {
//   if (err) console.log(err.message);

//   console.log(value);
// });
const PORT = process.env.PORT || 3000; // If the env variable can't be found use the 3000 as default

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
