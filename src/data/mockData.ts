import { Product, Sale, Market, Staff, Activity, Task, Report } from '../types';

export const INITIAL_MARKETS: Market[] = [
  { id: 'm1', name: 'Computer Village', location: 'Ikeja, Lagos', staffCount: 1, totalRevenue: 1850000 },
  { id: 'm2', name: 'Balogun Market', location: 'Lagos Island, Lagos', staffCount: 1, totalRevenue: 1540000 },
  { id: 'm3', name: 'Alaba International', location: 'Ojo, Lagos', staffCount: 1, totalRevenue: 980000 },
  { id: 'm4', name: 'Mile 12 Market', location: 'Kosofe, Lagos', staffCount: 1, totalRevenue: 450000 },
  { id: 'm5', name: 'Wuse Market', location: 'Wuse, Abuja', staffCount: 1, totalRevenue: 0 },
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 's1',
    name: 'abraham jesuwanu',
    email: 'abraham@marketpulse.com',
    branchId: 'm1',
    branchName: 'Computer Village',
    status: 'Active',
    tasksCount: 3,
    salesCount: 184,
  },
  {
    id: 's2',
    name: 'amara beko',
    email: 'amara@marketpulse.com',
    branchId: 'm2',
    branchName: 'Balogun Market',
    status: 'Active',
    tasksCount: 2,
    salesCount: 128,
  },
  {
    id: 's3',
    name: 'chinedu okafor',
    email: 'chinedu@marketpulse.com',
    branchId: 'm3',
    branchName: 'Alaba International',
    status: 'Active',
    tasksCount: 1,
    salesCount: 45,
  },
  {
    id: 's4',
    name: 'funke adebayo',
    email: 'funke@marketpulse.com',
    branchId: 'm4',
    branchName: 'Mile 12 Market',
    status: 'Active',
    tasksCount: 4,
    salesCount: 32,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Beverages (Highly demanded items)
  { id: 'p1', name: 'Milo Giant Pack 1kg', category: 'Beverages', stock: 120, minStock: 20, purchasePrice: 5200, sellingPrice: 6500, branchId: 'm2' },
  { id: 'p2', name: 'Peak Milk Refill 800g', category: 'Beverages', stock: 85, minStock: 15, purchasePrice: 4100, sellingPrice: 5200, branchId: 'm2' },
  { id: 'p3', name: 'Lipton Yellow Label (100 bags)', category: 'Beverages', stock: 12, minStock: 25, purchasePrice: 1800, sellingPrice: 2400, branchId: 'm2' }, // Low Stock
  
  // Foods
  { id: 'p4', name: 'Mama Gold Rice 50kg', category: 'Foods', stock: 50, minStock: 10, purchasePrice: 58000, sellingPrice: 68000, branchId: 'm4' },
  { id: 'p5', name: 'Golden Penny Semovita 10kg', category: 'Foods', stock: 8, minStock: 15, purchasePrice: 11000, sellingPrice: 13500, branchId: 'm4' }, // Low Stock
  { id: 'p6', name: 'Indomie Belle Full (Ctn)', category: 'Foods', stock: 110, minStock: 30, purchasePrice: 7200, sellingPrice: 8500, branchId: 'm4' },

  // Toiletries
  { id: 'p7', name: 'Sunlight Detergent 1kg', category: 'Toiletries', stock: 140, minStock: 20, purchasePrice: 2100, sellingPrice: 2800, branchId: 'm2' },
  { id: 'p8', name: 'Dettol Soap 6-pack (70g)', category: 'Toiletries', stock: 4, minStock: 15, purchasePrice: 2500, sellingPrice: 3200, branchId: 'm2' }, // Low Stock
  { id: 'p9', name: 'Colgate Toothpaste 140g', category: 'Toiletries', stock: 95, minStock: 20, purchasePrice: 1100, sellingPrice: 1500, branchId: 'm2' },

  // Electronics (Ikeja Computer Village specialties)
  { id: 'p10', name: 'Oraimo Powerbank 20000mAh', category: 'Electronics', stock: 350, minStock: 50, purchasePrice: 14000, sellingPrice: 18500, branchId: 'm1' },
  { id: 'p11', name: 'Oraimo FreePods 4', category: 'Electronics', stock: 215, minStock: 30, purchasePrice: 18000, sellingPrice: 24000, branchId: 'm1' },
  { id: 'p12', name: 'Samsung 25W Fast Charger', category: 'Electronics', stock: 320, minStock: 40, purchasePrice: 7000, sellingPrice: 9500, branchId: 'm1' },
  { id: 'p13', name: 'iPhone Lightning Cable (1m)', category: 'Electronics', stock: 9, minStock: 40, purchasePrice: 1500, sellingPrice: 3000, branchId: 'm1' }, // Low Stock
  
  // Alaba International specialties
  { id: 'p14', name: 'Panasonic Standing Fan 16"', category: 'Appliances', stock: 45, minStock: 8, purchasePrice: 34000, sellingPrice: 42000, branchId: 'm3' },
  { id: 'p15', name: 'Haier Thermocool Bedside Fridge', category: 'Appliances', stock: 12, minStock: 3, purchasePrice: 115000, sellingPrice: 135000, branchId: 'm3' },
  { id: 'p16', name: 'Royal Electric Kettle 1.8L', category: 'Appliances', stock: 2, minStock: 10, purchasePrice: 8500, sellingPrice: 11000, branchId: 'm3' }, // Low Stock
];

