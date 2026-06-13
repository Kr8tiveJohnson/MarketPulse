const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appFile, 'utf8');

// 1. Remove mockData imports
content = content.replace(/import\s*\{\s*INITIAL_MARKETS[\s\S]*?\}\s*from\s*'(\.\/)?data\/mockData';/g, '');

// 2. Add API URL
content = content.replace(/const \[currentTime, setCurrentTime\] = useState\(new Date\(\)\);/, `const [currentTime, setCurrentTime] = useState(new Date());\n  const API_BASE_URL = 'http://localhost:5000/api';`);

// 3. Replace useEffect initial load
const useEffectRegex = /\/\/ 1\. Initial Load from localStorage or seeds[\s\S]*?const saveMarkets/m;
content = content.replace(useEffectRegex, `// 1. Initial Load from backend API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [mRes, sRes, pRes, saRes, tRes, rRes, aRes] = await Promise.all([
          fetch(\`\${API_BASE_URL}/markets\`),
          fetch(\`\${API_BASE_URL}/staff\`),
          fetch(\`\${API_BASE_URL}/products\`),
          fetch(\`\${API_BASE_URL}/sales\`),
          fetch(\`\${API_BASE_URL}/tasks\`),
          fetch(\`\${API_BASE_URL}/reports\`),
          fetch(\`\${API_BASE_URL}/activities\`)
        ]);

        if (mRes.ok) setMarkets(await mRes.json());
        if (sRes.ok) setStaff(await sRes.json());
        if (pRes.ok) setProducts(await pRes.json());
        if (saRes.ok) setSales(await saRes.json());
        if (tRes.ok) setTasks(await tRes.json());
        if (rRes.ok) setReports(await rRes.json());
        if (aRes.ok) setActivities(await aRes.json());
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    loadData();

    const cachedUser = localStorage.getItem('mp_user_session');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setPage('dashboard');
    }
  }, []);

  const saveMarkets`);

// 4. Remove automatic Abraham login sandbox
content = content.replace(/if\s*\(pageTarget === 'dashboard' && !user\)\s*\{[\s\S]*?triggerToast\('Initialized Sandbox as Abraham Jesuwanu \(Staff\)'\);\s*\}/g, '');

// 5. Replace state helpers and mutators with API calls.
// Instead of complex AST, let's rewrite the handle functions directly.
// This is best done by a large replacement block.

const mutatorsRegex = /\/\/ State save helper utilities[\s\S]*?\/\/ Reset entire database to default Balogun & Computer Village seeds \(In settings\)/m;

