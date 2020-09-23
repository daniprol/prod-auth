const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/User.model");
const { authSchema } = require("../helpers/validation_schema");

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // if (!email || !password) throw createError.BadRequest(); // This error will be catched by the catch block as well!
    const result = await authSchema.validateAsync(req.body);
    // console.log("Joi result", result);

    // We need to pass the joi-validated data:  console.log(req.body);
    const doesExist = await User.findOne({ email: result.email });

    if (doesExist)
      throw createError.Conflict(`${result.email} has already been registered`);

    // const user = new User({ email:result.email, password: result.password });
    const user = new User(result);
    const savedUser = await user.save();
    res.send(savedUser); // Don't we need to send some JSON????
  } catch (error) {
    // We need to check if the erro is coming from joi
    if (error.isJoi === true) error.status = 422; // Otherwise it will send a 500 (interal server error) error
    next(error);
  }
  // res.send("Register POST route");
});

router.post("/login", async (req, res, next) => {
  res.send("Login POST route");
});

router.post("/refresh-token", async (req, res, next) => {
  res.send("Refresh token route");
});

// NOTE that we use a DELETE request to handle the logout route because we are actually deleting the JWT token
router.delete("/logout", async (req, res, next) => {
  res.send("Logout route");
});
module.exports = router;
