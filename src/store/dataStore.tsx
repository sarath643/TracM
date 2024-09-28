import { create } from 'zustand';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

interface IncomeExpenseEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
}

interface IncomeExpenseData {
  entries: IncomeExpenseEntry[];
  setEntries: (entries: IncomeExpenseEntry[]) => void;
  addEntry: (entry: Omit<IncomeExpenseEntry, 'id'>) => Promise<{ status: number; error?: string }>;
  deleteEntry: (id: string) => Promise<{ status: number; error?: string }>;
}

// const mockData: IncomeExpenseEntry[] = [
//   { id: 'abcsdd', date: '2024-09-01', type: 'income', category: 'Salary', amount: 5000 },
//   { id: 'asdscsdd', date: '2024-09-02', type: 'expense', category: 'Rent', amount: 1000 },
//   { id: 'xyz123', date: '2024-09-03', type: 'income', category: 'Freelance', amount: 1500 },
//   { id: 'lmn456', date: '2024-09-04', type: 'expense', category: 'Groceries', amount: 300 },
//   { id: 'pqr789', date: '2024-09-05', type: 'income', category: 'Investment', amount: 2000 },
//   { id: 'stu012', date: '2024-09-06', type: 'expense', category: 'Utilities', amount: 150 },
//   { id: 'vwx345', date: '2024-09-07', type: 'income', category: 'Bonus', amount: 800 },
//   { id: 'abc678', date: '2024-09-08', type: 'expense', category: 'Entertainment', amount: 200 },
// ];

export const useIncomeExpenseStore = create<IncomeExpenseData>()((set) => ({
  entries: [],
  setEntries: (entries: IncomeExpenseEntry[]) => set({ entries }),
  addEntry: async (entry: Omit<IncomeExpenseEntry, 'id'>) => {
    const user = auth.currentUser;
    if (!user) {
      return { status: 400, error: 'No user logged in' };
    }
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'income-expense'), entry);
      set((state) => ({ entries: [...state.entries, { ...entry, id: docRef.id }] }));
      return { status: 200 };
    } catch (error) {
      return { status: 400, error: (error as Error)?.message };
    }
  },

  deleteEntry: async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      return { status: 400, error: 'No user logged in' };
    }
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'income-expense', id));
      set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) }));
      return { status: 200 };
    } catch (error) {
      return { status: 400, error: (error as Error)?.message };
    }
  },
}));
