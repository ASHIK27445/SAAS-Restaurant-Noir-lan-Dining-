import z from "zod";

export const employeeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["Chef","SousChef","Waiter","Cashier","Manager","Admin","DemoAdmin"]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    title: z.string().min(1, "Job title is required"),
    phone: z.string().optional(),
    systemAccess: z.boolean().default(true),
    image: z.string().url("Invalid image URL").optional().or(z.literal("")),
    hourlyRate: z.string().optional(),
    scheduleStartTime: z.string().optional(),
    scheduleEndTime: z.string().optional(),
    scheduleLabel: z.string().optional(),
})

export const editEmployeeSchema = employeeSchema.partial().extend({
    id: z.string().min(1, "Staff ID is required")
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;