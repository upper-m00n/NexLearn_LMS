import { Request,Response } from "express";
import { loginSchema, registerSchema } from "../utils/validation";
import bcrypt from 'bcrypt';
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";



export const register= async (req:Request, res:Response) =>{
    try {
        const {username,email,password,role}= req.body
        const existingUser = await prisma.user.findUnique({
            where:{email}
        })

        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const hashed = await bcrypt.hash(password,10);

        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashed,
                role
            }
        })

        const token= generateToken(newUser);
        res.status(201).json({user:{id:newUser.id, email:newUser.email, role:newUser.role}, token, message:"User registered successfully"})

    } catch (error) {
        console.log("Error registering new user",error);
        res.status(500).json({error:"Internal server error"})
    }
}


export const login = async(req:Request, res:Response)=>{
    try {
        const {email,password}= req.body;

        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(!user){
            return res.status(401).json({message:"User with this email does not exists."})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials."})
        }
        const token = generateToken(user);

        res.status(200).json({user:{id:user.id, email:user.email, role:user.role}, token, message:"sign in successfull"})
    } catch (error) {
        console.log("Error logging user",error);
        res.status(500).json({error:"Internal server error"})
    }
}