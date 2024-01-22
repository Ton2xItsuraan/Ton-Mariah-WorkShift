import express from "express";
import rateLimit from "express-rate-limit";
import { getCompanies, getCompanyById, getCompanyJobListing, getCompanyProfile, registerCompany, signInCompany, updateCompanyProfile } from "../controllers/companiesController.js";
import userAuth from "../middlewares/authMiddleWare.js";

// Create an instance of the router
const router = express.Router();

// IP rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// REGISTER
router.post("/register", limiter, registerCompany);

// LOGIN
router.post("/login", limiter, signInCompany);

// GET DATA
router.post("/get-company-profile", userAuth, getCompanyProfile);
router.post("/get-company-joblisting", userAuth, getCompanyJobListing);
router.get("/", getCompanies);
router.get("/get-company/:id", getCompanyById);

// UPDATE DATA
router.put("/update-company", userAuth, updateCompanyProfile);

export default router;
