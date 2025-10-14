import { AppDataSource } from "../db.js";
import bcrypt from 'bcrypt'
import { User } from "../entities/User.js";

export const registerController = async(req,res) => {
    try{

    const {name,email,password,role,phone,city,country} = req.body;

    if(!name || !email || !password || !phone){
        res.status(400).json({
            success:false,
            message: "Missing required fields : name, email, password, role, phone are mandatory"
        })
    }

    const userData = AppDataSource.getRepository(User);
    const existUser = await userData.findOne({where:{email}});
    if(existUser){
        return res.status(409).json({
        success:false,
        message: "Email already registered"
        })
    }

    const hashedPass = await bcrypt.hash(password,10);

    const newUser = userData.create({
        name,email,password:hashedPass,role,phone,city,country,
    });

    await userData.save(newUser);

    return res.status(201).json({
        success:true,
        message: "User registered successfully",
        user:{
            id:newUser.id,
            name,
            email,
            role, 
            phone,
            city,
            country
        },
    });

    res.status(200).json({
        success:true,
        message: "User registered Successfully"
    })
    } catch(error){
        console.error("Error in register",error);
        return res.status(500).json({
            success:false,
            message: "Internal server error",
        });
    }
}