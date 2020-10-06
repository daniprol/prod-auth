const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const redisClient = require("./init_redis");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      //   const secret = "1234567890";
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        // expiresIn: "1h",
        expiresIn: "25s",
        issuer: "Dani Prol website",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          //   return reject(err);
          return reject(createError.InternalServerError()); // We don't want to send the client the error message so we create a 'custom' one to show
        }
        return resolve(token); // We send back the token
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      // Note that if the token is expired will get an error as well!
      // console.log(payload);
      if (err) {
        /*         err = { name: 'TokenExpiredError',
                message: 'jwt expired', 
                expiredAt: 1408621000
        } */
        /*         if (err.name === "JsonWebTokenError") {
          console.log("JsonWebTokenError");
          // In case any particular error happen (e.g., if the user passes an invalid signature) we don't want to give any extra information
          return next(createError.Unauthorized());
        } else {
          return next(createError.Unauthorized(err.message)); // This will happen if the token is expired
        } */

        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }

      // We attach the JWT payload to the request
      // IMPORTANT: we can access it with req.payload  and not req.headers['payload']
      req.payload = payload;
      return next();
    });
  },
  signRefreshToken: (userId) => {
    // This function will just create a refresh token
    return new Promise((resolve, reject) => {
      const secret = process.env.REFRESH_TOKEN_SECRET;

      // The payload  will be the same
      const payload = {};

      // The expiration of the token should be much longer than for the access token:
      const options = {
        // expiresIn: "1h",
        expiresIn: "1y",
        issuer: "Dani Prol website",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          //   return reject(err);
          return reject(createError.InternalServerError()); // We don't want to send the client the error message so we create a 'custom' one to show
        }
        // We save the refresh token in the redis store:
        redisClient.set(userId, token, "EX", 365 * 24 * 3600, (err, reply) => {
          if (err) {
            console.log(err.message);
            return reject(createError.InternalServerError());
          }
          return resolve(token); // Resolve the promise by sending the token back
        });
        // resolve(token); // We send back the token
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          // In case the refresh token is not valid
          if (err) return reject(createError.Unauthorized());

          // We extract the userId from the payload:
          const userId = payload.aud; // The payload contains the short form of audience, i.e., "aud"

          // We are not blacklisting the refresh tokens in this example
          return resolve(userId);
        }
      );
    });
  },
};
