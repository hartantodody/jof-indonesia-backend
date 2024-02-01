const rateLimit = require("express-rate-limit");

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  message: "Too many requests, please try again later.",
});