export const INITIAL_SALES: Sale[] = [
  // --- Day 7 ago (June 7) ---
  {
    id: 's-sale-d7a',
    productId: 'p12',
    productName: 'Samsung 25W Fast Charger',
    quantity: 18,
    unitPrice: 9500,
    totalPrice: 171000,
    date: '2026-06-07T09:10:00.000Z',
    recordedBy: 'abraham jesuwanu',
    branchId: 'm1',
    branchName: 'Computer Village',
  },
  {
    id: 's-sale-d7b',
    productId: 'p7',
    productName: 'Sunlight Detergent 1kg',
    quantity: 30,
    unitPrice: 2800,
    totalPrice: 84000,
    date: '2026-06-07T14:00:00.000Z',
    recordedBy: 'amara beko',
    branchId: 'm2',
    branchName: 'Balogun Market',
  },
  // --- Day 6 ago (June 8) ---
  {
    id: 's-sale-d6a',
    productId: 'p10',
    productName: 'Oraimo Powerbank 20000mAh',
    quantity: 7,
    unitPrice: 18500,
    totalPrice: 129500,
    date: '2026-06-08T10:30:00.000Z',
    recordedBy: 'abraham jesuwanu',
    branchId: 'm1',
    branchName: 'Computer Village',
  },
  {
    id: 's-sale-d6b',
    productId: 'p6',
    productName: 'Indomie Belle Full (Ctn)',
    quantity: 15,
    unitPrice: 8500,
    totalPrice: 127500,
    date: '2026-06-08T13:00:00.000Z',
    recordedBy: 'funke adebayo',
    branchId: 'm4',
    branchName: 'Mile 12 Market',
  },
  // --- Day 5 ago (June 9) ---
  {
    id: 's-sale-d5a',
    productId: 'p15',
    productName: 'Haier Thermocool Bedside Fridge',
    quantity: 1,
    unitPrice: 135000,
    totalPrice: 135000,
    date: '2026-06-09T11:00:00.000Z',
    recordedBy: 'chinedu okafor',
    branchId: 'm3',
    branchName: 'Alaba International',
  },
  {
    id: 's-sale-d5b',
    productId: 'p9',
    productName: 'Colgate Toothpaste 140g',
    quantity: 50,
    unitPrice: 1500,
    totalPrice: 75000,
    date: '2026-06-09T15:45:00.000Z',
    recordedBy: 'amara beko',
    branchId: 'm2',
    branchName: 'Balogun Market',
  },
  // --- Day 4 ago (June 10) ---
  {
    id: 's-sale-d4a',
    productId: 'p11',
    productName: 'Oraimo FreePods 4',
    quantity: 8,
    unitPrice: 24000,
    totalPrice: 192000,
    date: '2026-06-10T10:00:00.000Z',
    recordedBy: 'abraham jesuwanu',
    branchId: 'm1',
    branchName: 'Computer Village',
  },
  {
    id: 's-sale-d4b',
    productId: 'p2',
    productName: 'Peak Milk Refill 800g',
    quantity: 25,
    unitPrice: 5200,
    totalPrice: 130000,
    date: '2026-06-10T14:30:00.000Z',
    recordedBy: 'amara beko',
    branchId: 'm2',
    branchName: 'Balogun Market',
  },
  // --- Day 3 ago (June 11) ---
  {
    id: 's-sale4',
    productId: 'p4',
    productName: 'Mama Gold Rice 50kg',
    quantity: 3,
    unitPrice: 68000,
    totalPrice: 204000,
    date: '2026-06-11T11:45:00.000Z',
    recordedBy: 'funke adebayo',
    branchId: 'm4',
    branchName: 'Mile 12 Market',
  },
  {
    id: 's-sale5',
    productId: 'p14',
    productName: 'Panasonic Standing Fan 16"',
    quantity: 2,
    unitPrice: 42000,
    totalPrice: 84000,
    date: '2026-06-11T15:20:00.000Z',
    recordedBy: 'chinedu okafor',
    branchId: 'm3',
    branchName: 'Alaba International',
  },
  // --- Day 2 ago (June 12) ---
  {
    id: 's-sale1',
    productId: 'p10',
    productName: 'Oraimo Powerbank 20000mAh',
    quantity: 10,
    unitPrice: 18500,
    totalPrice: 185000,
    date: '2026-06-12T14:30:00.000Z',
    recordedBy: 'abraham jesuwanu',
    branchId: 'm1',
    branchName: 'Computer Village',
  },
  {
    id: 's-sale2',
    productId: 'p11',
    productName: 'Oraimo FreePods 4',
    quantity: 5,
    unitPrice: 24000,
    totalPrice: 120000,
    date: '2026-06-12T16:15:00.000Z',
    recordedBy: 'abraham jesuwanu',
    branchId: 'm1',
    branchName: 'Computer Village',
  },
  {
    id: 's-sale3',
    productId: 'p1',
    productName: 'Milo Giant Pack 1kg',
    quantity: 20,
    unitPrice: 6500,
    totalPrice: 130000,
    date: '2026-06-12T10:00:00.000Z',
    recordedBy: 'amara beko',
    branchId: 'm2',
    branchName: 'Balogun Market',
  },
  // --- Yesterday (June 13) ---
  {
    id: 's-sale-d1a',
    productId: 'p12',
    productName: 'Samsung 25W Fast Charger',
    quantity: 12,
    unitPrice: 9500,
    totalPrice: 114000,
    date: '2026-06-13T09:45:00.000Z',
    recordedBy: 'abraham jesuwanu',
    branchId: 'm1',
    branchName: 'Computer Village',
  },
  {
    id: 's-sale-d1b',
    productId: 'p14',
    productName: 'Panasonic Standing Fan 16"',
    quantity: 3,
    unitPrice: 42000,
    totalPrice: 126000,
    date: '2026-06-13T12:20:00.000Z',
    recordedBy: 'chinedu okafor',
    branchId: 'm3',
    branchName: 'Alaba International',
  },
  {
    id: 's-sale-d1c',
    productId: 'p6',
    productName: 'Indomie Belle Full (Ctn)',
    quantity: 20,
    unitPrice: 8500,
    totalPrice: 170000,
    date: '2026-06-13T16:00:00.000Z',
    recordedBy: 'funke adebayo',
    branchId: 'm4',
    branchName: 'Mile 12 Market',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    staffId: 's1',
    title: 'Verify stock count for FreePods 4',
    description: 'Ensure the physical count match our system records perfectly before the weekend rush.',
    dueDate: '2026-06-15',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 't2',
    staffId: 's1',
    title: 'Prepare mid-month revenue report',
    description: 'Provide breakdown of top 5 selling items and low-performing accessories.',
    dueDate: '2026-06-18',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 't3',
    staffId: 's2',
    title: 'Re-shelve Balogun beverages tier',
    description: 'Position Peak Milk and Lipton packs on high visibility spaces to accelerate slow inventory.',
    dueDate: '2026-06-14',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 't4',
    staffId: 's4',
    title: 'Audit Mile 12 storage humidity',
    description: 'Ensure safety protocols against dampness for the rice and semovita bags.',
    dueDate: '2026-06-13',
    priority: 'High',
    status: 'Pending',
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'r1',
    title: 'Mile 12 - Heavy Rain Impact Report',
    summary: 'Water got close to our main storage shelter. Luckily, all semovita and rice bags were safely elevated on wooden pallets. Recommended adding more plastic covers.',
    uploaderName: 'funke adebayo',
    branchName: 'Mile 12 Market',
    date: '2026-06-12',
  },
  {
    id: 'r2',
    title: 'Balogun Friday Evening Sales Rush Summary',
    summary: 'Tremendous traffic today on Milo and Sunlight detergent. Sold out on 6-pack Dettol soaps. Restocking request issued for Monday morning delivery.',
    uploaderName: 'amara beko',
    branchName: 'Balogun Market',
    date: '2026-06-12',
  },
  {
    id: 'r3',
    title: 'Computer Village Fast Accessories Count',
    summary: 'System records align perfectly with physical checks. Fast charger adapters are gaining serious momentum due to localized promotional activities.',
    uploaderName: 'abraham jesuwanu',
    branchName: 'Computer Village',
    date: '2026-06-11',
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    username: 'abraham jesuwanu',
    role: 'Staff',
    action: 'Recorded Sale',
    timestamp: '2026-06-12T14:30:22.000Z',
    details: 'Sold 10 Oraimo Powerbank 20000mAh worth ₦185,000 at Computer Village',
  },
  {
    id: 'act2',
    username: 'amara beko',
    role: 'Staff',
    action: 'Uploaded Report',
    timestamp: '2026-06-12T13:10:05.000Z',
    details: 'Uploaded "Balogun Friday Evening Sales Rush Summary"',
  },
  {
    id: 'act3',
    username: 'chinedu okafor',
    role: 'Staff',
    action: 'Updated Stock',
    timestamp: '2026-06-12T11:45:00.000Z',
    details: 'Increased Panasonic Standing Fan 16" count to 45 units at Alaba International',
  },
  {
    id: 'act4',
    username: 'System Admin (johnsonezekiel757@gmail.com)',
    role: 'Admin',
    action: 'Assigned Task',
    timestamp: '2026-06-12T09:15:30.000Z',
    details: 'Assigned "Audit Mile 12 storage humidity" to funke adebayo',
  }
];
