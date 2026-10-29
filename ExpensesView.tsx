import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Landmark,
  Layers
} from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { transactions, setCurrentView, formatMoney } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'business' | 'personal'>('all');
  const [search, setSearch] = useState('');

  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const filteredExpenses = expenseTransactions.filter(e => {
    if (filterType === 'business' && e.isPersonalFund) return false;
    if (filterType === 'personal' && !e.isPersonalFund) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.customerOrSupplier && e.customerOrSupplier.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalExpenseAmount = expenseTransactions
    .filter(e => !e.isPersonalFund)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Expense Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational expenses, supplier disbursements, and personal funds segregation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('scanner')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Receipt (AI OCR)</span>
          </button>
          <button
            onClick={() => setCurrentView('transactions')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Total Operating Expenses</span>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(totalExpenseAmount)}
          </p>
          <p className="text-[11px] text-emerald-800 mt-2 font-medium">
            ↓ 4.8% decrease vs prior month
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Tax Deductible Portion</span>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            96.8%
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Backed by digital OCR receipts
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Director Personal Drawings</span>
          <p className="text-2xl font-bold text-amber-800 mt-2 font-mono tabular-nums">
            UGX 320,000
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Isolated for URA income tax filing
          </p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter expenses by payee, category, memo..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
              filterType === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('business')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
              filterType === 'business' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Business Only
          </button>
          <button
            onClick={() => setFilterType('personal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
              filterType === 'personal' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Personal Drawings
          </button>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3">Date</th>
                <th className="p-3">Merchant / Payee</th>
                <th className="p-3">Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Tax Deduction</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono text-stone-500">{exp.date}</td>
                  <td className="p-3 font-semibold text-stone-900 truncate max-w-[160px]">
                    {exp.customerOrSupplier || 'General Vendor'}
                  </td>
                  <td className="p-3 text-stone-700 truncate max-w-[200px]">
                    {exp.description}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-semibold text-stone-600">
                      {exp.paymentMethod.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    {exp.isPersonalFund ? (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Non-Deductible (Personal)
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> URA Claimable
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-stone-900 tabular-nums">
                    {formatMoney(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
