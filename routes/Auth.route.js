const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/User.model");
const { authSchema } = require("../helpers/validation_schema");
const { signAccessToken, signRefreshToken } = require("../helpers/jwt_helper");

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
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);

    // res.send(savedUser); // Don't we need to send some JSON????
    console.log(savedUser);
    console.log("JWT Token", accessToken);
    res.send({ accessToken, refreshToken }); // Don't we need to send some JSON????
  } catch (error) {
    // We need to check if the erro is coming from joi
    if (error.isJoi) error.status = 422; // Otherwise it will send a 500 (interal server error) error
    next(error);
  }
  // res.send("Register POST route");
});

router.post("/login", async (req, res, next) => {
  // res.send("Login POST route");
  try {
    const validationResult = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: validationResult.email });
    if (!user) throw createError.NotFound("User is not registered");
    console.log(validationResult);

    // We are using a .method and not .statics so we need to use 'user' instead of 'User'
    const isMatch = await user.isValidPassword(validationResult.password);
    if (!isMatch)
      throw createError.Unauthorized("Username/Password is not valid");

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi)
      return next(createError.BadRequest("Invalid username/password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  res.send("Refresh token route");
});

// NOTE that we use a DELETE request to handle the logout route because we are actually deleting the JWT token
router.delete("/logout", async (req, res, next) => {
  res.send("Logout route");
});

module.exports = router;
