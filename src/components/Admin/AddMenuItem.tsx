import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp} from "lucide-react";
import { MenuItemSchema, type MenuItemFormData } from "../../Schemas/menu.schema";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";


type Category = {
  id: string;
  name: string;
  isActive: boolean;
};

type Allergens = {
  id: string;
  name: string;
}



export default function AddMenuItem() {
  const { register, control, handleSubmit, setValue,
  formState: { errors },} = useForm<MenuItemFormData>({
    resolver: zodResolver(MenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Starter",
      price: 0,
      sku: "",
      calories: 0,
      allergens: [],
      dietary: {
        vegan: false,
        vegetarian: true,
        glutenFree: false,
      },
      kitchenNotes: "",
      isActive: true,
    },
  });

  const [categories, setCategories] = useState<Category[]>([])
  const [allergens, setAllergens] = useState<Allergens[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const activeCategory = useWatch({ control, name: "category" });
  const activeAllergens = useWatch({ control, name: "allergens", defaultValue: [] });
  const isActive = useWatch({ control, name: "isActive" });

  const toggleAllergen = (id: string) => {
    const current = activeAllergens || [];
    setValue(
      "allergens",
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesRes = await fetch("http://localhost:3000/menu/categories");
        const categoriesResult = await categoriesRes.json();
        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }

        // Fetch allergens
        const allergensRes = await fetch("http://localhost:3000/menu/allergens");
        const allergensResult = await allergensRes.json();
        if (allergensResult.success) {
          setAllergens(allergensResult.data);
          // console.log(allergensResult.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to hardcoded data if API fails
        setCategories([
          { id: "1", name: "Starter", isActive: true },
          { id: "2", name: "Main Course", isActive: true },
          { id: "3", name: "Side Dish", isActive: true },
          { id: "4", name: "Dessert", isActive: true },
          { id: "5", name: "Wine & Spirits", isActive: true },
          { id: "6", name: "Specials", isActive: true },
        ]);
        setAllergens([
          { id: "a1", name: "Dairy" },
          { id: "a2", name: "Gluten" },
          { id: "a3", name: "Nuts" },
          { id: "a4", name: "Soy" },
          { id: "a5", name: "Shellfish" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const onSubmit = async (data: MenuItemFormData) => {
    console.log(data);
        // try {
    //   const res = await fetch("http://localhost:3000/menu/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data)
    //   })

    //   const result = await res.json()
    //   console.log(result)
    // } catch (error) {
    //   console.log(error)
    // }
  };


  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">

      <form onSubmit={handleSubmit(onSubmit)}>
        <main className="flex-1 min-w-0 bg-surface">

          {/* Page Content */}
          <div className="max-w-6xl mx-auto px-6 pb-8 pt-2">
            
            {/* Page Header */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-headline font-bold text-primary tracking-tight">
                  Curation Details
                </h2>
                <p className="text-sm text-secondary mt-1 max-w-lg">
                  Define the essence of your new culinary offering. All entries will be
                  formatted for the guest-facing digital editorial.
                </p>
              </div>
              <div className="hidden md:flex gap-3">
                <button className="px-5 py-2 bg-surface-container-high text-primary text-xs font-bold rounded-xl hover:opacity-80 transition-all">
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:opacity-90 transition-all shadow-lg">
                  Publish to Menu
                </button>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* ── Left Column ── */}
              <div className="lg:col-span-5 space-y-6">

                {/* Image Upload */}
                <section>
                  <h3 className="font-headline text-base text-primary mb-3">Editorial Photography</h3>
                  <div className="relative group aspect-6/5 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-surface-container-high">
                    <div className="flex flex-col justify-center items-center p-6">
                      <ImageUp size={24} className="text-primary/40 mb-3"/>
                      <p className="text-xs text-secondary font-medium">Drag and drop dish image</p>
                      <p className="text-[11px] text-secondary/60 mt-1">Recommended: High-resolution portrait, minimum 1200×1500px</p>
                    </div>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-primary shadow-sm uppercase tracking-widest">
                        Select File
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-outline-variant/30"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-surface text-secondary">or</span>
                    </div>
                  </div>

                  {/* Image URL Input */}
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-secondary mb-1.5 group-focus-within:text-primary transition-colors">
                      Image URL
                    </label>
                    <input
                      {...register("image")}
                      className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all py-2.5 px-4 text-sm"
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                    {errors.image && (
                      <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
                    )}
                  </div>
                </section>

                {/* Status & Category */}
                <section className="bg-surface-container-lowest p-5 rounded-xl ring-1 ring-outline-variant/10 shadow-sm space-y-5">

                  {/* Toggle */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-secondary mb-3">Item Status</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary font-medium">Active on digital menu</span>
                      <button
                        type="button"
                        onClick={() => setValue("isActive", !isActive)}
                        role="switch"
                        aria-checked={isActive}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          isActive ? "bg-primary" : "bg-surface-container-high"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="pt-4 border-t border-outline-variant/10">
                    <label className="block text-[10px] uppercase tracking-widest text-secondary mb-3">
                      Menu Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {isLoading ? (
                        // Dynamic Skeleton - 6 items for 2-column grid
                        Array.from({ length: 6 }).map((_, index) => (
                          <div 
                            key={index}
                            className="px-3 py-2 rounded-lg bg-surface-container-low animate-pulse"
                          >
                            <div className="h-4 w-3/4 bg-outline-variant/30 rounded"></div>
                          </div>
                        ))
                      ) : (
                        categories.map((cat) => (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setValue("category", cat.name)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              activeCategory === cat.name
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-low text-secondary hover:bg-surface-container-high"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* ── Right Column ── */}
              <div className="lg:col-span-7 space-y-6">

                {/* Plate Information */}
                <section className="space-y-5">
                  <h3 className="font-headline text-base text-primary pb-2 border-b border-outline-variant/20">
                    Plate Information
                  </h3>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-secondary mb-1.5 group-focus-within:text-primary transition-colors">
                        Item Nomenclature
                      </label>
                      <input
                        {...register("name")}
                        className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 transition-all text-base font-headline py-3 px-0 placeholder:text-secondary/30 rounded-none border-b"
                        placeholder="e.g. Wild Forest Mushroom Risotto"
                        type="text"/>
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-widest text-secondary mb-1.5 group-focus-within:text-primary transition-colors">
                        Chef's Narrative (Description)
                      </label>
                      <textarea
                        {...register("description")}
                        className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all text-sm py-3 px-4 placeholder:text-secondary/30 resize-none"
                        placeholder="Describe the textures, origins, and preparation method..."
                        rows={4}/>
                        {errors.description && (
                          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-secondary mb-1.5">Price Point</label>
                        <div className="relative flex items-center">
                          <span className="absolute left-4 font-headline text-primary text-sm">$</span>
                          <input
                            {...register("price", { valueAsNumber: true })}
                            className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all font-headline text-sm py-2.5 pl-8"
                            placeholder="0.00"
                            type="number"
                            step={0.01}/>
                            {errors.price && (
                              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                            )}
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-[10px] uppercase tracking-widest text-secondary mb-1.5">Internal SKU</label>
                        <input
                          {...register("sku")}
                          className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all py-2.5 px-4 text-sm"
                          placeholder="MEN-001"
                          type="text"/>
                          {errors.sku && (
                            <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
                          )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Nutritional Profile */}
                <section className="space-y-5">
                  <h3 className="font-headline text-base text-primary pb-2 border-b border-outline-variant/20">
                    Nutritional Profile
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest text-secondary">Caloric Count</label>
                      <div className="relative flex items-center">
                        <input
                          {...register("calories", { valueAsNumber: true })}
                          className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all py-2.5 px-4 text-sm"
                          placeholder="450"
                          type="number"/>
                          {errors.calories && (
                            <p className="text-red-500 text-xs mt-1">{errors.calories.message}</p>
                          )}
                        <span className="absolute right-4 text-[10px] text-secondary uppercase">kcal</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest text-secondary">Allergen Registry</label>
                      <div className="flex flex-wrap gap-1.5">
                        {isLoading ? (
                        // Skeleton loaders for allergens
                        Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className="px-2.5 py-1 rounded-full bg-surface-container-high animate-pulse"
                          >
                            <div className="w-12 h-3 rounded bg-outline-variant/30"></div>
                          </div>
                        ))): (
                        allergens.map((a) => (
                          <button
                            type="button"
                            key={a.id}
                            onClick={() => toggleAllergen(a.id)}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                              activeAllergens?.includes(a.id)
                                ? "bg-tertiary-fixed text-on-tertiary-fixed"
                                : "bg-surface-container-high text-secondary hover:bg-primary-fixed"
                            }`}>
                            {a.name}
                          </button>
                        ))) }
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-[9px] font-bold uppercase tracking-wider border border-primary/20 hover:bg-primary/5"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dietary checkboxes */}
                  <div className="bg-surface-container-low/50 p-4 rounded-xl space-y-3">
                    <label className="block text-[10px] uppercase tracking-widest text-secondary">
                      Dietary Accommodations
                    </label>
                    <div className="flex gap-6">
                      {(
                        [
                          { key: "vegan", label: "Vegan" },
                          { key: "vegetarian", label: "Vegetarian" },
                          { key: "glutenFree", label: "Gluten-Free" },
                        ] as const
                      ).map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register(`dietary.${key}`)}
                            className="rounded text-primary focus:ring-primary border-outline-variant"/>
                          <span className="text-xs font-medium text-primary">{label}</span>
                        </label>
                      ))}
                      {errors.dietary && (
                        <p className="text-red-500 text-xs mt-1">Please check dietary selections</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Kitchen Notes */}
                <section className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-secondary">
                    Private Kitchen Notes (Hidden from Menu)
                  </label>
                  <textarea
                    {...register("kitchenNotes")}
                    className="w-full bg-surface-container-low border-transparent focus:bg-surface-container-high focus:ring-0 rounded-xl transition-all text-xs py-3 px-4 placeholder:text-secondary/30 resize-none italic"
                    placeholder="Preparation tips or specific supplier requests..."
                    rows={3}/>
                    {errors.kitchenNotes && (
                      <p className="text-red-500 text-xs mt-1">{errors.kitchenNotes.message}</p>
                    )}
                </section>
              </div>
            </div>
          </div>

          {/* Mobile sticky actions */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl p-3 flex gap-3 border-t border-outline-variant/10 z-50">
            <button className="flex-1 py-3 bg-surface-container-high text-primary font-bold rounded-xl text-xs uppercase tracking-widest">
              Discard
            </button>
            <button className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl text-xs uppercase tracking-widest">
              Save Item
            </button>
          </div>
        </main>
      </form>

      {/* Decorative background gradient */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-screen bg-linear-to-l from-primary-fixed/20 to-transparent pointer-events-none" />
    </div>
  )
}