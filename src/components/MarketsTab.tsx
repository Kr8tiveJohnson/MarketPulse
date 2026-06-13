import React, { useState } from 'react';
import { Market, Product, Sale, UserRole } from '../types';
import { MapPin, Plus, Store, Users, ShoppingBag, BarChart3, Lock, AlertCircle, Sparkles } from 'lucide-react';

interface MarketsTabProps {
  role: UserRole;
  markets: Market[];
  products: Product[];
  sales: Sale[];
  onAddMarket: (market: Omit<Market, 'id' | 'staffCount' | 'totalRevenue'>) => void;
}

export default function MarketsTab({ role, markets, products, sales, onAddMarket }: MarketsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    onAddMarket({ name, location });
    setName('');
    setLocation('');
    setShowAddForm(false);
  };

  // Aggregated calculations for each market
  const getMarketStats = (marketId: string) => {
    const marketProducts = products.filter((p) => p.branchId === marketId);
    const totalStock = marketProducts.reduce((sum, p) => sum + p.stock, 0);
    const totalCategories = new Set(marketProducts.map((p) => p.category)).size;

    const marketSales = sales.filter((s) => s.branchId === marketId);
    const totalRevenue = marketSales.reduce((sum, s) => sum + s.totalPrice, 0);

    return { totalStock, totalCategories, totalRevenue };
  };

  // Format currency
  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value).replace('NGN', '₦');
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block font-sans">Location Hub</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">Active Markets & Branches</h2>
          <p className="text-xs text-slate-500 mt-0.5">Maintain, assign, and audit decentralized retail points natively.</p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Register New Market</span>
        </button>
      </div>

      {/* Add Market Drawer/Modal dialog */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-sm w-full p-6 shadow-xl border border-slate-250 relative">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Add New Operational Market Node</h3>
            <p className="text-[11px] text-slate-500 mb-6">Staff and Admin can both add new local outlets to standard lists.</p>

            <form onSubmit={handleSub} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wide text-[10px] font-bold">Market / Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balogun Market, Lagos Island"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-sm px-3 py-2 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wide text-[10px] font-bold">Location Address / Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broad Street, Lagos"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-sm px-3 py-2 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-sm cursor-pointer shadow-sm animate-pulse"
                >
                  Add Market Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.map((m) => {
          const stats = getMarketStats(m.id);
          return (
            <div key={m.id} className="bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group">
              {/* Card Header Banner representing each local market */}
              <div className="bg-slate-900 border-b border-slate-850 py-3 px-5 text-white flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Store size={16} className="text-blue-500" />
                  <span className="font-bold text-[11px] tracking-wide uppercase">Operational Branch</span>
                </div>
                <Sparkles size={12} className="text-blue-400" />
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-850 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{m.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{m.location}</span>
                  </p>
                </div>

                {/* Main Stats block */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 flex items-center gap-2">
                    <ShoppingBag size={14} className="text-blue-650" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold leading-none">Catalog count</span>
                      <span className="text-xs font-bold text-slate-800 font-mono block mt-1">{stats.totalStock} units</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 flex items-center gap-2">
                    <Users size={14} className="text-slate-550" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold leading-none">Staff Node</span>
                      <span className="text-xs font-bold text-slate-800 font-mono block mt-1">{m.id === 'm5' ? '0 active' : '1 representative'}</span>
                    </div>
                  </div>
                </div>

                {/* Revenue display - strict role validation */}
                <div className="pt-4 border-t border-slate-100 font-semibold text-xs">
                  {role === 'Admin' ? (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1 font-semibold">
                        <BarChart3 size={13} className="text-blue-500" /> Total Earnings:
                      </span>
                      <span className="font-bold font-mono text-blue-600 text-sm">{formatNaira(stats.totalRevenue)}</span>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 text-slate-500 rounded-sm flex items-center gap-1.5 text-[11px] font-semibold border border-slate-200">
                      <Lock size={12} className="text-amber-500 flex-shrink-0" />
                      <span>Earnings protected (MarketPulse security clearance)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
