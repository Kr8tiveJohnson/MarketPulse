import React from 'react';
import { Product, Sale, Market, Staff, Activity, Task, UserRole } from '../types';
import { DollarSign, ShieldAlert, Package, Users, MapPin, TrendingUp, BellRing, CornerDownRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface OverviewTabProps {
  role: UserRole;
  username: string;
  products: Product[];
  sales: Sale[];
  markets: Market[];
  staff: Staff[];
  activities: Activity[];
  tasks: Task[];
  onNavigateToTab: (tab: string) => void;
  onRecordSaleClick: () => void;
}

export default function OverviewTab({
  role,
  username,
  products,
  sales,
  markets,
  staff,
  activities,
  tasks,
  onNavigateToTab,
  onRecordSaleClick,
}: OverviewTabProps) {
  // Calculated metrics
  const totalProductsCount = products.reduce((acc, p) => acc + p.stock, 0);
  const totalSalesCount = sales.reduce((acc, s) => acc + s.quantity, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const staffTasks = tasks.filter((t) => t.status === 'Pending');

  // Admin exclusive values
  const totalRevenueVal = sales.reduce((acc, s) => acc + s.totalPrice, 0);
  const totalGoodsWorthVal = products.reduce((acc, p) => acc + p.stock * p.purchasePrice, 0);

  // Staff specific values
  const staffSales = sales.filter((s) => s.recordedBy.toLowerCase() === username.toLowerCase());
  const staffSalesCount = staffSales.reduce((acc, s) => acc + s.quantity, 0);
  const staffSalesRevenue = staffSales.reduce((acc, s) => acc + s.totalPrice, 0);
  const staffPendingTasks = tasks.filter((t) => t.status === 'Pending' && t.staffId === 's1'); // demo default staff is s1 abraham

  // Format Nigerian Naira
  const formatNaira = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace('NGN', '₦');
  };

  // SVG Chart Calculation (Category counts for Stock illustration)
  const categoriesList = ['Beverages', 'Foods', 'Toiletries', 'Electronics', 'Appliances'];
  const categoryStockData = categoriesList.map((cat) => {
    const totalStock = products
      .filter((p) => p.category === cat)
      .reduce((sum, p) => sum + p.stock, 0);
    return { name: cat, stock: totalStock };
  });
  const maxStockVal = Math.max(...categoryStockData.map((c) => c.stock), 200);

  // 7-day sales trend data computation
  const sevenDayData = (() => {
    const today = new Date();
    const days: { label: string; date: string; revenue: number; units: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        label: d.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' }),
        date: dateStr,
        revenue: 0,
        units: 0,
      });
    }
    sales.forEach((s) => {
      const saleDate = s.date.split('T')[0];
      const dayEntry = days.find((d) => d.date === saleDate);
      if (dayEntry) {
        dayEntry.revenue += s.totalPrice;
        dayEntry.units += s.quantity;
      }
    });
    return days;
  })();

  const formatNairaShort = (value: number) => {
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
    return `₦${value}`;
  };

  // Custom recharts tooltip
  const SalesChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs rounded-sm px-3 py-2.5 shadow-xl border border-slate-700">
          <p className="font-bold text-slate-300 mb-1.5">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-bold font-mono">
                {entry.dataKey === 'revenue' ? formatNairaShort(entry.value) : `${entry.value} units`}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Command Center</span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-1 flex items-center gap-2">
            Hello, {username || 'abraham jesuwanu'}{' '}
            <span className="text-xl animate-bounce duration-1000">👋</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overviewing real-time enterprise performance across your retail network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'Staff' ? (
            <button
              onClick={onRecordSaleClick}
              className="bg-blue-600 hover:bg-blue-705 text-white font-semibold text-xs px-4 py-2.5 rounded-sm transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <DollarSign size={14} />
              <span>Record Sales Log</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateToTab('staff')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-sm transition-colors cursor-pointer shadow-sm"
            >
              + Enrol Staff Member
            </button>
          )}

          <button
            onClick={() => onNavigateToTab('reports')}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Reports Feed</span>
          </button>
        </div>
      </div>

      {/* Overview Cards Panel Grid - Styled strictly off Figma layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue (Admin) / Your Revenue (Staff) */}
        {role === 'Admin' ? (
          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue (Gross)</span>
              <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                {formatNaira(totalRevenueVal)}
              </div>
              <span className="text-[10px] text-green-500 font-bold bg-green-50 px-1.5 py-0.5 rounded-sm inline-flex items-center gap-0.5">
                <TrendingUp size={12} /> +18.2% vs last mo
              </span>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-sm">
              <DollarSign size={18} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Sales Recorded</span>
              <div className="text-2xl font-black text-blue-600 tracking-tight font-mono">
                {formatNaira(staffSalesRevenue)}
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                {staffSales.length} individual transactions logged
              </span>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-sm border border-blue-100">
              <DollarSign size={18} />
            </div>
          </div>
        )}

        {/* Card 2: Stock Units */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Products</span>
            <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
              {totalProductsCount.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-550 font-bold bg-slate-50 px-1.5 py-0.5 rounded-sm block">
              Across {products.length} catalog items
            </span>
          </div>
          <div className="bg-slate-100 text-slate-700 p-2.5 rounded-sm">
            <Package size={18} />
          </div>
        </div>

        {/* Card 3: Total Sales Unit Volume (Staff) / Total Worth Left (Admin-only check!) */}
        {role === 'Admin' ? (
          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Worth Left (Cost Value)</span>
              <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                {formatNaira(totalGoodsWorthVal)}
              </div>
              <span className="text-[10px] text-blue-600 bg-blue-50 font-bold px-1.5 py-0.5 rounded-sm block">
                Estimated liquid asset
              </span>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-sm border border-blue-100">
              <DollarSign size={18} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales Volume</span>
              <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                {totalSalesCount} <span className="text-xs text-slate-400">units</span>
              </div>
              <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-1.5 py-0.5 rounded-sm inline-flex items-center gap-0.5">
                <TrendingUp size={12} /> Across 5 markets
              </span>
            </div>
            <div className="bg-slate-100 text-slate-700 p-2.5 rounded-sm">
              <Package size={18} />
            </div>
          </div>
        )}

        {/* Card 4: Low Stock Warnings */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Low Stock Alerts</span>
            <div className={`text-2xl font-black tracking-tight font-mono ${lowStockCount > 0 ? 'text-red-650' : 'text-slate-800'}`}>
              {lowStockCount}
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm block ${lowStockCount > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
              }`}>
              {lowStockCount > 0 ? `${lowStockCount} items require action` : 'All healthy stock margins'}
            </span>
          </div>
          <div className={`p-2.5 rounded-sm ${lowStockCount > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
            <ShieldAlert size={18} />
          </div>
        </div>
      </div>

      {/* Two secondary metrics cards matching the specs requirement list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Locations Info */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-sm border border-blue-100">
            <MapPin size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Active Markets & Branches</span>
            <span className="text-lg font-black text-slate-850 font-mono">{markets.length} Local Node Pools</span>
            <span className="text-xs text-slate-500 block mt-0.5">Balogun, Computer Village, Alaba Int'l, Wuse Abuja, Mile 12...</span>
          </div>
        </div>

        {/* Staff/Tasks stats */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-slate-100 text-slate-700 rounded-sm border border-slate-200">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Management Accountability</span>
            <span className="text-lg font-black text-slate-850 font-mono">
              {role === 'Admin' ? `${staff.length} Active Staff members` : `${staffPendingTasks.length} Pending Tasks Assigned`}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              {role === 'Admin' ? 'Overseeing remote operations & sales charts' : 'Verify assigned checklists in Reports node'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Timeline Sections Panel splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Beautiful Stock Categories Distribution Chart (matches user mockup!) */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Branch Performance & Stock</h3>
              <p className="text-[11px] text-slate-400">Total volume count currently stored inside warehouses</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-tight text-slate-450">Live inventory</span>
          </div>

          <div className="space-y-4 pt-2">
            {categoryStockData.map((cat, idx) => {
              const widthPercentage = Math.max((cat.stock / maxStockVal) * 100, 6);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                    <span className="font-mono text-slate-900 font-bold bg-slate-100 px-1.5 py-0.5 rounded-sm">{cat.stock} items</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-blue-600 hover:bg-blue-700 transition-all rounded-sm"
                      style={{ width: `${widthPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick stock disclaimer banner */}
          <div className="mt-8 p-3.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-sm flex items-start gap-2.5 text-xs">
            <ShieldAlert size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">MarketPulse-style remote safety check:</span>
              <span className="text-[11px] text-amber-700/90">Critical categories with stock numbers near minimum threshold require active re-shelving. Please submit stock update reports promptly.</span>
            </div>
          </div>
        </div>

        {/* Right side: 7-Day Sales Trend Chart + Activity Feed */}
        <div className="flex flex-col gap-6">

          {/* 7-Day Sales Performance Line Chart */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Sales Performance Trends</h3>
                <p className="text-[11px] text-slate-400">Revenue &amp; unit volume over the last 7 days</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-tight text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm">
                <TrendingUp size={11} /> 7-Day View
              </span>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sevenDayData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  yAxisId="revenue"
                  orientation="left"
                  tickFormatter={formatNairaShort}
                  tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={46}
                />
                <YAxis
                  yAxisId="units"
                  orientation="right"
                  tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip content={<SalesChartTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingTop: '10px' }}
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#2563eb', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#1d4ed8' }}
                />
                <Line
                  yAxisId="units"
                  type="monotone"
                  dataKey="units"
                  name="Units Sold"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Staff Activities Feed */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Staff Activities</h3>
                <p className="text-[11px] text-slate-400">Real-time remote monitor on staff logs</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-sm border border-blue-100 uppercase tracking-wider">Live Feed</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No recent branch activity logged yet.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex gap-3 text-xs items-start border-b border-slate-100 pb-3">
                    <div className={`p-1.5 rounded-sm mt-0.5 flex-shrink-0 ${act.role === 'Admin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-700'
                      }`}>
                      {act.role === 'Admin' ? <BellRing size={13} /> : <CornerDownRight size={13} />}
                    </div>

                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-extrabold text-slate-800 uppercase tracking-tight truncate">{act.username} ({act.role})</span>
                        <span className="text-slate-400 font-mono flex-shrink-0 ml-2">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="font-semibold text-slate-700 leading-snug">{act.action}</p>
                      <p className="text-[11px] text-slate-500 truncate">{act.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
