import { Request,Response } from "express"
import prisma from "../prisma/client";

// fetch user profile
export const fetchUser=async(req:Request,res:Response)=>{
    try {

        const emailId=req.body.data;
        //console.log(req.body)

        const profile=await prisma.user.findUnique({
            where:{
                email:emailId
            }
        })

        if(!profile){
            return res.status(404).json({message:"User does not exists."})
        }

        res.status(200).json({profile, message:"Profile fetched successfully!"})
    } catch (error) {
        console.log("error while fetching user profile",error);
        res.status(500).json({message:"unable to fetch user profile"})
    }
}

//update user profile
export const updateUser=async(req:Request,res:Response)=>{
    try {
        const userId=req.query.userId as string;
        const {email,username,age,profilePic,bibliography,mobile,gender}=req.body;

        if(!userId || !email || !username){
            return res.status(404).json({message:"Username and email are missing."})
        }

        const updatedUser= await prisma.user.update({
            where:{
                id:userId as string
            },
            data:{
                username,
                email,
                age,
                mobile,
                bibliography,
                profilePic,
                gender
            }
        })

        if(!updatedUser){
            return res.status(404).json({message:"User not found!"});
        }

        res.status(200).json({updatedUser,message:"User profile updated successfully!"})

    } catch (error) {
        console.log("Error while updating User profile",error);
        res.status(500).json({message:"Internal server error"})
    }
}


// delete user
export const deleteUser=async(req:Request,res:Response)=>{
    try {
        const userId=req.query.userId as string;

        const deleteUser= await prisma.user.delete({
            where:{
                id:userId
            }
        })

        if(!deleteUser){
            return res.status(400).json({message:"Couldn't delete user"})
        }

        res.status(200).json({message:"User deleted successfully!"})

    } catch (error) {
        console.log("Error deleting user",error);
        res.status(500).json({message:"Internal server error"})
    }
}