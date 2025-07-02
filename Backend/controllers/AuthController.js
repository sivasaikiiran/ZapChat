import UserModel from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../error/customError.js"
import { config } from "dotenv";
config();
import cloudinary from "cloudinary"


const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) next(errorHandler(400, "User Does Not Exists !"))

        const result = await bcryptjs.compare(password, existingUser.password);
        if (!result) next(errorHandler(400, "Incorrect Password !"))

        // 24 hour token validity
        const tokenOptions = {
            expiresIn: 1000 * 60 * 60 * 24,
        }

        const token = jwt.sign({
            userId: existingUser._id
        }, process.env.JWT_SECRET, tokenOptions);

        const cookieOptions = {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        const { password: hashedPassword, ...restUserDetails } = existingUser._doc;

        return res.cookie('token', token, cookieOptions).status(201).json({
            success: true,
            message: "User Logged In !",
            userDetails: restUserDetails
        })

    } catch (error) {
        next(error);
    }
}

const signupController = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) next(errorHandler(400, "User Already Exists !"))

        const hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = await UserModel.create({
            email, password: hashedPassword, firstName, lastName
        })

        return res.status(201).json({
            success: true,
            message: "User SignUp Successful !"
        })
    } catch (error) {
        console.log("SignUp Error", error);
        next(error);
    }
}

const getUserInfoController = async (req, res, next) => {
    try {
        const existingUser = await UserModel.findById(req.userId);
        const { password: hashedPassword, ...restUserDetails } = existingUser._doc;

        return res.status(201).json({
            success: true,
            message: "Fetched User Data Successful !",
            userDetails: restUserDetails
        })
    } catch (error) {
        next(error);
    }
}

const uploadImage = async (req, res, next) => {
    try {
        const { imageFile } = req.files;
        try {
            const result = await cloudinary.v2.uploader.upload(imageFile.tempFilePath, {
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                folder: "Chat App",
                resource_type: "auto",
                type: "upload"
            })
            const { secure_url, public_id } = result;
            return res.status(200).json({
                success: true,
                message: "Image Uploaded Successfully!",
                imageDetails: {
                    secure_url, public_id
                }
            })
        } catch (error) {
            console.log(error)
            next(errorHandler(404, "Cannot Upload Image"));
        }
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req; // verifytoken
        const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
            new: true
        })
        const { password: hashedPassword, ...restUserDetails } = updatedUser._doc;
        return res.status(200).json({
            success: true,
            message: "User Details Updated !",
            userDetails: restUserDetails
        })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        return res.cookie("token", {}, {
            maxAge: 1,
            secure: true,
            httpOnly: true,
            sameSite: "None"
        }).status(200).json({
            success: true,
            message: "Logout Successful!"
        })
    } catch (error) {
        next(error)
    }
}

export { loginController, signupController, getUserInfoController, uploadImage, updateProfile, logout }