import { X, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { employeeSchema } from "../../Schemas/employee.schema";

const INPUT_CLS =
  "w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 font-body transition-all outline-none";

export default function AddEmployeeModal({
  showModal,
  setShowModal,
  onSuccess,
}: any) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
      title: "",
      phone: "",
      systemAccess: true,
      image: "",
    },
  });

  const systemAccess = watch("systemAccess");
  const imageUrl = watch("image");
  const avatarPreview = imageUrl;

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      reset();
    }
  }, [showModal, reset]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setValue("image", previewUrl);
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data)
  };

  const ROLES = ["Chef", "SousChef", "Waiter", "Cashier", "Manager", "Admin"];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-on-primary-fixed/40 backdrop-blur-md">
      <div className="bg-surface w-full max-w-3xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT */}
        <div className="hidden md:block w-1/3 relative bg-primary-container">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZQ4QkPAKE0UVYCdj0oHH77VjKjIuQvPn7u9VD8EfRBS9PGrjrKYdTubRGQExRN3e30CaWzioK-OqjXyr0N0q7YSWEhj_uSRzxjl057i2hbwYJRDnVUzdm1Vlh_tSyhB38Y5B3orQhgUNsXIdhymKynQP-c3bWhXt8YvL3M_YntMMhX29Qu64nnWmJtzmoZ-iuMRXCk8dZvPpqdKix28Rfj637YBBxbvscb_-IoIlI9tDmDuHP4LT1ecUH4wzg90ylLnTr1mj26T4"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="relative h-full p-6 flex flex-col justify-end text-on-primary">
            <p className="font-headline text-xl italic mb-1">Build the team</p>
            <p className="text-xs opacity-80">
              Adding a new member requires attention to detail.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-4 md:p-6 flex flex-col max-h-[90vh]">
          {/* HEADER */}
          <div className="flex justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-primary">New Employee</h2>
              <p className="text-xs text-on-surface-variant">
                Enter details below
              </p>
            </div>
            <button onClick={() => setShowModal(false)} type="button">
              <X size={18} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 overflow-y-auto pr-1">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-dashed">
                  {avatarPreview ? (
                    <img src={avatarPreview} className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={20} />
                  )}
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleAvatar}
                  accept="image/*"
                />
              </div>
              <div>
                <p className="text-xs font-semibold">Avatar</p>
                <p className="text-[10px] text-on-surface-variant">JPG/PNG or URL</p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Full Name */}
              <div>
                <input
                  {...register("name")}
                  className={INPUT_CLS + " py-2 text-sm"}
                  placeholder="Full Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <select
                  {...register("role")}
                  className={INPUT_CLS + " py-2 text-sm appearance-none pr-8"}
                >
                  <option value="">Select Role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  {...register("email")}
                  className={INPUT_CLS + " py-2 text-sm"}
                  placeholder="Email"
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  {...register("phone")}
                  className={INPUT_CLS + " py-2 text-sm"}
                  placeholder="Phone (optional)"
                />
              </div>

              {/* Job Title */}
              <div className="md:col-span-2">
                <input
                  {...register("title")}
                  className={INPUT_CLS + " py-2 text-sm"}
                  placeholder="Job Title"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <input
                  {...register("image")}
                  className={INPUT_CLS + " py-2 text-sm"}
                  placeholder="Image URL (optional)"
                />
              </div>
            </div>

            {/* System Access Toggle */}
            <div className="flex justify-between bg-surface-container-low p-3 rounded-lg">
              <div>
                <p className="text-xs font-semibold">System Access</p>
              </div>
              <button
                type="button"
                onClick={() => setValue("systemAccess", !systemAccess)}
                className={`w-9 h-4 rounded-full flex items-center px-1 transition-all ${
                  systemAccess ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-3 h-3 bg-white rounded-full transition-all ${
                    systemAccess ? "ml-auto" : ""
                  }`}
                />
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm hover:bg-surface-container-low rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Adding..." : "Add Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}