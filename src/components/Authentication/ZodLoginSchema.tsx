import {z} from "zod";

export const LoginSchema = z.object({
    email : z
            .string()
            .trim()
            .toLowerCase()
            .email("Enter your valid email")
            .max(256),
    
    password: z
              .string()
              .min(6, "Password must be atleast 6 character")
              .max(256)
})