import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction} from 'express'

interface AuthPayload{
    id: string;
    role: string;
}

declare global{
    namespace Express{
        interface Request{
            user?:AuthPayload
        }
    }
}

export const protect = (req:Request, res:Response, next:NextFunction)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error:"Not authorized, no token"})
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Failed to authorize",error)
        return res.status(401).json({error:"Not authorized, token failed"})
    }
}

export const authorizeRole = (...roles: string[]) =>{
    return (req:Request, res:Response, next:NextFunction)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({message:"Forbidden: insufficient role"})
        }
        next();
    }
}