import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';

interface AuthPageProps {
  initialAction?: 'signin' | 'signup';
  onBack: () => void;
  onLoginSuccess: (user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    branchId: string;
    token?: string;
  }, newMarketData?: { name: string; location: string }) => void;
  markets: { id: string; name: string }[];
  staffList: { name: string; email: string; branchId: string; branchName: string }[];
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || (import.meta.env?.PROD ? '/api' : 'http://localhost:5000/api');

export default function AuthPage({ initialAction = 'signin', onBack, onLoginSuccess, markets, staffList }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialAction);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');
  const [branchId, setBranchId] = useState(markets[0]?.id || 'm1');
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchLocation, setNewBranchLocation] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google Onboarding State
  const [isGoogleOnboarding, setIsGoogleOnboarding] = useState(false);
  const [googleData, setGoogleData] = useState<{name: string, email: string} | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please specify both email and password.');
      return;
    }

    setIsLoading(true);

    if (activeTab === 'signin') {
      // ── SIGN IN: hit the real /login endpoint ──────────────────────────────
      try {
        const res = await fetch(`${API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || 'Invalid email or password.');
          setIsLoading(false);
          return;
        }

        // data = { id, name, email, role, branchId, token }
        onLoginSuccess(data);
      } catch (err) {
        setErrorMsg('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }

    } else {
      // ── SIGN UP: validate then hit /register ────────────────────────────────
      if (!name) {
        setErrorMsg('Full Name is required for Registration.');
        setIsLoading(false);
        return;
      }

      if (role === 'Admin' && (!newBranchName || !newBranchLocation)) {
        setErrorMsg('Please provide your Business Name and Location.');
        setIsLoading(false);
        return;
      }

      const finalBranchId = role === 'Staff' ? branchId : 'new-branch';

      try {
        const res = await fetch(`${API_BASE_URL}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role, branchId: finalBranchId }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || 'Registration failed. Please try again.');
          setIsLoading(false);
          return;
        }

        setSuccessMsg('Account created! Logging you in…');

        // data = { id, name, email, role, branchId, token }
        setTimeout(() => {
          if (role === 'Admin') {
            onLoginSuccess(data, { name: newBranchName, location: newBranchLocation });
          } else {
            onLoginSuccess(data);
          }
        }, 700);

      } catch (err) {
        setErrorMsg('Network error. Please check your connection and try again.');
        setIsLoading(false);
      }
    }
  };

  const handleMockGoogleLogin = () => {
    // Simulate getting data from Google
    const gEmail = 'hello.alex@gmail.com';
    const gName = 'Alex From Google';

    // Check if user exists in staffList (quick local check)
    const existingUser = staffList.find(s => s.email.toLowerCase() === gEmail.toLowerCase());
    
    if (existingUser) {
      // Automatic Login via backend
      fetch(`${API_BASE_URL}/users/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gEmail, name: gName }),
      })
        .then(r => r.json())
        .then(data => onLoginSuccess(data))
        .catch(() => setErrorMsg('Google login failed.'));
    } else {
      // Trigger Onboarding
      setGoogleData({ name: gName, email: gEmail });
      setIsGoogleOnboarding(true);
      setActiveTab('signup');
    }
  };

  const submitGoogleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleData) return;
    
    if (role === 'Admin' && (!newBranchName || !newBranchLocation)) {
      setErrorMsg('Please provide your Business Name and Location.');
      return;
    }

    setIsLoading(true);

    try {
      const finalBranchId = role === 'Staff' ? branchId : 'new-branch';
      const res = await fetch(`${API_BASE_URL}/users/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: googleData.email, name: googleData.name, role, branchId: finalBranchId, isSignup: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Google sign-up failed.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Google account linked! Logging you in…');
      setTimeout(() => {
        if (role === 'Admin') {
          onLoginSuccess(data, { name: newBranchName, location: newBranchLocation });
        } else {
          onLoginSuccess(data);
        }
      }, 700);
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-page" className="min-h-screen bg-white flex font-sans selection:bg-slate-900 selection:text-white p-4 sm:p-6">

      {/* Left Panel - Brand Graphic */}
      <div className="hidden lg:flex w-1/2 relative rounded-[2rem] overflow-hidden bg-[#2D3148] items-center justify-center shadow-lg">
        {/* Colorful Gradient Mesh */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: `
              radial-gradient(circle at 0% 0%, #F9B000 0%, transparent 50%),
              radial-gradient(circle at 100% 0%, #00B8D9 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, #E53935 0%, transparent 50%),
              radial-gradient(circle at 0% 100%, #FF4F8B 0%, transparent 50%),
              radial-gradient(circle at 100% 100%, #72D6A5 0%, transparent 50%)
            `
          }}
        />
        <img
          src="/auth-bg.jpg"
          alt="Market Analytics"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="relative z-10 p-12 text-white">
          <img src="/logo.png" alt="MarketPulse" className="w-14 h-14 object-contain mb-6" />
          <h2 className="text-3xl font-extrabold leading-tight mb-4">Run your market<br />with clarity &amp; control</h2>
          <p className="text-sm text-white/70 leading-relaxed">Track inventory, manage staff, and monitor every branch — all from one place.</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-12 md:px-24 relative">

        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Home
        </button>

        <div className="w-full max-w-[400px]">

          {/* Logo / Brand header */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="flex items-center space-x-2 text-slate-900 cursor-pointer" onClick={onBack}>
              <img src="/logo.png" alt="MarketPulse Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-extrabold tracking-tight text-[#2D3148]">
                MarketPulse
              </span>
            </div>
          </div>

          {/* Titles */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#2D3148] mb-2 tracking-tight">
              {activeTab === 'signin' ? 'Welcome back 👋' : 'Join MarketPulse'}
            </h1>
            <p className="text-sm text-[#8A8D99]">
              {activeTab === 'signin' ? 'Sign in to your dashboard' : 'Create your account to get started'}
            </p>
          </div>

          {errorMsg && (
            <div className="text-red-500 text-sm text-center mb-4">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="text-green-600 text-sm text-center mb-4">{successMsg}</div>
          )}

          <form onSubmit={isGoogleOnboarding && googleData ? submitGoogleOnboarding : handleAuthSubmit} className="space-y-6">
            {isGoogleOnboarding && googleData && (
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6">
                <p className="text-sm text-blue-800 font-medium mb-1">Authenticated with Google as <strong>{googleData.name}</strong></p>
                <p className="text-xs text-blue-600">Please complete your profile to continue.</p>
              </div>
            )}

            {activeTab === 'signup' && !isGoogleOnboarding && (
              <div className="relative">
                <label className="text-xs text-slate-500 mb-1 block" htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Abraham Jesuwanu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-slate-900 bg-transparent px-0 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400"
                  required
                />
              </div>
            )}

            {!isGoogleOnboarding && (
              <div className="relative">
                <label className="text-xs text-slate-500 mb-1 block" htmlFor="reg-email">Email</label>
                <input
                  id="reg-email"
                  type="text"
                  placeholder="hello.alex@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-slate-900 bg-transparent px-0 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400"
                  required
                />
              </div>
            )}

            {!isGoogleOnboarding && (
              <div className="relative">
                <label className="text-xs text-slate-500 mb-1 block" htmlFor="reg-pass">Password</label>
                <div className="relative flex items-center border-b border-gray-300 focus-within:border-slate-900 transition-colors">
                  <input
                    id="reg-pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-0 focus:ring-0 bg-transparent px-0 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 text-slate-400 hover:text-slate-600 outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'signin' && (
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer" />
                  <span className="text-xs text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Forgot password?</a>
              </div>
            )}

            {/* Signup specific fields */}
            {activeTab === 'signup' && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="relative col-span-2 sm:col-span-1">
                  <label className="text-xs text-slate-500 mb-1 block" htmlFor="reg-role">Access Level</label>
                  <select
                    id="reg-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-slate-900 bg-transparent px-0 py-2 text-sm text-slate-900 outline-none transition-colors cursor-pointer"
                  >
                    <option value="Staff">Staff (Local)</option>
                    <option value="Admin">Admin (Business Owner)</option>
                  </select>
                </div>

                {role === 'Staff' ? (
                  <div className="relative col-span-2 sm:col-span-1">
                    <label className="text-xs text-slate-500 mb-1 block" htmlFor="reg-branch">Join Branch</label>
                    <select
                      id="reg-branch"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-slate-900 bg-transparent px-0 py-2 text-sm text-slate-900 outline-none transition-colors cursor-pointer"
                    >
                      {markets.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="relative col-span-2 sm:col-span-1">
                      <label className="text-xs text-slate-500 mb-1 block" htmlFor="reg-new-branch">Business Name</label>
                      <input
                        id="reg-new-branch"
                        type="text"
                        placeholder="e.g. Sufa Books"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-slate-900 bg-transparent px-0 py-2 text-sm text-slate-900 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="relative col-span-2">
                      <label className="text-xs text-slate-500 mb-1 block" htmlFor="reg-new-location">Location</label>
                      <input
                        id="reg-new-location"
                        type="text"
                        placeholder="e.g. Lagos, Nigeria"
                        value={newBranchLocation}
                        onChange={(e) => setNewBranchLocation(e.target.value)}
                        className="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-slate-900 bg-transparent px-0 py-2 text-sm text-slate-900 outline-none transition-colors"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-semibold rounded-full py-3.5 transition-transform hover:scale-[1.02] active:scale-95 text-sm cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #E53935 100%)' }}
              >
                {isLoading ? 'Please wait…' : (isGoogleOnboarding ? 'Complete Profile' : (activeTab === 'signin' ? 'Sign in' : 'Create Account'))}
              </button>

              {activeTab === 'signin' && !isGoogleOnboarding && (
                <button
                  type="button"
                  onClick={handleMockGoogleLogin}
                  className="w-full bg-[#f4f4f5] hover:bg-[#e4e4e7] text-slate-700 font-semibold rounded-full py-3.5 transition-transform hover:scale-[1.02] active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Log in with Google (Mock)
                </button>
              )}
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-[#8A8D99]">
            {activeTab === 'signin' ? (
              <>New to MarketPulse? <button type="button" onClick={() => { setActiveTab('signup'); setErrorMsg(''); }} className="font-bold text-[#00B8D9] hover:text-[#3558A8] hover:underline cursor-pointer transition-colors">Create a free account</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => { setActiveTab('signin'); setErrorMsg(''); }} className="font-bold text-[#00B8D9] hover:text-[#3558A8] hover:underline cursor-pointer transition-colors">Sign in</button></>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