const newMutators = `// API helper to log activity
  const createActivityLog = async (username: string, role: UserRole, action: string, details: string) => {
    const newAct = { username, role, action, details };
    try {
      const res = await fetch(\`\${API_BASE_URL}/activities\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAct)
      });
      if (res.ok) {
        const saved = await res.json();
        setActivities(prev => [saved, ...prev]);
      }
    } catch (err) {}
  };

  const triggerToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddProduct = async (p: Omit<Product, 'id'>) => {
    try {
      const res = await fetch(\`\${API_BASE_URL}/products\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        const brandNew = await res.json();
        setProducts([brandNew, ...products]);
        createActivityLog(
          user?.name || 'Authorized User',
          user?.role || 'Staff',
          'Registered New Product',
          \`Registered "\${brandNew.name}" in category "\${brandNew.category}"\`
        );
        triggerToast(\`Product listed: \${brandNew.name}\`);
      }
    } catch (err) { triggerToast('Failed to add product', 'warn'); }
  };

  const handleUpdateProduct = async (id: string, updated: Partial<Product>) => {
    try {
      const res = await fetch(\`\${API_BASE_URL}/products/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const prod = await res.json();
        setProducts(products.map(p => p.id === id ? prod : p));
        if (updated.stock !== undefined) {
          createActivityLog(
            user?.name || 'Staff Member',
            user?.role || 'Staff',
            'Updated Stock Count',
            \`Adjusted "\${prod.name}" storage quantity counts to \${updated.stock} units\`
          );
        }
        triggerToast('Product details updated successfully');
      }
    } catch (err) { triggerToast('Failed to update product', 'warn'); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (user?.role !== 'Admin') {
      triggerToast('Permission Denied: Staff cannot delete catalog nodes', 'warn');
      return;
    }
    const victim = products.find((p) => p.id === id);
    try {
      const res = await fetch(\`\${API_BASE_URL}/products/\${id}\`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        createActivityLog(
          user.name,
          'Admin',
          'Purged Catalog Item',
          \`Permanently deleted product: "\${victim?.name || 'Unknown Item'}"\`
        );
        triggerToast('Product deleted from directory');
      }
    } catch (err) { triggerToast('Failed to delete product', 'warn'); }
  };

  const handleRecordSale = async (productId: string, quantity: number, recordedBy: string) => {
    const targetedProduct = products.find((p) => p.id === productId);
    if (!targetedProduct) return;
    if (targetedProduct.stock < quantity) {
      triggerToast('Insufficient stock available', 'warn');
      return;
    }
    
    const currentBranchId = user?.branchId || targetedProduct.branchId;
    const currentBranchName = markets.find((m) => m.id === currentBranchId)?.name || 'Central Headquarter';

    const newSale = {
      productId,
      productName: targetedProduct.name,
      quantity,
      unitPrice: targetedProduct.sellingPrice,
      totalPrice: targetedProduct.sellingPrice * quantity,
      recordedBy,
      branchId: currentBranchId,
      branchName: currentBranchName,
    };

    try {
      const resSale = await fetch(\`\${API_BASE_URL}/sales\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale)
      });
      if (resSale.ok) {
        const savedSale = await resSale.json();
        setSales([savedSale, ...sales]);

        // Update product stock
        await handleUpdateProduct(productId, { stock: targetedProduct.stock - quantity });
        
        // Update staff sales count
        const staffMember = staff.find(s => s.name.toLowerCase() === recordedBy.toLowerCase());
        if (staffMember) {
          await fetch(\`\${API_BASE_URL}/staff/\${staffMember.id}\`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salesCount: staffMember.salesCount + quantity })
          });
          setStaff(staff.map(s => s.id === staffMember.id ? { ...s, salesCount: s.salesCount + quantity } : s));
        }

        const formatNairaVal = (val: number) => {
          return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val).replace('NGN', '₦');
        };
        createActivityLog(
          recordedBy,
          user?.role || 'Staff',
          'Recorded Sale Log',
          \`Locked sales checkout for \${quantity} x "\${targetedProduct.name}" (Value: \${formatNairaVal(targetedProduct.sellingPrice * quantity)}) at \${currentBranchName}\`
        );
        triggerToast('Sales transaction successfully locked!');
      }
    } catch (err) { triggerToast('Failed to record sale', 'warn'); }
  };

  const handleAddMarket = async (m: Omit<Market, 'id' | 'staffCount' | 'totalRevenue'>) => {
    try {
      const res = await fetch(\`\${API_BASE_URL}/markets\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
      });
      if (res.ok) {
        const freshMarket = await res.json();
        setMarkets([...markets, freshMarket]);
        createActivityLog(
          user?.name || 'Authorized Member',
          user?.role || 'Staff',
          'Registered New Branch',
          \`Opened new market node point: "\${freshMarket.name}" in area: "\${freshMarket.location}"\`
        );
        triggerToast(\`Market enrolled: \${freshMarket.name}\`);
      }
    } catch (err) { triggerToast('Failed to add market', 'warn'); }
  };

  const handleAddStaff = async (employee: Omit<Staff, 'id' | 'tasksCount' | 'salesCount'>) => {
    try {
      const res = await fetch(\`\${API_BASE_URL}/staff\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (res.ok) {
        const newWorker = await res.json();
        setStaff([...staff, newWorker]);
        createActivityLog(
          user?.name || 'Admin',
          'Admin',
          'Enrolled Employee',
          \`Invited new personnel "\${newWorker.name}" assign to branch "\${newWorker.branchName}"\`
        );
        triggerToast(\`Enrolled staff: \${newWorker.name}\`);
      }
    } catch (err) { triggerToast('Failed to add staff', 'warn'); }
  };

  const handleRemoveStaff = async (id: string) => {
    if (user?.role !== 'Admin') {
      triggerToast('Permission Denied', 'warn');
      return;
    }
    const target = staff.find((s) => s.id === id);
    try {
      const res = await fetch(\`\${API_BASE_URL}/staff/\${id}\`, { method: 'DELETE' });
      if (res.ok) {
        setStaff(staff.filter((s) => s.id !== id));
        createActivityLog(
          user.name,
          'Admin',
          'Revoked Employee Access',
          \`Removed staff user access files for employee: "\${target?.name || 'Worker'}"\`
        );
        triggerToast('Personnel access credentials keys deleted');
      }
    } catch (err) { triggerToast('Failed to remove staff', 'warn'); }
  };

  const handleAddTask = async (t: Omit<Task, 'id' | 'status'>) => {
    try {
      const res = await fetch(\`\${API_BASE_URL}/tasks\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
        
        const staffMember = staff.find((s) => s.id === t.staffId);
        if (staffMember) {
          await fetch(\`\${API_BASE_URL}/staff/\${staffMember.id}\`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tasksCount: staffMember.tasksCount + 1 })
          });
          setStaff(staff.map(s => s.id === staffMember.id ? { ...s, tasksCount: s.tasksCount + 1 } : s));
        }
        
        const matchName = staffMember?.name || 'Personnel';
        createActivityLog(
          user?.name || 'Admin',
          'Admin',
          'Assigned Action Task',
          \`Assigned workflow checklist: "\${t.title}" to personnel \${matchName}\`
        );
        triggerToast(\`Task assigned to \${matchName}\`);
      }
    } catch (err) { triggerToast('Failed to add task', 'warn'); }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const res = await fetch(\`\${API_BASE_URL}/tasks/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      if (res.ok) {
        const completedTask = await res.json();
        setTasks(tasks.map(t => t.id === id ? completedTask : t));
        createActivityLog(
          user?.name || 'Staff User',
          user?.role || 'Staff',
          'Completed Task Checklist',
          \`Finished assigned checklist node item: "\${completedTask.title}"\`
        );
        triggerToast('Task completed! Keep it up!');
      }
    } catch (err) { triggerToast('Failed to complete task', 'warn'); }
  };

  const handleAddReport = async (r: Omit<Report, 'id' | 'date'>) => {
    const reportData = {
      ...r,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    try {
      const res = await fetch(\`\${API_BASE_URL}/reports\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (res.ok) {
        const newReport = await res.json();
        setReports([newReport, ...reports]);
        createActivityLog(
          r.uploaderName,
          user?.role || 'Staff',
          'Uploaded Daily Report',
          \`Transmitted report memo: "\${r.title}" to system HQ\`
        );
        triggerToast('Daily memo transmitted');
      }
    } catch (err) { triggerToast('Failed to add report', 'warn'); }
  };

  // Reset entire database to default Balogun & Computer Village seeds (In settings)
`;

