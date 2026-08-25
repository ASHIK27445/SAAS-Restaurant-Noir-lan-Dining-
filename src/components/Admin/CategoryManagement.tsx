import { ChevronRight, CookingPot, GripHorizontal, ListFilterPlus, Martini, Plus, Search, SquarePen, X, Camera } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import CategoryAddModal from "./CategoryAddModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CategoryManagementSkeletonLoading from "./SkeletonLoading/CategoryManageLoading";
import { authFetch } from "../../api/authFetch";

type Category = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    menuItems: number;
  };
};

// Edit Category Schema
const editCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  image: z.string().optional(),
  sortOrder: z.number().min(0, "Sort order must be 0 or greater"),
});

type EditCategoryInput = z.infer<typeof editCategorySchema>;


// Edit Modal Component
function EditCategoryModal({ 
  isOpen, 
  onClose, 
  category, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  category: Category | null;
  onSuccess: () => void;
}) {
const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<EditCategoryInput>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      image: "",
      sortOrder: 0,
    },
  });

  // Populate form when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive,
        image: category.image || "",
        sortOrder: category.sortOrder,
      });
      setImagePreview(category.image || "");
    }
  }, [category, reset]);

  const onSubmit = async (data: EditCategoryInput) => {
    if (!category) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await authFetch(`http://localhost:3000/menu/category/${category.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        onSuccess();
        onClose();
        reset();
        setImagePreview("");
      } else {
        setError(result.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!isOpen || !category) return null;

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-150 overflow-hidden rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-secondary mb-0.5">Menu management</p>
          <h2 className="text-[15px] font-medium text-primary">Edit category</h2>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition">
          <X size={13} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-[1fr_180px]">

          {/* LEFT */}
          <div className="flex flex-col gap-2.75 p-4 border-r border-outline-variant/10">

            {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600">{error}</div>}

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-on-surface-variant">Category title *</label>
              <input type="text" {...register("name")} placeholder="e.g., Artisanal Starters"
                className="h-7.5 rounded-lg border border-outline-variant/20 bg-surface-container-low px-2.5 text-xs focus:outline-none focus:border-primary/30 transition" />
              {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-on-surface-variant">Description</label>
              <textarea rows={2} {...register("description")} placeholder="A brief narrative..."
                className="resize-none rounded-lg border border-outline-variant/20 bg-surface-container-low px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary/30 transition" />
            </div>

            {/* Sort + Status */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-on-surface-variant">Sort order</label>
                <input type="number" {...register("sortOrder", { valueAsNumber: true })}
                  className="h-7.5 rounded-lg border border-outline-variant/20 bg-surface-container-low px-2.5 text-xs focus:outline-none transition" />
                <p className="text-[10px] text-on-surface-variant">Lower = appears first</p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-on-surface-variant">Status</label>
                <div className="flex gap-3 pt-1">
                  <label className="cursor-pointer flex items-center gap-1.5 text-xs">
                    <input type="radio" checked={watch("isActive")} onChange={() => setValue("isActive", true)} /> Active
                  </label>
                  <label className="cursor-pointer flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <input type="radio" checked={!watch("isActive")} onChange={() => setValue("isActive", false)} /> Draft
                  </label>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-on-surface-variant">Image URL</label>
              <div className="flex gap-1.5">
                <input type="text" {...register("image")} placeholder="https://..."
                  onChange={(e) => { register("image").onChange(e); setImagePreview(e.target.value); }}
                  className="flex-1 h-7.5 rounded-lg border border-outline-variant/20 bg-surface-container-low px-2.5 text-xs focus:outline-none transition" />
                <button type="button" onClick={() => { setValue("image", ""); setImagePreview(""); }}
                  className="h-7.5 px-2.5 rounded-lg border border-outline-variant/20 text-[11px] text-on-surface-variant hover:bg-surface-container-low transition">
                  Clear
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-3 border-t border-outline-variant/10 flex justify-end gap-2">
              <button type="button" onClick={onClose}
                className="h-7.5 px-3.5 rounded-lg text-[11px] font-medium border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="h-7.5 px-3.5 rounded-lg bg-primary text-[11px] font-medium text-on-primary hover:bg-primary/90 disabled:opacity-50 transition">
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-2.5 p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-secondary">Cover image</p>

            <div className="aspect-4/3 rounded-lg overflow-hidden border border-outline-variant/10 bg-surface-container-low flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} loading="lazy" alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-on-surface-variant/30">
                  <Camera size={22} />
                  <span className="text-[10px]">No image</span>
                </div>
              )}
            </div>

            <label className="cursor-pointer">
              <div className="flex items-center justify-center gap-1.5 h-7 rounded-lg border border-outline-variant/20 bg-surface-container-low text-[11px] text-on-surface-variant hover:bg-surface-container-high transition">
                <Camera size={12} /> Upload file
              </div>
              <input type="file" accept="image/*" className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const b64 = reader.result as string;
                    setImagePreview(b64);
                    setValue("image", b64);
                  };
                  reader.readAsDataURL(file);
                }} />
            </label>

            <div className="rounded-lg border border-outline-variant/10 p-3 flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-widest text-secondary">Stats</p>
              <div className="flex justify-between text-[11px]">
                <span className="text-on-surface-variant">Menu items</span>
                <span className="font-medium">{category._count?.menuItems || 0}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-on-surface-variant">Sort position</span>
                <span className="font-medium">#{category.sortOrder}</span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  </div>
);
}

const EditCategoryModalMemo = React.memo(EditCategoryModal)

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authFetch("http://localhost:3000/menu/all/categories");
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Toggle category active status
  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await authFetch(`http://localhost:3000/menu/category/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const activeCategories = useMemo(() => {
    return categories.filter(cat => cat.isActive);
  }, [categories]);

  const inactiveCategories = useMemo(() => {
    return categories.filter(cat => !cat.isActive);
  }, [categories]);

  const featuredActiveCategories = useMemo(() => {
    return activeCategories.slice(0, 3);
  }, [activeCategories]);

  const featuredInactiveCategory = useMemo(() => {
    return inactiveCategories[0];
  }, [inactiveCategories]);

  if (isLoading) {
    return <CategoryManagementSkeletonLoading/>
  }

  if (error) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchCategories}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex font-body">
      {/* Edit Modal */}
      <EditCategoryModalMemo
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSuccess={fetchCategories}
      />

      {/* Add Modal */}
      <CategoryAddModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          fetchCategories();
        }}
      />

      <main className="flex-1 flex flex-col min-h-screen">
        <section className="px-8 pt-3 pb-8 space-y-6">

          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-headline font-bold text-primary tracking-tight mb-2">
                Refine Your Editorial Canvas
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                Organize your offerings into curated collections that guide guests through their
                dining journey. Use these categories to structure the digital menu experience.
              </p>
              <p className="text-xs text-secondary/60 mt-2">
                Total {activeCategories.length} active categories • {categories.length} total
              </p>
            </div>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-xl transition-all active:scale-95"
            >
              <Plus size={16} />
              <span>Add New Category</span>
            </button>
          </div>

          {/* Featured Bento Grid - 3 Active + 1 Inactive */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Card 1: First Active Category (Wide Card) */}
            {featuredActiveCategories[0] && (
              <div className="col-span-12 md:col-span-8 group relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-60">
                  <div className="w-1/2 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[9px] font-bold uppercase tracking-widest">
                          ACTIVE
                        </span>
                        <span className="text-on-surface-variant text-[11px] font-medium">
                          {featuredActiveCategories[0]._count?.menuItems || 0} items
                        </span>
                      </div>
                      <h3 className="text-2xl font-headline text-on-surface mb-1.5">
                        {featuredActiveCategories[0].name}
                      </h3>
                      <p className="text-sm text-on-surface-variant line-clamp-3">
                        {featuredActiveCategories[0].description || "No description available"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-low flex items-center justify-center text-xs font-bold text-primary">
                          {featuredActiveCategories[0]._count?.menuItems || 0}
                        </div>
                        <span className="text-xs text-on-surface-variant">Menu Items</span>
                      </div>
                      <button className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="w-1/2 relative overflow-hidden bg-linear-to-br from-primary/20 to-secondary/20">
                    {featuredActiveCategories[0].image ? (
                      <img
                        loading="lazy"
                        src={featuredActiveCategories[0].image}
                        alt={featuredActiveCategories[0].name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/30">
                        <CookingPot size={48} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: Second Active Category (Small Card - Martini/Wine type) */}
            {featuredActiveCategories[1] && (
              <div className="col-span-12 md:col-span-4 group bg-surface-container-lowest rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-surface-container-low text-primary">
                      <Martini size={18} />
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[9px] font-bold uppercase tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                  <h3 className="text-xl font-headline text-on-surface mb-1.5">
                    {featuredActiveCategories[1].name}
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed mb-4">
                    {featuredActiveCategories[1].description || "No description available"}
                  </p>
                </div>
                <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface">
                    {featuredActiveCategories[1]._count?.menuItems || 0} Items
                  </span>
                  <button className="text-primary hover:underline font-medium text-xs">
                    Manage List
                  </button>
                </div>
              </div>
            )}

            {/* Card 3: Third Active Category (Small Card - Main Course type) */}
            {featuredActiveCategories[2] && (
              <div className="col-span-12 md:col-span-4 group bg-surface-container-lowest rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-primary text-on-primary shadow-lg">
                      <CookingPot size={18} />
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[9px] font-bold uppercase tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                  <h3 className="text-xl font-headline text-on-surface mb-1.5">
                    {featuredActiveCategories[2].name}
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed mb-4">
                    {featuredActiveCategories[2].description || "No description available"}
                  </p>
                </div>
                <div className="pt-4 relative z-10 border-t border-outline-variant/10 flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface">
                    {featuredActiveCategories[2]._count?.menuItems || 0} Items
                  </span>
                  <button className="text-primary hover:underline font-medium text-xs">
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* Card 4: Inactive Category (Wide Reversed Card - ALWAYS INACTIVE) */}
            {featuredInactiveCategory ? (
              <div className="col-span-12 md:col-span-8 group relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-60 flex-row-reverse">
                  <div className="w-1/2 p-5 flex flex-col justify-between bg-surface-container-high text-on-surface-variant">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[9px] font-bold uppercase tracking-widest">
                          INACTIVE
                        </span>
                        <span className="text-on-surface-variant/70 text-[11px] font-medium italic">
                          {featuredInactiveCategory._count?.menuItems || 0} items
                        </span>
                      </div>
                      <h3 className="text-2xl font-headline text-on-surface mb-1.5">
                        {featuredInactiveCategory.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant/80 line-clamp-3">
                        {featuredInactiveCategory.description || "No description available"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-on-surface-variant">
                        Draft Mode
                      </span>
                      <button 
                        onClick={() => toggleCategoryStatus(featuredInactiveCategory.id, featuredInactiveCategory.isActive)}
                        className="px-4 py-1.5 bg-primary text-on-primary rounded-lg font-bold text-xs hover:bg-primary/90 transition-colors"
                      >
                        Enable Now
                      </button>
                    </div>
                  </div>
                  <div className="w-1/2 relative overflow-hidden bg-linear-to-br from-surface-container-high to-surface-container-lowest grayscale opacity-60">
                    {featuredInactiveCategory.image ? (
                      <img
                        loading="lazy"
                        src={featuredInactiveCategory.image}
                        alt={featuredInactiveCategory.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/30">
                        <CookingPot size={48} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Fallback if no inactive category exists
              <div className="col-span-12 md:col-span-8 group relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm">
                <div className="flex h-60 flex-row-reverse">
                  <div className="w-1/2 p-5 flex flex-col justify-between bg-surface-container-high">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[9px] font-bold uppercase tracking-widest">
                          INACTIVE
                        </span>
                      </div>
                      <h3 className="text-2xl font-headline text-on-surface mb-1.5">
                        No Inactive Category
                      </h3>
                      <p className="text-sm text-on-surface-variant/80">
                        All categories are currently active. Create a new category or deactivate an existing one to see it here.
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-on-surface-variant">
                        No draft categories
                      </span>
                    </div>
                  </div>
                  <div className="w-1/2 relative overflow-hidden bg-linear-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
                    <CookingPot size={48} className="text-on-surface-variant/20" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Management Table */}
          <div className="bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h4 className="text-lg font-headline text-on-surface">All Categories</h4>
                <p className="text-on-surface-variant text-xs mt-0.5">
                  Direct management and ordering of your menu sections.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-surface-container-lowest px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Search size={14} />
                  <input
                    className="bg-transparent border-none focus:ring-0 text-xs w-40 outline-none"
                    placeholder="Filter categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="p-1.5 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant">
                  <ListFilterPlus size={16} />
                </button>
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
              <div className="col-span-5">Category Title</div>
              <div className="col-span-2 text-center">Items</div>
              <div className="col-span-2 text-center">Sort Order</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Dynamic Rows */}
            <div className="space-y-2">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-secondary">
                  No categories found
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`grid grid-cols-12 px-4 py-3.5 items-center bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all ${
                      !category.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-surface-container-low overflow-hidden ${
                          !category.isActive ? "grayscale" : ""
                        }`}
                      >
                        {category.image ? (
                          <img
                            loading="lazy"
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary">
                            <CookingPot size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{category.name}</p>
                        <p className="text-[11px] text-on-surface-variant line-clamp-1">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-sm font-medium text-on-surface">
                      {category._count?.menuItems || 0}
                    </div>

                    <div className="col-span-2 text-center text-sm font-medium text-on-surface">
                      {category.sortOrder}
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          category.isActive
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {category.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-end gap-1.5">
                      {/* Edit Button - Now opens modal */}
                      <button 
                        onClick={() => handleEditClick(category)}
                        className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant transition-colors"
                        title="Edit Category"
                      >
                        <SquarePen size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant transition-colors cursor-move">
                        <GripHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}