"use client";

import {
  X, Package, Tag, Boxes,
  DollarSign, Calendar, ImageIcon,
} from "lucide-react";
import { formatPrice, formatDate, getStockStatus } from "@/lib/utils";
import { getOptimizedUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import type { Item } from "@/types";

interface ItemDetailModalProps {
  item:    Item | null;
  onClose: () => void;
  onEdit:  (item: Item) => void;
}

export default function ItemDetailModal({
  item,
  onClose,
  onEdit,
}: ItemDetailModalProps) {
  if (!item) return null;

  const stock = getStockStatus(item.quantity);

  const stockColors = {
    red:    "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Package size={16} className="text-indigo-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Item Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5">

          {/* Image */}
          {item.imageUrl ? (
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={getOptimizedUrl(item.imageUrl, 600)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-40 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-2">
              <ImageIcon size={32} className="text-gray-300" />
              <p className="text-xs text-gray-400">No image uploaded</p>
            </div>
          )}

          {/* Name + stock badge */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {item.name}
            </h3>
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border shrink-0",
                stockColors[stock.color as keyof typeof stockColors]
              )}
            >
              {stock.label}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon:  <Tag size={15} className="text-indigo-400" />,
                label: "Category",
                value: item.category,
              },
              {
                icon:  <DollarSign size={15} className="text-emerald-400" />,
                label: "Price",
                value: formatPrice(item.price),
              },
              {
                icon:  <Boxes size={15} className="text-blue-400" />,
                label: "Quantity",
                value: item.quantity,
              },
              {
                icon:  <DollarSign size={15} className="text-purple-400" />,
                label: "Total Value",
                value: formatPrice(Number(item.price) * item.quantity),
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  {icon}
                  <span className="text-xs text-gray-400 font-medium">{label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              Added: {formatDate(item.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              Updated: {formatDate(item.updatedAt)}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(item); }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Edit Item
          </button>
        </div>
      </div>
    </div>
  );
}