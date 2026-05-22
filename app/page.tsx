"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Package, DollarSign, AlertTriangle, BarChart3, Download, Info } from "lucide-react";
import Modal         from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast         from "@/components/ui/Toast";
import ItemForm      from "@/components/ItemForm";
import ItemTable     from "@/components/ItemTable";
import AboutModal from "@/components/AboutModal";
import { formatPrice } from "@/lib/utils";
import type { Item, ItemFormValues } from "@/types";

type ToastState = { message: string; type: "success" | "error" } | null;

export default function HomePage() {
  const [items,       setItems]       = useState<Item[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [toast,       setToast]       = useState<ToastState>(null);

  // Modal state
  const [showForm,    setShowForm]    = useState(false);
  const [editItem,    setEditItem]    = useState<Item | null>(null);
  const [deleteItem,  setDeleteItem]  = useState<Item | null>(null);
  const [showAbout, setShowAbout] = useState(false);

    // Export
  function exportCSV() {
    const headers = ["ID", "Name", "Description", "Category", "Quantity", "Price", "Created At"];
    const rows    = items.map((i) => [
      i.id, i.name, i.description, i.category,
      i.quantity, i.price, new Date(i.createdAt).toLocaleDateString(),
    ]);
    const csv  = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `inventory-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported successfully!", "success");
  }

  // Fetch all items
  const fetchItems = useCallback(async () => {
    try {
      const res  = await fetch("/api/items");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {
      showToast("Failed to load items", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Toast helper
  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
  }

  // Create
  async function handleCreate(values: ItemFormValues) {
    setSubmitting(true);
    try {
      const res  = await fetch("/api/items", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setItems((prev) => [json.data, ...prev]);
      setShowForm(false);
      showToast("Item added successfully!", "success");
    } catch {
      showToast("Failed to add item", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Update
  async function handleUpdate(values: ItemFormValues) {
    if (!editItem) return;
    setSubmitting(true);
    try {
      const res  = await fetch(`/api/items/${editItem.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setItems((prev) =>
        prev.map((i) => (i.id === editItem.id ? json.data : i))
      );
      setEditItem(null);
      showToast("Item updated successfully!", "success");
    } catch {
      showToast("Failed to update item", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Delete
  async function handleDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const res  = await fetch(`/api/items/${deleteItem.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
      setDeleteItem(null);
      showToast("Item deleted successfully!", "success");
    } catch {
      showToast("Failed to delete item", "error");
    } finally {
      setDeleting(false);
    }
  }

  // Filter + search 
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered = items.filter((item) => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    return matchSearch && matchCategory;
  });

  // Stats
  const totalValue  = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const lowStock    = items.filter((i) => i.quantity > 0 && i.quantity <= 5).length;
  const outOfStock  = items.filter((i) => i.quantity === 0).length;

  // Render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-none">
                  Inventory
                </h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Info size={15} />
                <span className="hidden sm:inline">About</span>
              </button>
              <button
                onClick={exportCSV}
                disabled={items.length === 0}
                className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <Download size={15} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Items",
              value: items.length,
              icon:  <Package size={20} />,
              color: "indigo",
            },
            {
              label: "Total Value",
              value: formatPrice(totalValue),
              icon:  <DollarSign size={20} />,
              color: "emerald",
            },
            {
              label: "Low Stock",
              value: lowStock,
              icon:  <AlertTriangle size={20} />,
              color: "yellow",
            },
            {
              label: "Out of Stock",
              value: outOfStock,
              icon:  <BarChart3 size={20} />,
              color: "red",
            },
          ].map(({ label, value, icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3
                  ${color === "indigo" ? "bg-indigo-50 text-indigo-600" : ""}
                  ${color === "emerald" ? "bg-emerald-50 text-emerald-600" : ""}
                  ${color === "yellow" ? "bg-yellow-50 text-yellow-600" : ""}
                  ${color === "red" ? "bg-red-50 text-red-600" : ""}
                `}
              >
                {icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Search + filter ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => {
              const count = cat === "All"
                ? items.length
                : items.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    category === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-normal ${
                    category === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">{filtered.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-gray-900">{items.length}</span>
              {" "}items
            </p>
          </div>
          <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ItemTable
              items={filtered}
              onEdit={(item) => setEditItem(item)}
              onDelete={(item) => setDeleteItem(item)}
            />
          )}
        </div>
        </div>
      </main>

      {/* ── Add modal ── */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Item"
        size="lg"
      >
        <ItemForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={submitting}
        />
      </Modal>

      {/* ── Edit modal ── */}
      <Modal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Item"
        size="lg"
      >
        {editItem && (
          <ItemForm
            initialData={editItem}
            onSubmit={handleUpdate}
            onCancel={() => setEditItem(null)}
            isLoading={submitting}
          />
        )}
      </Modal>

      {/* ── Delete confirm ── */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
        isLoading={deleting}
      />

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)}/>
    </div>
  );
}