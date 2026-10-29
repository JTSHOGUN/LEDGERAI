import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bill } from '../../types';
import {
  Plus,
  Search,
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  X
} from 'lucide-react';

export const BillsView: React.FC = () => {
  const { bills, suppliers, addBill, recordBillPayment, formatMoney } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [payAmount, setPayAmount] = useState('');

  // Form state
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const filteredBills = bills.filter(b => {
    if (search) {
      const q = search.toLowerCase();
      return b.billNumber.toLowerCase().includes(q) || b.supplierName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === supplierId) || suppliers[0];
    const total = parseFloat(amount);
    const subtotal = Math.round(total / 1.18);
    const taxTotal = total - subtotal;

    addBill({
      billNumber: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'approved',
      items: [
        {
          id: `bi-${Date.now()}`,
          description: desc,
          category: 'Cost of Produce Purchased',
          quantity: 1,
          unitPrice: subtotal,
          taxRate: 18,
          amount: subtotal,
        },
      ],
      subtotal,
      taxTotal,
      total,
      amountPaid: 0,
      balanceDue: total,
      currency: 'UGX',
    });

    setIsModalOpen(false);
    setDesc('');
    setAmount('');
  };

  const handlePayBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill || !payAmount) return;
    recordBillPayment(selectedBill.id, parseFloat(payAmount));
    setSelectedBill(null);
    setPayAmount('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Supplier Bills & Payables
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Accounts payable, invoice verification, and scheduled vendor settlements
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Supplier Bill</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bill number or supplier..."
            className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3">Bill Number</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBills.map(bill => (
                <tr key={bill.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono font-bold text-stone-900">{bill.billNumber}</td>
                  <td className="p-3 font-semibold text-stone-900">{bill.supplierName}</td>
                  <td className="p-3 font-mono text-stone-500">{bill.issueDate}</td>
                  <td className="p-3 font-mono text-stone-500">{bill.dueDate}</td>
                  <td className="p-3 text-right font-mono font-bold text-stone-900">
                    {formatMoney(bill.total)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-red-700">
                    {formatMoney(bill.balanceDue)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                      {bill.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {bill.balanceDue > 0 && (
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setPayAmount(bill.balanceDue.toString());
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded border border-emerald-200 cursor-pointer"
                      >
                        Disburse
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">Log Supplier Bill</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateBill} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Supplier</label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="e.g. Arabica Raw Parchment Lot #45"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Total (UGX)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="3100000"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Bill Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">Disburse Payment: {selectedBill.billNumber}</h2>
              <button onClick={() => setSelectedBill(null)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePayBillSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Amount to Disburse</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBill(null)}
                  className="px-3 py-1.5 text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Confirm Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
