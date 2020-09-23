const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/User.model");

router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createError.BadRequest(); // This error will be catched by the catch block as well!

    const doesExist = await User.findOne({ email: email });

    if (doesExist)
      throw createError.Conflict(`${email} has already been registered`);

    const user = new User({ email, password });
    const savedUser = await user.save();
    res.send(savedUser); // Don't we need to send some JSON????
  } catch (error) {
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
