const express = require("express");
const router = express.Router();

router.post("/register", async (req, res, next) => {
  res.send("Register POST route");
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
