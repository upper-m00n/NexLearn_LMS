import { Request,Response } from "express"
import prisma from "../prisma/client";
import { generateToken } from "../utils/jwt";
export const verifyOtp= async (req:Request,res:Response)=>{
    try {
        const {email,otp}=req.body;

        console.log(email,otp);

        if(!email || !otp){
            return res.status(400).json({message:"Enter a valid otp"});
        }

        const user= await prisma.user.findUnique({
            where:{
                email
            }
        })

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP or email." });
        }

        if (user.otpExpires && user.otpExpires < new Date()) {
            return res.status(400).json({ message: "OTP has expired. Please register again." });
        }

        const verifiedUser=await prisma.user.update({
            where:{
                email
            },
            data:{
                verified:true,
                otp:null,
                otpExpires:null
            }
        })
        const token = generateToken({ id: verifiedUser.id, role: verifiedUser.role });
    
        res.status(200).json({ 
            user: { id: verifiedUser.id, email: verifiedUser.email, role: verifiedUser.role, username: verifiedUser.username }, 
            token, 
            message: "Account verified successfully. You are now logged in." 
        });

    } catch (error) {
        console.log("Error verifying OTP", error);
        res.status(500).json({ error: "Internal server error" });
    }
}