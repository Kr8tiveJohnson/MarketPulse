import React from 'react';
import { UserRole } from '../types';
import { ShieldX, Lock, ShieldCheck, RefreshCw, Sliders, ToggleLeft, ToggleRight, Info, AlertTriangle } from 'lucide-react';

interface SettingsTabProps {
  role: UserRole;
  onResetData: () => void;
  marketsCount: number;
}

export default function SettingsTab({ role, onResetData, marketsCount }: SettingsTabProps) {
  // Mock states
  const [currencySymbol, setCurrencySymbol] = React.useState('NGN (₦)');
  const [soundAlerts, setSoundAlerts] = React.useState(true);
  const [offlineSync, setOfflineSync] = React.useState(true);

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {role === 'Admin' ? (
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm mb-2 border-b border-slate-100 pb-3 font-sans">
            <Sliders size={18} />
            <span>Master Workspace Configurations (Admin Clearance)</span>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            {/* Setting item list */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-sm border border-slate-200">
              <div>
                <span className="text-slate-800 block text-xs font-bold">Currency Indicator</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Primary currency across financial grids</span>
              </div>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="bg-white border border-slate-200 font-semibold px-2 py-1.5 rounded-sm outline-none cursor-pointer"
              >
                <option value="NGN (₦)">NGN (₦) - Nigerian Naira</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-sm border border-slate-200">
              <div>
                <span className="text-slate-800 block text-xs font-bold">High Priority Sound Alarms</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Trigger audio alert on extreme low stock</span>
              </div>
              <button
                type="button"
                onClick={() => setSoundAlerts(!soundAlerts)}
                className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {soundAlerts ? <ToggleRight size={32} className="text-blue-600" /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-sm border border-slate-200">
              <div>
                <span className="text-slate-800 block text-xs font-bold">Client Sync Tunneling</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Persist application tree state to localStorage</span>
              </div>
              <button
                type="button"
                disabled
                className="text-blue-600 cursor-not-allowed"
              >
                <ToggleRight size={32} />
              </button>
            </div>

            {/* Warning Reset Box */}
            <div className="p-4 rounded-sm bg-red-50 border border-red-105 text-red-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle size={15} className="text-red-700" />
                <span>System Sandbox Control Center</span>
              </div>
              <p className="text-[11px] text-red-700/90 leading-relaxed font-semibold">
                This reset command restores all deleted lists, registers stock figures, tasks, and branch reports to the original June 2026 Balogun & Computer Village seed database.
              </p>
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data back to the default Balogun & Computer Village template? All custom sales will be lost.')) {
                    onResetData();
                  }
                }}
                className="bg-red-600 hover:bg-red-750 text-white font-semibold py-2 px-3 rounded-sm text-[10px] cursor-pointer flex items-center gap-1 transition-colors uppercase tracking-tight"
              >
                <RefreshCw size={12} />
                <span>Reset Application Storage Data</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-[10px] text-slate-400 font-semibold">
              <ShieldCheck size={14} className="text-blue-600" />
              <span>Full compliance with MarketPulse remote monitoring protocol version v4.11</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-sm bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <Lock size={28} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 font-sans">Setting Console Blocked (Staff Security Role)</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
              Staff roles are restricted from accessing system keys, deleting metadata, resetting database pools, or reviewing gross pricing margins of products.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm max-w-md mx-auto text-left text-[11px] text-slate-650 font-semibold space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex items-center gap-1">
              <Info size={12} className="text-blue-600" /> MarketPulse Governance Rules
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-500">
              <li>To access these configurations, request your employer to authorize a login with Admin role permissions.</li>
              <li>Your current credentials are locked securely to your local branch node.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
