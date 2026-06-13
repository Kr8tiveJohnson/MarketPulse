import React, { useState } from 'react';
import { Product, Market, UserRole } from '../types';
import { Search, PlusCircle, PenSquare, Trash2, ArrowUpDown, Filter, Lock, Check, TriangleAlert, RefreshCw, Download } from 'lucide-react';

interface InventoryTabProps {
  role: UserRole;
  products: Product[];
  markets: Market[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updated: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function InventoryTab({
  role,
  products,
  markets,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: InventoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMatchBranch, setSelectedMatchBranch] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'Low'>('All');

  // Input States for Add Product Modal / Drawer
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Beverages');
  const [newStock, setNewStock] = useState<number>(100);
  const [newMinStock, setNewMinStock] = useState<number>(20);
  const [newPurchasePaid, setNewPurchasePaid] = useState<number>(3000);
  const [newSellingPrice, setNewSellingPrice] = useState<number>(4500);
  const [newBranch, setNewBranch] = useState(markets[0]?.id || 'm1');

  // Input states for Quick Stock update inline
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [quickStockVal, setQuickStockVal] = useState<number>(0);

  // Categories list
  const categoriesList = ['Beverages', 'Foods', 'Toiletries', 'Electronics', 'Appliances'];

  const getBranchName = (branchId: string) => {
    return markets.find((m) => m.id === branchId)?.name || 'Central Warehouse';
  };

  // Filter items
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesBranch = selectedMatchBranch === 'All' || p.branchId === selectedMatchBranch;
    const isLowStock = p.stock <= p.minStock;
    const matchesStock = stockStatusFilter === 'All' || (stockStatusFilter === 'Low' && isLowStock);

    return matchesSearch && matchesCategory && matchesBranch && matchesStock;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddProduct({
      name: newName,
      category: newCat,
      stock: Number(newStock),
      minStock: Number(newMinStock),
      purchasePrice: Number(newPurchasePaid),
      sellingPrice: Number(newSellingPrice),
      branchId: newBranch,
    });

    // Reset Form
    setNewName('');
    setShowAddForm(false);
  };

  const handleQuickStockSave = (id: string) => {
    onUpdateProduct(id, { stock: quickStockVal });
    setEditingStockId(null);
  };

  const handleExportCSV = () => {
    const headers = ['Product ID', 'Name', 'Category', 'Branch', 'Stock Units', 'Min Stock', 'Purchase Price (NGN)', 'Selling Price (NGN)'];
    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.name}"`,
      `"${p.category}"`,
      `"${getBranchName(p.branchId)}"`,
      p.stock,
      p.minStock,
      p.purchasePrice,
      p.sellingPrice
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marketpulse_inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search and interactive query selectors */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search product name, category, or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-sm pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Stock category selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-sm cursor-pointer outline-none focus:border-blue-500 font-semibold"
            >
              <option value="All">All Categories</option>
              {categoriesList.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Branch selector */}
            <select
              value={selectedMatchBranch}
              onChange={(e) => setSelectedMatchBranch(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-2.5 rounded-sm cursor-pointer outline-none focus:border-blue-500 font-semibold"
            >
              <option value="All">All Branches</option>
              {markets.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* Low stock alert flag */}
            <button
              onClick={() => setStockStatusFilter(stockStatusFilter === 'All' ? 'Low' : 'All')}
              className={`text-xs px-3 py-2.5 rounded-sm font-semibold flex items-center gap-1 cursor-pointer border transition-all ${
                stockStatusFilter === 'Low'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-355'
              }`}
            >
              <TriangleAlert size={14} />
              <span>Low Stock Alerts</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>Export Data</span>
            </button>

            {/* Big Action to spawn add product drawer */}
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-sm ml-auto md:ml-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle size={15} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Dialog Backdrop */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-6 shadow-xl border border-slate-250 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Product to Inventory Node</h3>
            <p className="text-xs text-slate-500 mb-6">Staff and Admins can both register goods categories. All entries sync to live dashboards.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1.5 uppercase tracking-wide text-[10px] font-bold">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milo Giant Pack 1kg"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 font-medium text-slate-800 outline-none focus:border-blue-550"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1.5 uppercase tracking-wide text-[10px] font-bold">Category</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-2 font-medium text-slate-800 outline-none"
                  >
                    {categoriesList.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 uppercase tracking-wide text-[10px] font-bold">Assigned Branch</label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-2 font-medium text-slate-800 outline-none"
                  >
                    {markets.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1.5 uppercase tracking-wide text-[10px] font-bold">Stock Amount</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="120"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 font-medium text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase tracking-wide text-[10px] font-bold">Min Stock Warning Level</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="20"
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1.5 uppercase tracking-wide text-[10px] font-bold">Purchase Price (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPurchasePaid}
                    onChange={(e) => setNewPurchasePaid(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 font-medium text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase tracking-wide text-[10px] font-bold">Selling Price (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={newSellingPrice}
                    onChange={(e) => setNewSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-650 font-semibold py-2.5 rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-sm cursor-pointer shadow-sm"
                >
                  Register Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid/Table list */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 font-bold text-slate-450 border-b border-slate-200 text-[10px] uppercase tracking-wider">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-3">Location Branch</th>
                <th className="py-4 px-3">Stock Units</th>
                <th className="py-4 px-3">Selling Price</th>
                {role === 'Admin' && <th className="py-4 px-3">Cost Price (Admin)</th>}
                <th className="py-4 px-6 text-center">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium whitespace-nowrap">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={role === 'Admin' ? 6 : 5} className="py-12 text-center text-slate-400 font-semibold bg-white">
                    No items match the filters. Try adjusting categories or search query.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Category */}
                      <td className="py-4 px-6 whitespace-normal min-w-[200px]">
                        <div>
                          <span className="font-bold text-slate-850 text-sm block">{p.name}</span>
                          <span className="inline-block mt-1 bg-slate-100 text-slate-500 font-bold text-[9px] px-1.5 py-0.5 rounded-sm uppercase">
                            {p.category}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-3 text-slate-600 font-semibold">
                        <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-sm text-[11px]">
                          {getBranchName(p.branchId)}
                        </span>
                      </td>

                      {/* Stock units & threshold warning */}
                      <td className="py-4 px-3">
                        {editingStockId === p.id ? (
                          <div className="flex items-center space-x-1.5 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              value={quickStockVal}
                              onChange={(e) => setQuickStockVal(Number(e.target.value))}
                              className="w-16 bg-slate-100 border border-slate-200 rounded-sm px-1.5 py-1 text-xs outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => handleQuickStockSave(p.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-sm cursor-pointer"
                              title="Save Stock Amount"
                            >
                              <Check size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className={`text-sm font-bold font-mono ${isLow ? 'text-red-600 font-black' : 'text-slate-900'}`}>
                              {p.stock} units
                            </span>
                            {isLow && (
                              <span className="text-[10px] text-red-500 font-semibold flex items-center gap-0.5 animate-pulse">
                                <TriangleAlert size={10} /> Restock (min {p.minStock})
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Selling Price */}
                      <td className="py-4 px-3 text-emerald-700 font-bold font-mono">
                        {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(p.sellingPrice).replace('NGN', '₦')}
                      </td>

                      {/* Cost price - ADMIN ONLY restriction! (MarketPulse compliance) */}
                      {role === 'Admin' && (
                        <td className="py-4 px-3 text-slate-500 font-semibold font-mono">
                          {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(p.purchasePrice).replace('NGN', '₦')}
                        </td>
                      )}

                      {/* Actions */}
                      <td className="py-4 px-1 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Stock quick edit button */}
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setQuickStockVal(p.stock);
                            }}
                            className="p-1 px-2.5 font-semibold rounded-sm bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors text-[10px]"
                          >
                            <RefreshCw size={11} className="text-blue-600" />
                            <span>Quick Set</span>
                          </button>

                          {/* Delete Action - ADMIN ONLY restricted! */}
                          {role === 'Admin' ? (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-sm bg-red-50 hover:bg-red-105 text-red-600 cursor-pointer transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          ) : (
                            <span 
                              className="text-[9px] text-slate-400 flex items-center gap-0.5 bg-slate-50 border border-slate-100 px-1.5 py-1 rounded-sm"
                              title="Deletion commands restricted for Staff users"
                            >
                              <Lock size={10} className="text-amber-500" />
                              <span>Restricted</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
