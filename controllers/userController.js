import mongoose from "mongoose";
import Users from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        contact,
        location,
        profileUrl,
        jobTitle,
        about,
    } = req.body;

    try {
        if (!firstName || !lastName || !email || !contact || !jobTitle || !about) {
            const error = new Error("Missing required fields");
            return next(error);
        }

        const id = req.body.user.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error(`No User with id: ${id}`);
            error.status = 404;
            return next(error);
        }

        const updateUser = {
            firstName,
            lastName,
            email,
            contact,
            location,
            profileUrl,
            jobTitle,
            about, // Fix the typo here
            _id: id,
        };

        const user = await Users.findByIdAndUpdate(id, updateUser, { new: true });

        const token = user.createJWT(); // Fix the method name

        user.password = undefined;

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error.message });
    }
};




export const getUser = async (req, res, next) => {

    try {
        const id = req.body.user.userId

        const user = await Users.findById({ _id: id });

        if(!user) {
            return res.status(200).send({
                message: "User Not Found",
                success: false,
            });
        }

        user.password = undefined;
        res.status(200).send({
            success: true,
            user: user,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "auth error",
            success: false,
            error: error.message,
        });
    }
};