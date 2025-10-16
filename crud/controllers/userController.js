import { AppDataSource } from "../db.js";
import bcrypt from 'bcrypt'
import { User } from "../entities/User.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { ILike, Like } from "typeorm";


dotenv.config();

//This is register controler
export const registerController = async (req, res) => {
    try {


        const { name, email, password, role, phone, city, country } = req.body;

        // Validations
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ success: false, message: "Email format is invalid" });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        } else if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        if (!role) {
            return res.status(400).json({ success: false, message: "Role is required" });
        } else if (!["Admin", "Staff"].includes(role)) {
            return res.status(400).json({ success: false, message: "Role must be Admin or Staff" });
        }

        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone is required" });
        } else if (!/^[0-9]{10,15}$/.test(phone)) { // Example: 10-15 digit phone
            return res.status(400).json({ success: false, message: "Phone format is invalid" });
        }
        /*
            AppDataSource is used to interact with database and
            .getRepository is class of TypeORM that gives method for interact
            with database table corresponsd entity like in this code User
            method like findOne(),find(),create(),save()
        */

        const userData = AppDataSource.getRepository(User);

        // Check existing of entry no duplicate email allow
        const existUser = await userData.findOne({ where: { email } });
        if (existUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            })
        }

        // We dont plaintext password directly for security purpose 
        // like if unAuthorized purson has access of database still 
        // he does not able to get password
        // THis is done within using bcrypt that is package in node js
        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = userData.create({
            name, email, password: hashedPass, role, phone, city, country,
        });

        // save user
        await userData.save(newUser);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",

        });
    } catch (error) {
        console.error("Error in register", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// This is login Controller

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: email and password are mandatory",
            });
        }

        // validation for email format
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // password length check
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const userData = AppDataSource.getRepository(User);

        // Check user exitency
        const foundUser = await userData.findOne({ where: { email } })
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        //compare password by compare method of bcrypt
        const isMatch = await bcrypt.compare(password, foundUser.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        // Now we will generate token for authorization purpose
        const JWT_SECRET = process.env.JWT_SECRET;

        const token = jwt.sign(
            {
                id: foundUser.id,
                role: foundUser.role,
                email: foundUser.email,
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        )

        console.log(token)
        // Store token in cookie httpOnly: true makes it safe from JS access

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        res.status(200).json({
            success: true,
            message: 'User login Successfully',
        })
    } catch (error) {
        console.error('Error in login', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

// THis is search controller
export const searchUserController = async (req, res) => {
    try {
        // we can access role from token
        const role = req.user.role;

        // Only Admin can access this route
        if (role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Access denied. Only Admin can view users.",
            });
        }

        // Get search and country from request
        const { search, country } = req.body;

        // Get repository to query database
        const userData = AppDataSource.getRepository(User);


        let users;

        if (search && country) {
            // Search name OR email and filter by country
            users = await userData.find({
                where: [
                    { name: Like(`${search}%`), country },
                    { email: ILike(`${search}%`), country }
                ],
                select: ["id", "name", "email", "role", "country"]
            });
        } else if (search) {
            // Search only name OR email
            users = await userData.find({
                where: [
                    { name: Like(`${search}%`) },
                    { email: ILike(`${search}%`) }
                ],
                select: ["id", "name", "email", "role", "country"]
            });
        } else if (country) {
            // Filter only by country
            users = await userData.find({
                where: { country },
                select: ["id", "name", "email", "role", "country"]
            });
        } else {
            // No filter, list all users
            users = await userData.find({
                select: ["id", "name", "email", "role", "country"]
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        console.error("Error in searchUserController:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getUserDetailsController = async (req, res) => {
    try {
        // getting user role
        const role = req.user.role;

        // geting table user
        const userData = AppDataSource.getRepository(User);
        let userDetails;

        // if staff
        if (role === "Staff") {
            //Staff cany see only own details
            const id = req.user.id;
            //no password can see
            userDetails = await userData.findOne({ where: { id }, select: ["id", "name", "email", "role", "country"] });
        }
        // If this user is Admin 
        else if (role == "Admin") {
            //Admin can see details of any user by id
            const id = parseInt(req.params.id);
            userDetails = await userData.findOne({ where: { id }, select: ["id", "name", "email", "role", "country"] });
        }
        // if no role found
        else {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // If not suer found in database
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            userDetails
        });
    } catch (error) {
        console.error("Error in getUserDetailsController:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

} 
