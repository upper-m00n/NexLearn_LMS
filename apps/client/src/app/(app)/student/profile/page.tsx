'use client'

import { BASE_URL } from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { userSchema } from "@/lib/user";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod'
import { User } from "@/types/User";

const StudentProfile = () => {
  const { user } = useAuth();

  // states
  const [profile, setProfile] = useState<User>({
    username: "",
    email: "",
    role: "",
    age:"",
    mobile:"",
    bibliography:"",
    gender:"",
    profilepic:""
  });

  const [profilePic, setProfilePic] = useState("");

  // zod
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) return;
        const emailId = user?.email;
        const res = await axios.post(`${BASE_URL}/api/user/`, { data: emailId });
        console.log(res.data.profile)
        setProfile(res.data.profile);
        setProfilePic(res.data.profile.profilePic ?? "");
        toast.success("Profile loaded successfully!");
      } catch (error) {
        console.log("Error while loading user profile.");
        toast.error("Couldn't load user profile.");
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        email: profile.email,
        bibliography: profile.bibliography ?? "",
        age: profile.age ?? "",
        gender: profile.gender ?? "",
        mobile: profile.mobile ?? "",
      });
    }
  }, [profile]);

// upload profile picture
  const handleProfilePicChange =async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try{
      const authres= await fetch(`${BASE_URL}/api/imagekit/imagekit-auth`)
      const auth=await authres.json();

      const formData=new FormData();
      formData.append("file",file);
      formData.append("fileName",file.name);
      formData.append("publicKey","public_Mn4JpNN5SqQufk9nqa+bNgmdGNY=");
      formData.append("signature",auth.signature);
      formData.append("expire",auth.expire);
      formData.append("token",auth.token);
      formData.append("folder","/profiles");

      const res=await fetch("https://upload.imagekit.io/api/v1/files/upload",{
        method:"POST",
        body:formData,
      })

      const data= await res.json();
      if(data.url){
        setProfilePic(data.url);
        toast.success("Profile picture uploaded !");
      }
      else{
        throw new Error("Upload failed.")
      }
    }
    catch(error){
      console.error("Error uploading Profile picture:", error);
      toast.error("Upload failed");
    }
  };

  // submit new values
  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    if(!profilePic){
      toast.error("please upload a thumbnail.");
      return;
    }

    console.log("onsubmit values:",values);
    const data = {
      ...values,
      profilePic,
    };

    try {
      const res=await axios.put(`${BASE_URL}/api/user/update`, data, {
        params: {
          userId: user?.id,
        },
      });

      toast.success("User profile updated successfully!");
    } catch (error) {
      toast.error("Couldn't update user profile.");
      console.error("Error while updating user profile:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 px-40">
      <div className="bg-black text-white p-4 text-center">
        <h1 className="text-3xl font-semibold">Public Profile</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow">
            <img
              src={profilePic || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="cursor-pointer bg-gray-100 px-3 py-1 rounded-md text-sm shadow hover:bg-gray-200">
            Change Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Form */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your public name" {...field} />
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
                      <Input placeholder="Email address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bibliography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bibliography</FormLabel>
                    <FormControl>
                      <textarea
                        className="border-2 p-2 w-full"
                        placeholder="About you..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Your age" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={profile.gender}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Mobile no." {...field} />
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
  );
};

export default StudentProfile;
