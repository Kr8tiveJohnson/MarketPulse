import React, { useState } from 'react';
import { Product, Sale, Market, UserRole } from '../types';
import { Search, ShoppingCart, Plus, CheckCircle, TicketPercent, User, Calendar, CornerDownRight, ShieldCheck, Download } from 'lucide-react';

interface SalesTabProps {
  role: UserRole;
  username: string;
  sales: Sale[];
  products: Product[];
  markets: Market[];
  onRecordSale: (productId: string, quantity: number, recordedBy: string) => void;
}

export default function SalesTab({
  role,
  username,
  sales,
  products,
  markets,
  onRecordSale,
}: SalesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');

  // New Sale states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [sellQty, setSellQty] = useState<number>(1);
  const [showRecordSuccess, setShowRecordSuccess] = useState(false);
  const [lastRecordedSale, setLastRecordedSale] = useState<string>('');

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const maxAvailable = selectedProduct ? selectedProduct.stock : 0;
  const unitPrice = selectedProduct ? selectedProduct.sellingPrice : 0;
  const computedTotal = unitPrice * sellQty;

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || sellQty < 1) return;
    if (sellQty > maxAvailable) {
      alert(`Error: Only ${maxAvailable} units of this product are in stock.`);
      return;
    }

    onRecordSale(selectedProductId, sellQty, username);
    
    // Clear & display success toast
    setLastRecordedSale(`${selectedProduct?.name} (${sellQty} units)`);
    setSelectedProductId('');
    setSellQty(1);
    setShowRecordSuccess(true);
    setTimeout(() => {
      setShowRecordSuccess(false);
    }, 4000);
  };

  // Format Nigerian Naira
  const formatNairaVal = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value).replace('NGN', '₦');
  };

  // Filter lists
  const filteredSales = sales.filter((s) => {
    const product = products.find((p) => p.id === s.productId);
    const category = product?.category || '';
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = s.productName.toLowerCase().includes(searchLower) ||
                          s.recordedBy.toLowerCase().includes(searchLower) ||
                          category.toLowerCase().includes(searchLower);

    const matchesBranch = selectedBranchFilter === 'All' || s.branchId === selectedBranchFilter;
    return matchesSearch && matchesBranch;
  });

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Product', 'Category', 'Branch', 'Quantity', 'Revenue (NGN)', 'Logged By', 'Date'];
    const rows = filteredSales.map(s => {
      const product = products.find(p => p.id === s.productId);
      return [
        s.id,
        `"${s.productName}"`,
        `"${product?.category || 'N/A'}"`,
        `"${s.branchName}"`,
        s.quantity,
        s.totalPrice,
        `"${s.recordedBy}"`,
        `"${new Date(s.date).toLocaleString()}"`
      ].join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marketpulse_sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate sum counts
  const totalQtySold = filteredSales.reduce((sum, s) => sum + s.quantity, 0);
  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Upper Grid Split: Left (Record Sale Form), Right (Summary Stats node) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm mb-2 font-sans">
            <ShoppingCart size={18} />
            <span>Record New Sales Transaction (Branch Office)</span>
          </div>

          {showRecordSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-sm flex items-center gap-2 text-xs">
              <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold">Transaction logged!</span> Stock automatically reduced list for: <span className="underline font-semibold">{lastRecordedSale}</span>.
              </div>
            </div>
          )}

          <form onSubmit={handleSaleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product selector */}
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wide text-[10px] font-bold">Select Active Stock Item</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setSellQty(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-205 text-slate-800 rounded-sm p-2.5 font-semibold cursor-pointer outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose item --</option>
                  {products
                    .filter((p) => p.stock > 0)
                    .map((p) => {
                      const bName = markets.find((m) => m.id === p.branchId)?.name || 'Default';
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.stock} units left at {bName})
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wide text-[10px] font-bold">Quantity (Units)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={maxAvailable || undefined}
                  value={sellQty}
                  onChange={(e) => setSellQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-205 text-slate-800 rounded-sm p-2.5 font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {selectedProduct && (
              <div className="bg-slate-50/80 p-4 rounded-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unit Pricing Metrics</span>
                  <div className="text-slate-850">
                    <span className="font-bold block text-sm">{selectedProduct.name}</span>
                    <span className="text-[11px] text-slate-505 block font-medium">
                      Category: {selectedProduct.category} | Branch Stock left:{' '}
                      <span className="font-bold font-mono text-slate-800">{maxAvailable} units</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Computed Grand Total</span>
                  <span className="text-xl font-bold text-emerald-750 font-mono block">
                    {formatNairaVal(computedTotal)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    ({sellQty} x {formatNairaVal(unitPrice)})
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedProductId}
              className={`w-full font-semibold py-3 px-4 rounded-sm text-xs cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2 ${
                selectedProductId
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Plus size={15} />
              <span>Submit & Lock Transaction Log</span>
            </button>
          </form>
        </div>

        {/* Right Info stats block */}
        <div className="bg-slate-900 text-white p-6 rounded-sm shadow-sm border border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">Branch Audit Check</span>
            <h3 className="text-base font-bold font-sans">Instant Sales Counter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recording transactions immediately reduces available stock counts of the targeted product category to prevent system mismatch.
            </p>
          </div>

          <div className="mt-8 space-y-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total volume logged</span>
              <div className="text-xl font-bold font-mono mt-0.5">{totalQtySold} units sold</div>
            </div>

            {role === 'Admin' ? (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Aggregated sales value</span>
                <div className="text-xl font-bold font-mono mt-0.5 text-blue-450">{formatNairaVal(totalSalesRevenue)}</div>
              </div>
            ) : (
              <div className="p-3 bg-white/5 border border-white/10 rounded-sm flex items-center gap-2 text-[11px] text-slate-300">
                <ShieldCheck size={14} className="text-blue-400 flex-shrink-0" />
                <span>Aggregated branch revenues locked (Admin only)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sales list query & filter search */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Filter by name, category, or personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-205 text-slate-800 placeholder-slate-400 rounded-sm pl-10 pr-4 py-2 text-xs outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="w-full sm:w-48 bg-white border border-slate-205 text-slate-700 text-xs px-3 py-2 rounded-sm cursor-pointer outline-none focus:border-blue-550 font-semibold"
            >
              <option value="All">All Branches</option>
              {markets.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Sales record list table */}
        <div className="rounded-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 font-bold text-slate-450 border-b border-slate-100 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Sales Activity Details</th>
                <th className="py-3 px-3">Branch Location</th>
                <th className="py-3 px-3">Volume Sold</th>
                <th className="py-3 px-3">Sales Revenue</th>
                <th className="py-3 px-4">Logged by / Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700 whitespace-nowrap">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 bg-white">
                    No active transactions match your filters.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 whitespace-normal min-w-[200px]">
                      <div>
                        <span className="font-bold text-slate-850 text-xs block">{s.productName}</span>
                        <span className="text-[10px] text-slate-400">Transaction node ID: {s.id}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-semibold">{s.branchName}</td>
                    
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{s.quantity} units</td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      {formatNairaVal(s.totalPrice)}
                    </td>

                    <td className="py-3 px-4 text-slate-550 font-semibold space-y-0.5 whitespace-normal">
                      <div className="flex items-center space-x-1">
                        <User size={12} className="text-blue-600" />
                        <span className="text-slate-800 text-[11px] font-bold capitalize">{s.recordedBy}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-normal">
                        <Calendar size={11} />
                        <span>{new Date(s.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
