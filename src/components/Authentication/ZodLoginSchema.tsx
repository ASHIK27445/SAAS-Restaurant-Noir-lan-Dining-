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
              .min(8, "Minium 8 character required.")
              .max(256)
              .regex(/[a-z]/, "Must include lowercase letter")
              .regex(/[A-Z]/, "Must include uppercase letter")
              .regex(/[0-9]/, "Must include number")
              .regex(/[^a-zA-Z0-9]/, "Must include special character"),
})


export type LoginFormData = z.infer<typeof LoginSchema>