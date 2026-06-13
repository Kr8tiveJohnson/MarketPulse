import React, { useState, useEffect } from 'react';
import { 
  
  BarChart3, 
  ShoppingBag, 
  Users, 
  Layers, 
  AlertCircle, 
  ShieldCheck, 
  LogOut, 
  MapPin, 
  ClipboardList, 
  FileText, 
  Sliders, 
  Search, 
  Menu, 
  X, 
  Bell,
  ArrowRight,
  ShieldAlert,
  CalendarDays
} from 'lucide-react';

import { Product, Sale, Market, Staff, Activity, Task, Report, UserRole, User } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_MARKETS, 
  INITIAL_STAFF, 
  INITIAL_PRODUCTS, 
  INITIAL_SALES, 
  INITIAL_TASKS, 
  INITIAL_REPORTS, 
  INITIAL_ACTIVITIES 
} from './data/mockData';

// Subcomponents
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import AdminAuthPage from './components/AdminAuthPage';
import OverviewTab from './components/OverviewTab';
import InventoryTab from './components/InventoryTab';
import SalesTab from './components/SalesTab';
import MarketsTab from './components/MarketsTab';
import StaffTab from './components/StaffTab';
import ReportsTab from './components/ReportsTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
  // Navigation & session state
  const [page, setPage] = useState<'landing' | 'auth' | 'adminAuth' | 'dashboard'>('landing');
  const [authAction, setAuthAction] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<User | null>(null);

  // Active operational tab within dashboard
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Master local database collections state
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Toast notifier message
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Time ticker
  const [currentTime, setCurrentTime] = useState(new Date());

  // Trigger ticker update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // 1. Initial Load from localStorage or seeds
  useEffect(() => {
    const loadedMarkets = localStorage.getItem('mp_markets');
    if (loadedMarkets) {
      setMarkets(JSON.parse(loadedMarkets));
    } else {
      setMarkets(INITIAL_MARKETS);
      localStorage.setItem('mp_markets', JSON.stringify(INITIAL_MARKETS));
    }

    const loadedStaff = localStorage.getItem('mp_staff');
    if (loadedStaff) {
      setStaff(JSON.parse(loadedStaff));
    } else {
      setStaff(INITIAL_STAFF);
      localStorage.setItem('mp_staff', JSON.stringify(INITIAL_STAFF));
    }

    const loadedProducts = localStorage.getItem('mp_products');
    if (loadedProducts) {
      setProducts(JSON.parse(loadedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('mp_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    const loadedSales = localStorage.getItem('mp_sales');
    if (loadedSales) {
      setSales(JSON.parse(loadedSales));
    } else {
      setSales(INITIAL_SALES);
      localStorage.setItem('mp_sales', JSON.stringify(INITIAL_SALES));
    }

    const loadedTasks = localStorage.getItem('mp_tasks');
    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    } else {
      setTasks(INITIAL_TASKS);
      localStorage.setItem('mp_tasks', JSON.stringify(INITIAL_TASKS));
    }

    const loadedReports = localStorage.getItem('mp_reports');
    if (loadedReports) {
      setReports(JSON.parse(loadedReports));
    } else {
      setReports(INITIAL_REPORTS);
      localStorage.setItem('mp_reports', JSON.stringify(INITIAL_REPORTS));
    }

    const loadedActivities = localStorage.getItem('mp_activities');
    if (loadedActivities) {
      setActivities(JSON.parse(loadedActivities));
    } else {
      setActivities(INITIAL_ACTIVITIES);
      localStorage.setItem('mp_activities', JSON.stringify(INITIAL_ACTIVITIES));
    }

    // Recover user session from cache
    const cachedUser = localStorage.getItem('mp_user_session');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setPage('dashboard');
    }
  }, []);

  // State save helper utilities
  const saveMarkets = (data: Market[]) => {
    setMarkets(data);
    localStorage.setItem('mp_markets', JSON.stringify(data));
  };

  const saveProducts = (data: Product[]) => {
    setProducts(data);
    localStorage.setItem('mp_products', JSON.stringify(data));
  };

  const saveSales = (data: Sale[]) => {
    setSales(data);
    localStorage.setItem('mp_sales', JSON.stringify(data));
  };

  const saveStaff = (data: Staff[]) => {
    setStaff(data);
    localStorage.setItem('mp_staff', JSON.stringify(data));
  };

  const saveTasks = (data: Task[]) => {
    setTasks(data);
    localStorage.setItem('mp_tasks', JSON.stringify(data));
  };

  const saveReports = (data: Report[]) => {
    setReports(data);
    localStorage.setItem('mp_reports', JSON.stringify(data));
  };

  const saveActivities = (data: Activity[]) => {
    setActivities(data);
    localStorage.setItem('mp_activities', JSON.stringify(data));
  };

  const triggerToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper activity creator
  const createActivityLog = (username: string, role: UserRole, action: string, details: string) => {
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      username,
      role,
      action,
      timestamp: new Date().toISOString(),
      details,
    };
    saveActivities([newAct, ...activities]);
  };

  // Switch routing helper
  const handleNavigate = (pageTarget: 'landing' | 'auth' | 'adminAuth' | 'dashboard', action: 'signin' | 'signup' = 'signin') => {
    setPage(pageTarget);
    setAuthAction(action);
    setSidebarOpen(false);

    // If opening dashboard directly with no active user session, log in default Abraham (Staff) persona automatically
    if (pageTarget === 'dashboard' && !user) {
      const defaultUser: User = {
        id: 's1',
        name: 'abraham jesuwanu',
        email: 'abraham@marketpulse.com',
        role: 'Staff',
        branchId: 'm1',
      };
      setUser(defaultUser);
      localStorage.setItem('mp_user_session', JSON.stringify(defaultUser));
      triggerToast('Initialized Sandbox as Abraham Jesuwanu (Staff)');
    }
  };

  // Perform login success redirect
  const handleLoginSuccess = (email: string, role: UserRole, name: string, branchId: string, newMarketData?: { name: string, location: string }) => {
    let finalBranchId = branchId;

    // If Admin registers a new business branch, create the market node first
    if (newMarketData && role === 'Admin') {
      const freshMarket: Market = {
        id: `m-${Date.now()}`,
        name: newMarketData.name,
        location: newMarketData.location,
        staffCount: 1, // Start with 1 (the Admin)
        totalRevenue: 0,
      };
      
      saveMarkets([...markets, freshMarket]);
      finalBranchId = freshMarket.id;
      
      // We don't trigger createActivityLog here because it relies on user state which isn't set yet.
      // But we can trigger a nice toast!
      triggerToast(`Successfully registered your business: ${freshMarket.name}`);
    }

    const freshUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      branchId: finalBranchId,
    };
    
    setUser(freshUser);
    localStorage.setItem('mp_user_session', JSON.stringify(freshUser));
    
    // We can run this async slightly so that the state has time to settle
    setTimeout(() => {
      createActivityLog(name, role, 'User Session Booted', `Logged into workspace via terminal node (${role} level)`);
    }, 100);

    setPage('dashboard');
    triggerToast(`Welcome, ${name}! Logged in as ${role}.`);
  };

  // Terminate session
  const handleLogout = () => {
    if (user) {
      createActivityLog(user.name, user.role, 'Closed Session', 'Logged out of terminal control center');
    }
    setUser(null);
    localStorage.removeItem('mp_user_session');
    setPage('landing');
    triggerToast('Logged out successfully.', 'info');
  };



  // Operational state mutaters (passed into matching dashboard tabs)

  // Products changes
  const handleAddProduct = (p: Omit<Product, 'id'>) => {
    const brandNew: Product = {
      ...p,
      id: `prod-${Date.now()}`,
    };
    saveProducts([brandNew, ...products]);
    createActivityLog(
      user?.name || 'Authorized User',
      user?.role || 'Staff',
      'Registered New Product',
      `Registered "${brandNew.name}" in category "${brandNew.category}"`
    );
    triggerToast(`Product listed: ${brandNew.name}`);
  };

  const handleUpdateProduct = (id: string, updated: Partial<Product>) => {
    const updatedList = products.map((p) => {
      if (p.id === id) {
        const prod = { ...p, ...updated };
        if (updated.stock !== undefined) {
          createActivityLog(
            user?.name || 'Staff Member',
            user?.role || 'Staff',
            'Updated Stock Count',
            `Adjusted "${p.name}" storage quantity counts to ${updated.stock} units`
          );
        }
        return prod;
      }
      return p;
    });
    saveProducts(updatedList);
    triggerToast('Product details updated successfully');
  };

  const handleDeleteProduct = (id: string) => {
    if (user?.role !== 'Admin') {
      triggerToast('Permission Denied: Staff cannot delete catalog nodes', 'warn');
      return;
    }
    const victim = products.find((p) => p.id === id);
    const updatedList = products.filter((p) => p.id !== id);
    saveProducts(updatedList);
    createActivityLog(
      user.name,
      'Admin',
      'Purged Catalog Item',
      `Permanently deleted product: "${victim?.name || 'Unknown Item'}" from data files`
    );
    triggerToast('Product deleted from directory');
  };

  // Record a Sale log
  const handleRecordSale = (productId: string, quantity: number, recordedBy: string) => {
    const targetedProduct = products.find((p) => p.id === productId);
    if (!targetedProduct) return;

    if (targetedProduct.stock < quantity) {
      triggerToast('Insufficient stock available inside targeted branch', 'warn');
      return;
    }

    // Get current branch from logging user context
    const currentBranchId = user?.branchId || targetedProduct.branchId;
    const currentBranchName = markets.find((m) => m.id === currentBranchId)?.name || 'Central Headquarter';

    // 1. Reduce product stock levels
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: p.stock - quantity };
      }
      return p;
    });
    saveProducts(updatedProducts);

    // 2. Log sale transaction entry
    const newSaleEntry: Sale = {
      id: `sale-${Date.now()}`,
      productId,
      productName: targetedProduct.name,
      quantity,
      unitPrice: targetedProduct.sellingPrice,
      totalPrice: targetedProduct.sellingPrice * quantity,
      date: new Date().toISOString(),
      recordedBy,
      branchId: currentBranchId,
      branchName: currentBranchName,
    };
    saveSales([newSaleEntry, ...sales]);

    // 3. Increment branch staff sales count counters
    const updatedStaff = staff.map((s) => {
      if (s.name.toLowerCase() === recordedBy.toLowerCase()) {
        return { ...s, salesCount: s.salesCount + quantity };
      }
      return s;
    });
    saveStaff(updatedStaff);

    // 4. Log system activity feed update
    const formatNairaVal = (val: number) => {
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val).replace('NGN', '₦');
    };
    
    createActivityLog(
      recordedBy,
      user?.role || 'Staff',
      'Recorded Sale Log',
      `Locked sales checkout for ${quantity} x "${targetedProduct.name}" (Value: ${formatNairaVal(targetedProduct.sellingPrice * quantity)}) at ${currentBranchName}`
    );

    triggerToast('Sales transaction successfully locked!');
  };

  // Add Market branch
  const handleAddMarket = (m: Omit<Market, 'id' | 'staffCount' | 'totalRevenue'>) => {
    const freshMarket: Market = {
      ...m,
      id: `m-${Date.now()}`,
      staffCount: 0,
      totalRevenue: 0,
    };
    saveMarkets([...markets, freshMarket]);
    createActivityLog(
      user?.name || 'Authorized Member',
      user?.role || 'Staff',
      'Registered New Branch',
      `Opened new market node point: "${freshMarket.name}" in area: "${freshMarket.location}"`
    );
    triggerToast(`Market enrolled: ${freshMarket.name}`);
  };

  // Staff changes
  const handleAddStaff = (employee: Omit<Staff, 'id' | 'tasksCount' | 'salesCount'>) => {
    const newWorker: Staff = {
      ...employee,
      id: `staff-${Date.now()}`,
      tasksCount: 0,
      salesCount: 0,
    };
    saveStaff([...staff, newWorker]);
    createActivityLog(
      user?.name || 'Admin',
      'Admin',
      'Enrolled Employee',
      `Invited new personnel "${newWorker.name}" assign to branch "${newWorker.branchName}"`
    );
    triggerToast(`Enrolled staff: ${newWorker.name}`);
  };

  const handleRemoveStaff = (id: string) => {
    if (user?.role !== 'Admin') {
      triggerToast('Permission Denied', 'warn');
      return;
    }
    const target = staff.find((s) => s.id === id);
    const remainder = staff.filter((s) => s.id !== id);
    saveStaff(remainder);
    createActivityLog(
      user.name,
      'Admin',
      'Revoked Employee Access',
      `Removed staff user access files for employee: "${target?.name || 'Worker'}"`
    );
    triggerToast('Personnel access credentials keys deleted');
  };

  // Tasks additions
  const handleAddTask = (t: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...t,
      id: `task-${Date.now()}`,
      status: 'Pending',
    };
    saveTasks([newTask, ...tasks]);

    // Update staff task total count tracking
    const updatedStaff = staff.map((s) => {
      if (s.id === t.staffId) {
        return { ...s, tasksCount: s.tasksCount + 1 };
      }
      return s;
    });
    saveStaff(updatedStaff);

    const matchName = staff.find((s) => s.id === t.staffId)?.name || 'Personnel';

    createActivityLog(
      user?.name || 'Admin',
      'Admin',
      'Assigned Action Task',
      `Assigned workflow checklist: "${t.title}" to personnel ${matchName}`
    );
    triggerToast(`Task assigned to ${matchName}`);
  };

  const handleCompleteTask = (id: string) => {
    const completedList = tasks.map((t) => {
      if (t.id === id) {
        createActivityLog(
          user?.name || 'Staff User',
          user?.role || 'Staff',
          'Completed Task Checklist',
          `Finished assigned checklist node item: "${t.title}"`
        );
        return { ...t, status: 'Completed' as const };
      }
      return t;
    });
    saveTasks(completedList);
    triggerToast('Task completed! Keep it up!');
  };

  // Reports upload
  const handleAddReport = (r: Omit<Report, 'id' | 'date'>) => {
    const newReport: Report = {
      ...r,
      id: `rep-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    saveReports([newReport, ...reports]);
    createActivityLog(
      r.uploaderName,
      user?.role || 'Staff',
      'Uploaded Daily Report',
      `Transmitted report memo: "${r.title}" to system HQ`
    );
    triggerToast('Daily memo transmitted');
  };

  // Reset entire database to default Balogun & Computer Village seeds (In settings)
  const handleResetStorage = () => {
    saveMarkets(INITIAL_MARKETS);
    saveStaff(INITIAL_STAFF);
    saveProducts(INITIAL_PRODUCTS);
    saveSales(INITIAL_SALES);
    saveTasks(INITIAL_TASKS);
    saveReports(INITIAL_REPORTS);
    saveActivities(INITIAL_ACTIVITIES);
    triggerToast('Sandbox database states successfully wiped to original Balogun & Computer Village default seeds!');
  };

  // Render individual tabs on dashboard page
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            role={user?.role || 'Staff'}
            username={user?.name || 'abraham jesuwanu'}
            products={products}
            sales={sales}
            markets={markets}
            staff={staff}
            activities={activities}
            tasks={tasks}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onRecordSaleClick={() => setActiveTab('sales')}
          />
        );
      case 'inventory':
        return (
          <InventoryTab
            role={user?.role || 'Staff'}
            products={products}
            markets={markets}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'sales':
        return (
          <SalesTab
            role={user?.role || 'Staff'}
            username={user?.name || 'abraham jesuwanu'}
            sales={sales}
            products={products}
            markets={markets}
            onRecordSale={handleRecordSale}
          />
        );
      case 'markets':
        return (
          <MarketsTab
            role={user?.role || 'Staff'}
            markets={markets}
            products={products}
            sales={sales}
            onAddMarket={handleAddMarket}
          />
        );
      case 'staff':
        return (
          <StaffTab
            role={user?.role || 'Staff'}
            staff={staff}
            markets={markets}
            onAddStaff={handleAddStaff}
            onRemoveStaff={handleRemoveStaff}
          />
        );
      case 'reports':
        return (
          <ReportsTab
            role={user?.role || 'Staff'}
            username={user?.name || 'abraham jesuwanu'}
            tasks={tasks}
            reports={reports}
            staff={staff}
            onAddTask={handleAddTask}
            onCompleteTask={handleCompleteTask}
            onAddReport={handleAddReport}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            role={user?.role || 'Staff'}
            onResetData={handleResetStorage}
            marketsCount={markets.length}
          />
        );
      default:
        return null;
    }
  };

  // Core Pages routers
  return (
    <AnimatePresence mode="wait">
      {page === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <LandingPage onNavigate={handleNavigate} />
        </motion.div>
      )}

      {page === 'auth' && (
        <motion.div
          key="auth"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="min-h-screen"
        >
          <AuthPage
            initialAction={authAction}
            onBack={() => setPage('landing')}
            onLoginSuccess={handleLoginSuccess}
            markets={markets}
            staffList={staff}
          />
        </motion.div>
      )}

      {page === 'adminAuth' && (
        <AdminAuthPage
          onBack={() => setPage('landing')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {page === 'dashboard' && user && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-slate-50 flex font-sans selection:bg-blue-600 selection:text-white"
        >
      {/* Toast Notice banner overlay */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white rounded-sm py-3 px-4 shadow-xl border border-slate-800 flex items-center space-x-2 text-xs font-semibold animate-bounce duration-1000">
          <ShieldAlert size={14} className="text-blue-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* LEFT COLUMN: Sidebar (Figma style) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col flex-1">
          {/* Brand Header area */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('landing')}>
              <img src="/logo.png" alt="MarketPulse Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-white tracking-tight">MarketPulse</span>
            </div>

            {/* Mobile close menu trigger */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Active Workspace indicator badge */}
          <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/20">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Target Workspace</span>
            <div className="flex items-center justify-between mt-1 text-xs text-white">
              <span className="font-semibold flex items-center gap-1 text-slate-350">
                ⚡ {user?.role === 'Admin' ? 'Central HQ Hub' : markets.find(m => m.id === user?.branchId)?.name || 'Local Branch'}
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/25 px-1.5 py-0.5 rounded-sm uppercase font-bold">
                {user?.role} Only
              </span>
            </div>
          </div>

          {/* Middle Navigation Sidebar Links */}
          <nav className="px-4 py-6 space-y-1 flex-1 overflow-y-auto text-xs font-semibold">
            {/* Overview */}
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-4 rounded-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers size={16} />
              <span>Overview Node</span>
            </button>

            {/* Inventory */}
            <button
              onClick={() => { setActiveTab('inventory'); setSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-4 rounded-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'inventory' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingBag size={16} />
              <span>Inventory Catalog</span>
            </button>

            {/* Sales */}
            <button
              onClick={() => { setActiveTab('sales'); setSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-4 rounded-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'sales' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 size={16} />
              <span>Sales Terminal</span>
            </button>

            {/* Markets */}
            <button
              onClick={() => { setActiveTab('markets'); setSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-4 rounded-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'markets' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MapPin size={16} />
              <span>Markets & Branches</span>
            </button>

            {/* Staff */}
            <button
              onClick={() => { setActiveTab('staff'); setSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-4 rounded-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'staff' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>Staff activities</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-4 rounded-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'reports' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText size={16} />
              <span>Reports & Tasks</span>
            </button>

            <div className="border-t border-slate-800 my-3" />

            {/* Settings */}
            <button
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className={`w-full text-left py-2.5 px-4 rounded-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sliders size={16} />
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        {/* BOTTOM: Active log-in Profile Node Card */}
        <div className="p-6 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JD'}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-white truncate capitalize">{user?.name || 'James Admin'}</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{user?.role === 'Admin' ? 'Full Access' : 'Staff Access'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-white p-1 rounded-sm hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign out Terminal"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT COLUMN: Real-time Master body area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 transition-all duration-300">
        
        {/* UPPER MAIN HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-600 hover:text-blue-600 cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* Active module descriptor */}
            <div>
              <h1 className="text-lg font-bold text-slate-800 capitalize">
                {activeTab} Overview
              </h1>
            </div>
          </div>

          {/* Quick Real-Time Header Clock Indicators */}
          <div className="flex items-center space-x-4">

            {/* Current local time date clock */}
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-100 border-none px-3 py-1.5 rounded-sm text-[11px] font-semibold text-slate-600">
              <CalendarDays size={13} className="text-slate-500" />
              <span className="font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-slate-300">|</span>
              <span>June 13, 2026</span>
            </div>

            <div className="relative cursor-pointer p-1 rounded-sm text-slate-500 hover:text-blue-600 transition-colors">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-white" />
            </div>
          </div>
        </header>

        {/* PRIMARY LAYOUT CONTENT OUTLET */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16 text-slate-800 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
