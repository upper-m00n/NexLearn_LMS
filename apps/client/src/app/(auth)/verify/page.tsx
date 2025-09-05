
'use client'

import { BASE_URL } from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext"; 
import { verificationSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod';

export default function UserVerificationPage() {

    const{setUser,setToken}= useAuth();

    const router = useRouter();

    const form = useForm<z.infer<typeof verificationSchema>>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            email: "",
            otp: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof verificationSchema>) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, data);
            
            if (res.data.user && res.data.token) {

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                setUser(res.data.user);
                setToken(res.data.token);
                

                toast.success(res.data.message);
                router.push('/');
            }
        } catch (error) {
            let errorMessage = "Verification failed. Please try again.";

            if (axios.isAxiosError(error)) {
                if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                }
            }
            
            toast.error(errorMessage);
            console.error("Verification error:", error);
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Verify Your Account
                    </h1>
                    <p className="text-gray-600 mb-6">Check your registered email for the 6-digit OTP.</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="your@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={5} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Verifying..." : "Verify Account"}
                            </Button>
                            <p className="text-center text-sm">Haven&apos;t registered yet? <Link href='/register' className="text-blue-600 hover:underline">Register</Link></p>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}