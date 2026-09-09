// User types based on Prisma schema
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: 'USER' | 'ADMIN' | 'ANALYST';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string;
}

export interface Operation {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: Date;
  category: Category;
  bank: Bank;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface Report {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
