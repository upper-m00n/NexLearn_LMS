import {email, z} from 'zod'

export const registerSchema= z.object(
    {
        username:z.string().min(3).max(20),
        email:z.string().email(),
        password:z.string()
                .min(8)
                .regex(/[A-Z]/,"Must contain an uppercase letter")
                .regex(/[0-9]/,"Must contain a number"),
    }
);

export const loginSchema= z.object({
    email:z.string().email(),
    password:z.string().min(8)
});