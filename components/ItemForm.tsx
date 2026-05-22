"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/cloudinary";
import type { ItemFormValues, Item } from "@/types";

const CATEGORIES = [
  "Electronics", "Clothing", "Food & Beverage",
  "Furniture", "Tools", "Office Supplies", "Other",
];

interface ItemFormProps {
  initialData?: Item;
  onSubmit:     (values: ItemFormValues) => Promise<void>;
  onCancel:     () => void;
  isLoading:    boolean;
}

export default function ItemForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ItemFormProps) {
  const isEditing = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ItemFormValues>({
    name:           initialData?.name          ?? "",
    description:    initialData?.description   ?? "",
    category:       initialData?.category      ?? "",
    quantity:       initialData?.quantity      ?? 0,
    price:          Number(initialData?.price ?? 0),
    imageUrl:       initialData?.imageUrl      ?? undefined,
    imagePublicId:  initialData?.imagePublicId ?? undefined,
  });

  const [imagePreview, setImagePreview]   = useState<string | null>(
    initialData?.imageUrl ?? null
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors]               = useState<Partial<ItemFormValues>>({});

  // Field change
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target as HTMLInputElement;
  setForm((prev) => ({
    ...prev, [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
  }));
  setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // Image upload
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      const { url, publicId } = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url, imagePublicId: publicId }));
    } catch {
      setImagePreview(null);
      setErrors((prev) => ({ ...prev, imageUrl: "Image upload failed" as any }));
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImage() {
    setImagePreview(null);
    setForm((prev) => ({ ...prev, imageUrl: undefined, imagePublicId: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Validation
  function validate(): boolean {
    const newErrors: Partial<Record<keyof ItemFormValues, string>> = {};
    if (!form.name.trim())     newErrors.name     = "Name is required";
    if (!form.category)        newErrors.category = "Category is required";
    if (!form.price || form.price <= 0)
                               newErrors.price    = "Valid price is required";
    if (form.quantity < 0)     newErrors.quantity = "Quantity cannot be negative";
    setErrors(newErrors as any);
    return Object.keys(newErrors).length === 0;
  }

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
  }

  // Input style helper
  const inputClass = (field: keyof ItemFormValues) =>
    cn(
      "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900",
      "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
      "placeholder:text-gray-400 transition-colors",
      errors[field] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>

        {imagePreview ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="text-white animate-spin" size={24} />
              </div>
            )}
            {!uploadingImage && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <X size={14} className="text-gray-600" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full h-36 rounded-xl border-2 border-dashed border-gray-200",
              "flex flex-col items-center justify-center gap-2",
              "hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors cursor-pointer"
            )}
          >
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload image</span>
            <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Item Name <span className="text-red-400">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. MacBook Pro 14"
          className={inputClass("name")}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief description of the item..."
          rows={3}
          className={cn(inputClass("description"), "resize-none")}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass("category")}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-500">{errors.category}</p>
        )}
      </div>

      {/* Price + Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Price ($) <span className="text-red-400">*</span>
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price === 0 ? "" : form.price}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass("price")}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Quantity <span className="text-red-400">*</span>
          </label>
          <input
            name="quantity"
            type="number"
            min="0"
            value={form.quantity === 0 ? "" : form.quantity}
            onChange={handleChange}
            placeholder="0"
            className={inputClass("quantity")}
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || uploadingImage}
          className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Update Item" : "Add Item"}
        </button>
      </div>
    </form>
  );
}