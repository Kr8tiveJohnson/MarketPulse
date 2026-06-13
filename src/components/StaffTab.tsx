import React, { useState } from 'react';
import { Staff, Market, UserRole } from '../types';
import { UserPlus, Trash2, Shield, Lock, Award, CheckCircle, Mail, MapPin, BadgeCheck } from 'lucide-react';

interface StaffTabProps {
  role: UserRole;
  staff: Staff[];
  markets: Market[];
  onAddStaff: (employee: Omit<Staff, 'id' | 'tasksCount' | 'salesCount'>) => void;
  onRemoveStaff: (id: string) => void;
}

export default function StaffTab({ role, staff, markets, onAddStaff, onRemoveStaff }: StaffTabProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState(markets[0]?.id || 'm1');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const matchedBranch = markets.find(m => m.id === branchId)?.name || 'Central Headquarter';

    onAddStaff({
      name: name,
      email: email,
      branchId: branchId,
      branchName: matchedBranch,
      status: 'Active',
    });

    setName('');
    setEmail('');
    setShowInviteForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upper header */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-sans">Personnel Node</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">Staff activities & Branch Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Invite, assign local markets, audit operational logs, and set focus workloads.</p>
        </div>

        {role === 'Admin' ? (
          <button
            onClick={() => setShowInviteForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <UserPlus size={15} />
            <span>Invite Staff Member</span>
          </button>
        ) : (
          <div className="p-2 bg-amber-50 rounded-sm text-amber-700 font-semibold text-[10px] flex items-center gap-1 border border-amber-140">
            <Lock size={12} />
            <span>Management Restricted to Admins</span>
          </div>
        )}
      </div>

      {role === 'Staff' && (
        <div className="p-4 bg-blue-50/50 text-blue-905 rounded-sm flex items-start gap-2 text-xs border border-blue-100 leading-relaxed mb-4">
          <Shield size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-blue-750">MarketPulse-style Directory view (Read Only mode):</span>
            <span>You have access to view branch colleagues to coordinate shifts, but you are not permitted to add/remove users or review secret rating multipliers.</span>
          </div>
        </div>
      )}

      {/* Invite Member Drawer backdrop */}
      {showInviteForm && role === 'Admin' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-sm w-full p-6 shadow-xl border border-slate-250 relative">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Invite Staff Workspace</h3>
            <p className="text-[11px] text-slate-505 mb-6 font-medium">Staff members will receive local logins matching this email name instantly.</p>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wide text-[10px] font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joy Alao"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-202 text-slate-800 rounded-sm px-3 py-2 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wide text-[10px] font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="joy@marketpulse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-202 text-slate-800 rounded-sm px-3 py-2 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wide text-[10px] font-bold">Assigned Active Branch</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-202 text-slate-800 rounded-sm px-2.5 py-2 outline-none cursor-pointer"
                >
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-sm cursor-pointer shadow-sm animate-pulse"
                >
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff members Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staff.map((employee) => (
          <div key={employee.id} className="bg-white p-5 rounded-sm border border-slate-200/80 shadow-xs flex items-start gap-4 hover:border-blue-300 transition-colors relative group">
            <div className="w-12 h-12 rounded-sm bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center capitalize text-base border border-slate-200 flex-shrink-0 font-sans">
              {employee.name.charAt(0)}
            </div>

            <div className="flex-1 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-850 capitalize flex items-center gap-1 font-sans">
                  {employee.name}
                  {employee.salesCount > 100 && <BadgeCheck size={14} className="text-blue-600 inline" />}
                </h4>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                  employee.status === 'Active' ? 'bg-blue-50 text-blue-700 border border-blue-105 font-semibold' : 'bg-slate-100 text-slate-500'
                }`}>
                  {employee.status}
                </span>
              </div>

              <p className="flex items-center gap-1 font-medium font-mono text-[11px] text-slate-450">
                <Mail size={12} className="text-slate-400" />
                <span>{employee.email}</span>
              </p>

              <p className="flex items-center gap-1 font-semibold text-slate-700">
                <MapPin size={12} className="text-blue-600" />
                <span>Assigned: {employee.branchName}</span>
              </p>

              {/* Performance / Workload metrics */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[10px]">
                <div className="p-2 bg-slate-50 rounded-sm border border-slate-200">
                  <span className="text-slate-400 uppercase block font-semibold">Workload Done</span>
                  <span className="text-slate-850 font-bold font-mono block mt-0.5">{employee.salesCount} Sales Logged</span>
                </div>

                <div className="p-2 bg-slate-50 rounded-sm border border-slate-200">
                  <span className="text-slate-400 uppercase block flex items-center gap-0.5 font-semibold"><Award size={10} className="text-amber-500" /> Rating</span>
                  <span className="text-slate-850 font-bold block mt-0.5">
                    {employee.salesCount > 150 ? '⭐⭐⭐⭐⭐ Excellent' : '⭐⭐⭐⭐ Good'}
                  </span>
                </div>
              </div>
            </div>

            {/* Remove personnel - ONLY ADMIN! */}
            {role === 'Admin' && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${employee.name}?`)) {
                    onRemoveStaff(employee.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 text-red-650 hover:bg-red-50 p-1.5 rounded-sm cursor-pointer"
                title="Remove staff"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
