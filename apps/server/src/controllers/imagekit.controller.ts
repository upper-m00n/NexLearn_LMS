import Imagekit from 'imagekit'
import { Request, Response } from 'express';

const imagekit = new Imagekit({
    publicKey:"public_Mn4JpNN5SqQufk9nqa+bNgmdGNY=",
    privateKey:"private_BPAGzc+7LcjpLyK/XQu2eYmH5EY=",
    urlEndpoint:"https://ik.imagekit.io/uyo056xswd"
});

export const getImagekitAuth = (req:Request, res:Response)=>{
    const authParams = imagekit.getAuthenticationParameters();
    res.send(authParams)
}