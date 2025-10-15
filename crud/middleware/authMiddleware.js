import jwt from "jsonwebtoken";

// This is auth middleware that is check jwt and adds user info  to req.user

export const authMiddleware = (req,res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message: "Token not found and access denied"
            });
        }

        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        // Now we will attached user info to request object that we have in token 
        req.user = decoded;

        next();
    }catch(error){
        console.error("Token verification failed:", error.message);
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}