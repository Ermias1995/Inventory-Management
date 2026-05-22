"use client";

import { useState } from "react";
import { Pencil, Trash2, Package, ArrowUpDown } from "lucide-react";
import { formatPrice, formatDate, getStockStatus } from "@/lib/utils";
import { getOptimizedUrl } from "@/lib/cloudinary";
import type { Item } from "@/types";
import { cn } from "@/lib/utils";

interface ItemTableProps {
  items:    Item[];
  onEdit:   (item: Item) => void;
  onDelete: (item: Item) => void;
}

type SortField = "name" | "category" | "quantity" | "price" | "createdAt";

export default function ItemTable({ items, onEdit, onDelete }: ItemTableProps) {
  const [sortField, setSortField]   = useState<SortField>("createdAt");
  const [sortDir,   setSortDir]     = useState<"asc" | "desc">("desc");

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  const sorted = [...items].sort((a, b) => {
    let valA = a[sortField] as any;
    let valB = b[sortField] as any;
    if (sortField === "price") { valA = Number(valA); valB = Number(valB); }
    if (valA < valB) return sortDir === "asc" ? -1 :  1;
    if (valA > valB) return sortDir === "asc" ?  1 : -1;
    return 0;
  });

  const stockColors = {
    red:    "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
    >
      {label}
      <ArrowUpDown
        size={13}
        className={sortField === field ? "text-indigo-500" : "text-gray-300"}
      />
    </button>
  );

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
          <Package size={32} className="text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          No items yet
        </h3>
        <p className="text-sm text-gray-500">
          Add your first inventory item to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                { field: "name",      label: "Item"      },
                { field: "category",  label: "Category"  },
                { field: "quantity",  label: "Quantity"  },
                { field: "price",     label: "Price"     },
                { field: "createdAt", label: "Added"     },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4"
                >
                  <SortButton field={field as SortField} label={label} />
                </th>
              ))}
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((item) => {
              const stock = getStockStatus(item.quantity);
              return (
                <tr
                  key={item.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  {/* Item */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={getOptimizedUrl(item.imageUrl, 80)}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package size={18} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 pr-4">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                      {item.category}
                    </span>
                  </td>

                  {/* Quantity + stock badge */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium border",
                          stockColors[stock.color as keyof typeof stockColors]
                        )}
                      >
                        {stock.label}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 pr-4 font-semibold text-gray-900">
                    {formatPrice(item.price)}
                  </td>

                  {/* Date */}
                  <td className="py-4 pr-4 text-gray-400 text-xs">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {sorted.map((item) => {
          const stock = getStockStatus(item.quantity);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {item.imageUrl ? (
                  <img
                    src={getOptimizedUrl(item.imageUrl, 80)}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Package size={22} className="text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-xs">
                    {item.category}
                  </span>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium border",
                          stockColors[stock.color as keyof typeof stockColors]
                        )}
                      >
                        {stock.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}