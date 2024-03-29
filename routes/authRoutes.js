// authRoutes.js
import express from "express";
import { rateLimit } from "express-rate-limit";
import { registerUser, signInUser } from "../controllers/authControllers.js";

//ip rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, //Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, //Disable the `X-RateLimit-*` headers
});

const router = express.Router();

// Register routes
router.post("/register", limiter, registerUser);
router.post("/login", signInUser);

export default router;