content = content.replace(mutatorsRegex, newMutators);

// 6. Update the reset function to just clear everything if they press reset
content = content.replace(/const handleResetStorage = \(\) => \{[\s\S]*?\};/m, `const handleResetStorage = async () => {
    triggerToast('Reset requires manual database clear in backend now.', 'info');
  };`);

// 7. Update handleLoginSuccess to create market via API if newMarketData exists
content = content.replace(/const handleLoginSuccess = \(email: string, role: UserRole, name: string, branchId: string, newMarketData\?: \{ name: string, location: string \}\) => \{[\s\S]*?setUser\(freshUser\);/m, `const handleLoginSuccess = async (email: string, role: UserRole, name: string, branchId: string, newMarketData?: { name: string, location: string }) => {
    let finalBranchId = branchId;

    if (newMarketData && role === 'Admin') {
      try {
        const res = await fetch(\`\${API_BASE_URL}/markets\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newMarketData.name, location: newMarketData.location })
        });
        if (res.ok) {
          const freshMarket = await res.json();
          setMarkets([...markets, freshMarket]);
          finalBranchId = freshMarket.id;
          triggerToast(\`Successfully registered your business: \${freshMarket.name}\`);
        }
      } catch (err) {
        triggerToast('Failed to create market', 'warn');
      }
    }

    try {
      const uRes = await fetch(\`\${API_BASE_URL}/users\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, branchId: finalBranchId })
      });
      const freshUser = await uRes.json();
      setUser(freshUser);
    } catch (err) {
      triggerToast('Failed to register user', 'warn');
    }
`);

fs.writeFileSync(appFile, content, 'utf8');
console.log('Successfully refactored App.tsx to use Backend API');
