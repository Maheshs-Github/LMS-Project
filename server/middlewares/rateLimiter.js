import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

export { loginRateLimiter, registerRateLimiter };

// that video , i also want to improve speaking so i will record teh video , will discuss about what to discuss about that movie 