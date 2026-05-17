// CategoryAddModal.tsx (improved version)
import { Camera, CheckCircle, EyeOff, X } from "lucide-react";
import { createCategorySchema, type CreateCategoryInput } from "../../Schemas/menu.category.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // callback for refresh
};

const CategoryAddModal = ({ isOpen, onClose, onSuccess }: Props) => {
    const [imagePreview, setImagePreview] = useState<string>("");
    const [error, setError] = useState<string>("");
    
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<CreateCategoryInput>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
            image: ""
        },
    });

    const onSubmit = async (data: CreateCategoryInput) => {
        console.log(data)
        setError("");
        
        try {
            const res = await fetch("http://localhost:3000/menu/category/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.message || "Failed to create category");
                return;
            }

            console.log("Created:", result);
            
            // Reset form
            reset();
            setImagePreview("");
            setError("");
            
            // Call success callback
            if (onSuccess) onSuccess();
            
            // Close modal
            onClose();
            
        } catch (error) {
            console.error("Network error:", error);
            setError("Network error. Please try again.");
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/70 px-4 py-6 backdrop-blur-sm">
            <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_rgba(27,28,26,0.04)]">
                
                {/* Header */}
                <div className="flex items-start justify-between bg-surface-container-lowest px-5 py-4">
                    <div>
                        <p className="mb-1 text-xs font-medium text-secondary">
                            Menu Organization
                        </p>
                        <h2 className="font-headline text-xl tracking-tight text-primary">
                            New Category
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Body */}
                    <div className="space-y-5 bg-surface px-5 py-4">
                        
                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
                                {error}
                            </div>
                        )}
                        
                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-on-surface">
                                Category Title *
                            </label>
                            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low transition focus-within:border-primary/20 focus-within:bg-surface-container-high">
                                <input
                                    type="text"
                                    placeholder="e.g., Artisanal Starters"
                                    {...register("name")}
                                    className="w-full rounded-lg border-0 bg-transparent px-3 py-2.5 text-sm focus:outline-none"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-on-surface">
                                Editorial Description
                            </label>
                            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low transition focus-within:border-primary/20 focus-within:bg-surface-container-high">
                                <textarea
                                    rows={3}
                                    placeholder="A brief narrative..."
                                    {...register("description")}
                                    className="w-full resize-none rounded-lg border-0 bg-transparent px-3 py-2.5 text-sm focus:outline-none"
                                />
                            </div>
                            <p className="text-[11px] text-on-surface-variant">
                                Visible to guests on the digital menu.
                            </p>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-on-surface">
                                Category Status
                            </label>
                            <div className="flex gap-3">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        value="active"
                                        checked={watch("isActive") === true}
                                        onChange={() => setValue("isActive", true)}
                                        className="peer sr-only"
                                    />
                                    <div className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-low px-4 py-2 text-xs font-medium text-on-surface-variant transition peer-checked:border-primary/20 peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed">
                                        <CheckCircle size={15} />
                                        Active
                                    </div>
                                </label>

                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        value="inactive"
                                        checked={watch("isActive") === false}
                                        onChange={() => setValue("isActive", false)}
                                        className="peer sr-only"
                                    />
                                    <div className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-low px-4 py-2 text-xs font-medium text-on-surface-variant transition peer-checked:border-outline/20 peer-checked:bg-surface-container-high peer-checked:text-on-surface">
                                        <EyeOff size={15} />
                                        Draft / Hidden
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Upload */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-on-surface">
                                Cover Imagery
                            </label>
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} className="mt-2 h-32 w-full object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview("");
                                            setValue("image", "");
                                        }}
                                        className="absolute top-4 right-4 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="group flex cursor-pointer justify-center rounded-lg border border-outline-variant/20 bg-surface-container-low px-5 py-6 transition hover:bg-surface-container-high">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <Camera size={20} />
                                        <div className="mt-2 flex justify-center text-xs text-on-surface-variant">
                                            <span className="font-medium text-primary">
                                                Upload a file
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="mt-1 text-[10px] text-on-surface-variant">
                                            PNG or JPG up to 10MB.
                                        </p>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    const base64 = reader.result as string;
                                                    setImagePreview(base64);
                                                    setValue("image", base64);
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 bg-surface-container-lowest px-5 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl bg-surface-container-high px-5 py-2.5 text-xs font-medium text-primary hover:bg-surface-container"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-medium text-on-primary transition hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryAddModal;