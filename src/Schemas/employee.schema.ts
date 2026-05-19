import z from "zod";

export const employeeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().email("Invalid email address"),
    role: z.enum(["Chef","Sous Chef","Waiter","Cashier","Manager","Admin",]),
    title: z.string().min(1, "Job title is required"),
    phone: z.string().optional(),
    systemAccess: z.boolean().default(true),
    image: z.string().url("Invalid image URL").optional().or(z.literal(""))
})

export type EmployeeFormData = z.infer<typeof employeeSchema>;