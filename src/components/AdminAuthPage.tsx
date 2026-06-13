import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface AdminAuthPageProps {
  onBack: () => void;
  onLoginSuccess: (email: string, role: UserRole, name: string, branchId: string) => void;
}

export default function AdminAuthPage({ onBack, onLoginSuccess }: AdminAuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // Generic Admin login for the demo
    onLoginSuccess(email, 'Admin', email.split('@')[0], 'm1');
  };

  return (
    <div id="admin-auth-page" className="min-h-screen bg-[#2D3148] flex flex-col items-center justify-center font-sans selection:bg-[#FF4F8B] selection:text-white p-4">

      {/* Top back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center text-sm font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} className="mr-1.5" />
        Back to public site
      </button>

      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-8 sm:p-12 relative overflow-hidden">
        {/* Top gradient border accent */}
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ background: 'linear-gradient(to right, #FF7A00, #E53935, #FF4F8B, #00B8D9)' }}
        />

        {/* Brand header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-[#2D3148] w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md">
            <ShieldAlert size={28} className="text-[#F9B000]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2D3148] text-center">
            System Admin
          </h1>
          <p className="text-sm text-[#8A8D99] mt-1 text-center">
            Secure backend access
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-xs text-slate-500 mb-1 block font-bold uppercase tracking-wide" htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="text"
              placeholder="admin@marketpulse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-[#2D3148] bg-transparent px-0 py-2.5 text-sm text-[#2D3148] outline-none transition-colors placeholder:text-slate-300 font-medium"
              required
            />
          </div>

          <div className="relative">
            <label className="text-xs text-slate-500 mb-1 block font-bold uppercase tracking-wide" htmlFor="admin-pass">Security Key</label>
            <div className="relative flex items-center border-b-2 border-gray-200 focus-within:border-[#2D3148] transition-colors">
              <input
                id="admin-pass"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 focus:ring-0 bg-transparent px-0 py-2.5 text-sm text-[#2D3148] outline-none placeholder:text-slate-300 font-medium tracking-widest"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-slate-400 hover:text-[#2D3148] outline-none cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full text-white font-bold rounded-lg py-3.5 transition-all hover:scale-[1.02] active:scale-95 text-sm cursor-pointer shadow-lg tracking-wide uppercase"
              style={{ background: '#2D3148' }}
            >
              Access Backend
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-white/40 text-xs font-mono tracking-widest uppercase">
        MarketPulse Secure Node // Authorized Personnel Only
      </div>
    </div>
  );
}
