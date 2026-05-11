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


export const CreateAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  photo: z.instanceof(FileList).optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must include special character"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-().]{7,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
})

export type CreateAccountFormData = z.infer<typeof CreateAccountSchema>;