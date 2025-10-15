import { AppDataSource } from "../db.js";
import bcrypt from 'bcrypt'
import { User} from "../entities/User.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


dotenv.config();

export const registerController = async(req,res) => {
    try{
    
    
    const {name,email,password,role,phone,city,country} = req.body;

    // Validations
    if(!name || !email || !password || !phone){
        res.status(400).json({
            success:false,
            message: "Missing required fields : name, email, password, role, phone are mandatory"
        })
    }
    /*
        AppDataSource is used to interact with database and
        .getRepository is class of TypeORM that gives method for interact
        with database table corresponsd entity like in this code User
        method like findOne(),find(),create(),save()
    */

    const userData = AppDataSource.getRepository(User);

    // Check existing of entry no duplicate email allow
    const existUser = await userData.findOne({where:{email}});
    if(existUser){
        return res.status(409).json({
        success:false,
        message: "Email already registered"
        })
    }

    // We dont plaintext password directly for security purpose 
    // like if unAuthorized purson has access of database still 
    // he does not able to get password
    // THis is done within using bcrypt that is package in node js
    const hashedPass = await bcrypt.hash(password,10);

    const newUser = userData.create({
        name,email,password:hashedPass,role,phone,city,country,
    });

    // save user
    await userData.save(newUser);

    return res.status(201).json({
        success:true,
        message: "User registered successfully",

    });
    } catch(error){
        console.error("Error in register",error.message);
        return res.status(500).json({
            success:false,
            message: "Internal server error",
        });
    }
}

// This is login Controller

export const loginController = async(req,res) => {
    try{
    const {email,password} = req.body;

    // Validations
    if(!email,!password){
        return res.status(409).json({
            success:false,
            message:'Missing required fields : email, password'
        })
    }


    const userData = AppDataSource.getRepository(User);

    // Check user exitency
    const foundUser = await userData.findOne({where: {email}})
    if(!foundUser){
        return res.status(404).json({
            success:false,
            message: "User not found",
        })
    }

    //compare password by compare method of bcrypt
    const isMatch = await bcrypt.compare(password,foundUser.password)
    if(!isMatch){
        return res.status(401).json({
            success:false,
            message: 'Invalid Credentials'
        })
    }    

    // Now we will generate token for authorization purpose
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(
        {
            id:foundUser.id,
            role:foundUser.role,
            email: foundUser.email,
        },
        JWT_SECRET,
        {expiresIn:"1h"}
    )

    // Store token in cookie httpOnly: true makes it safe from JS access

    res.cookie("token",token, {
        httpOnly:true,
        secure: true,
        sameSite: "strict",
    })

    res.status(201).json({
        success:true,
        message: 'User login Successfully',
    })
    }catch(error){
        console.error('Error in login',error.message);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }

}