import mongoose from "mongoose";
import Companies from "../models/companyModel.js";

export const registerCompany = async(req, res, next) => {
    const {name, email, password} = req.body;

    //validate fields
    if (!name|| !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      try {
        const accountExist = await Companies.findOne({ email });

        if(accountExist) {
            next("Email already Registered. Please Login");
            return
        }

        //create a new account
        const company = await Companies.create({
            name,
            email,
            password,
        });

        // user token
            const token = company.createJWT();

            res.status(201).json({ 
                success: true,
                message: "Company Account Created Successfully",
                user: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                },
                token, 
            });

      } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
};

export const signInCompany = async(req, res, next) => {
    const { email, password } = req.body;

    try {
        //validation
        if(!email || !password) {
            next("Please Provide User Credentials");
            return;
        }

        const company  = await Companies.findOne({ email }).select("+password");
        if(!company) {
            next(error);
            return;
        };

        //compare password
        const isMatch = await company.comparePassword(password); 
        if(!isMatch) {
            next("Invalid Password");
            return;
        };
            company.password = undefined;

            const token = company.createJWT();

            res.status(200).json({
                success: true,
                message: "Login Successfully",
                user: company,
                token,
            });

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message }); 
    }
};

export const updateCompanyProfile = async (req, res, next) => {
    const { name, contact, location, profileUrl, about } = req.body;

    try {
        // validate company
        if(!name || !location || !about || !contact || !profileUrl) {
            return
        }

        const id = req.body.user.userId;

            if (!mongoose.Types.ObjectId.isValid(id))
                return res.status(404).send(`No company with id: ${id}`);

            const updateCompany = {
                name,
                contact,
                location,
                profileUrl,
                about,
                _id: id,
            };

            const company = await Companies.findByIdAndUpdate(id, updateCompany, {new: true,});

            const token = company.createJWT();

            company.password = undefined

            res.status(200).json({
                sucess: true,
                message: "Company Profile Updated Successfully",
                company,
                token,
            });

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
};

export const getCompanyProfile = async (req, res, next) => {
    try {
        const id = req.body.user.userId

        const company = await Companies.findById({ _id: id });
        company.password = undefined;

        if(!company) {
            return res.status(200).send({
                message: "Company Not Found",
                success: false,
            });

        }
        company.password = undefined;
        res.status(200).json({
            success: true,
            data: company
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
};


// GET ALL COMPANIES
export const getCompanies = async (req, res, next) => {
    try {
        const { search, sort, location } = req.query;

        //conditions for searching filters
        const queryObject = {};

        if(search) {
            queryObject.name = { $regex: search, $options: "i"};
        };

        if(location) {
            queryObject.location = { $regex: location, $options: "i" };
        }

        let queryResult = Companies.find(queryObject).select("-password");

        // SORTING
        if(sort === "Newest") {
            queryResult = queryResult.sort("-createdAt");
        }
        if(sort === "Oldest") {
            queryResult = queryResult.sort("createdAt");
        }
        if(sort === "A-Z") {
            queryResult = queryResult.sort("name");
        }
        if(sort === "Z-A") {
            queryResult = queryResult.sort("-name");
        }


        // PAGINATIONS
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 20

        const skip = ( page -1 ) * limit;

        const total = await Companies.countDocuments(queryResult);

        //records count
        const numOfPage = Math.ceil(total / limit);

        //move to the next page
        // queryResult = queryResult.skip(skip).limit(limit);

        // show more instead of moving to next page
        queryResult = queryResult.limit(limit * page);

        const companies = await queryResult;

        res.status(200).json({
            success: true,
            total,
            data: companies,
            page,
            numOfPage,
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
};


// GET COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) => {
    const { search, sort } = req.query;
    const id = req.body.user.userId

    try {
        //conditions for searching filters
        const queryObject = {};

        if(search) {
            queryObject.location = { $regex: search, $options: "i" };
        }

        let sorting;
        //sorting || another way
        if(sort === "Newest") {
            sorting = "-createdAt";
        }
        if(sort === "Oldest") {
            sorting = "createdAt";
        }
        if(sort === "A-Z") {
            sorting = "name";
        }
        if(sort === "Z-A") {
            sorting = "-name";
        }

        let queryResult = await Companies.findById({ _id: id }).populate({
            path: "jobPosts",
            options: { sort: sorting },
        });
        const companies = await queryResult;
            res.status(200).json({
                success: true,
                companies,
            });

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

// GET SINGLE COMPANY
export const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const company = await Companies.findById({ _id: id }).populate({
            path: "jobPosts",
            options: {
                sort: "-_id",
            }
        });

        if (!company) {
            return res.status(200).send({
                message: "Company Not Found",
                success: false,
            });
        }

        // Corrected from response to res
        company.password = undefined;
        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};
