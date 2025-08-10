'use client';

import {useForm} from 'react-hook-form'
import * as z from 'zod';
import { loginSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login(){
    const {setUser,setToken}= useAuth();
    const router=useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver:zodResolver(loginSchema)
    })

    const onSubmit = async (data:z.infer<typeof loginSchema>) =>{
        try {
            const res = await axios.post('http://localhost:4000/api/auth/login',data);
            localStorage.setItem("token",res.data.token)
            localStorage.setItem('user',JSON.stringify(res.data.user));

            setUser(res.data.user);
            setToken(res.data.token);
            
            console.log(res);
            toast(res.data.message)
            router.push('/trainer')
        } catch (error) {
            console.log("error in signup",error);
            toast("error registering user....")
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-800'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to NexLearn.
                    </h1>
                    <p className="mb-4">Sign in to continue your learning journey.</p>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="your@gmail.com" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Passowrd</FormLabel>
                            <FormControl>
                                <Input placeholder="password" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}