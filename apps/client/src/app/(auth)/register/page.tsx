'use client';

import {useForm} from 'react-hook-form'
import * as z from 'zod';
import { registerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios'
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/axios/axios';

export default function Register(){

    const router= useRouter();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver:zodResolver(registerSchema)
    })

    const onSubmit = async (data: z.infer<typeof registerSchema>) =>{
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/register`,data);
            router.push('/verify')
        } catch (error) {
            console.log("error in signup",error);
            toast("error registering user....")
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-200'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
                        Welcome to NexLearn.
                    </h1>
                    <p className="mb-4">Sign up to start your learning journey.</p>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                        />
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
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>You role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a your role." />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                    <SelectItem value="TRAINER">Trainer</SelectItem>
                                    </SelectContent>
                                </Select>
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