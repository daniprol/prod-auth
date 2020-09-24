const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      //   const secret = "1234567890";
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1h",
        issuer: "Dani Prol website",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          //   return reject(err);
          return reject(createError.InternalServerError()); // We don't want to send the client the error message so we create a 'custom' one to show
        }
        resolve(token); // We send back the token
      });
    });
  },
};
