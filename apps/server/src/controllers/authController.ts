import { Request,Response } from "express";
import { loginSchema, registerSchema } from "../utils/validation";
import bcrypt from 'bcrypt';
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";



export const register= async (req:Request, res:Response) =>{
    try {
        const data = registerSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({
            where:{email:data.email}
        })

        if(existingUser){
            return res.status(400).json({error:"User already exists"})
        }

        const hashed = await bcrypt.hash(data.password,10);

        const newUser = await prisma.user.create({
            data:{
                ...data,
                password:hashed
            }
        })

        const token= generateToken(newUser.id);
        res.status(201).json({user:{id:newUser.id, email:newUser.email}, token})

    } catch (error) {
        console.log("Error registering new user",error);
        res.status(500).json({error:"Internal server error"})
    }
}


export const login = async(req:Request, res:Response)=>{
    try {
        const data = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where:{email:data.email}
        })

        if(!user){
            return res.status(401).json({error:"User with this email does not exists."})
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials."})
        }
    } catch (error) {
        console.log("Error logging user",error);
        res.status(500).json({error:"Internal server error"})
    }
}