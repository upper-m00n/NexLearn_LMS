import { Request,Response } from "express";
import { loginSchema, registerSchema } from "../utils/validation";
import bcrypt from 'bcrypt';
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/mailer";



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

        const otp= Math.floor(10000+Math.random()*90000).toString();
        const otpExpires=new Date(Date.now() +10 * 60 *1000);

        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashed,
                role,
                otp,
                otpExpires,
                verified:false
            }
        })

        const emailHtml = `<h1>Welcome to NexLearn!</h1><p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`;

        await sendEmail(newUser.email,"Verify Your NexLearn Account",emailHtml);

        res.status(201).json({ 
            message: "Registration successful. Please check your email for a verification OTP.",
            userId: newUser.id
        });


        // const token= generateToken({id:newUser.id, role:newUser.role});
        // res.status(201).json({user:{id:newUser.id, email:newUser.email, role:newUser.role, username:newUser.username}, token, message:"User registered successfully"})

    } catch (error) {
        console.log("Error registering new user",error);
        res.status(500).json({error:"Internal server error"})
    }
}


export const login = async(req:Request, res:Response)=>{
    try {
        const {email,password}= req.body;

        const user = await prisma.user.findUnique({
            where:{email},
            select:{
                id: true,
                email: true,
                password: true,
                role: true,
                username: true,
                profilePic:true,
            }
        })
        console.log("User logged in successfully", user);

        if(!user){
            return res.status(401).json({message:"User with this email does not exists."})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials."})
        }
        const token = generateToken({id:user.id, role:user.role});
       
        res.status(200).json({user, token, message:"sign in successfull"})
    } catch (error) {
        console.log("Error logging user",error);
        res.status(500).json({error:"Internal server error"})
    }
}