import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  role: z.string().optional(),
  age: z.string().optional(),
  mobile: z.string().min(10, "Must be 10 digits").max(10, "Must be 10 digits"),
  profilePic: z.string().url().optional(),
  bibliography: z.string().min(20, "Bio must be at least 20 characters").optional(),
  gender: z.string().optional(),
});
