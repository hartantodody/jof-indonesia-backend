"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const rateLimit = require("express-rate-limit");
exports.limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 2,
});
