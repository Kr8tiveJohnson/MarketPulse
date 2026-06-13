export type UserRole = 'Admin' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number; // For low stock alert trigger
  purchasePrice: number; // For stock worth and profit margin calculations
  sellingPrice: number;
  branchId: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: string; // ISO String
  recordedBy: string; // Staff Name
  branchId: string;
  branchName: string;
}

export interface Market {
  id: string;
  name: string;
  location: string;
  staffCount: number;
  totalRevenue: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  branchId: string;
  branchName: string;
  status: 'Active' | 'Inactive';
  tasksCount: number;
  salesCount: number;
}

export interface Activity {
  id: string;
  username: string;
  role: UserRole;
  action: string;
  timestamp: string;
  details: string;
}

export interface Task {
  id: string;
  staffId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
}

export interface Report {
  id: string;
  title: string;
  summary: string;
  uploaderName: string;
  branchName: string;
  date: string;
}
