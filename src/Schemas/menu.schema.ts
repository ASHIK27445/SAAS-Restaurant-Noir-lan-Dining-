import z from "zod";


export const MenuItemSchema = z.object({
    name: z
        .string()
        .min(3, "Item name is too short")
        .max(120),
    
    description: z
        .string()
        .min(10, "Description too short")
        .max(500),

    category: z.string(),

    price: z
        .number()
        .min(0),

    sku: z
        .string()
        .min(3)
        .max(30),

    calories: z
        .number()
        .min(0)
        .optional(),

    allergens: z.array(z.string()),

    dietary: z.object({
        vegan: z.boolean(),
        vegetarian: z.boolean(),
        glutenFree: z.boolean(),
    }),

    kitchenNotes: z.string().optional(),

    isActive: z.boolean(),

    imageFile: z
        .instanceof(File)
        .optional(),
    
    image: z
        .string()
        .url("Invalid image URL")
        .optional()
        .or(z.literal(''))
})

export type MenuItemFormData = z.infer<typeof MenuItemSchema>