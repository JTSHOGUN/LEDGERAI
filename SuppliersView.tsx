import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  Bot,
  Receipt,
  X,
  CreditCard
} from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, formatMoney } = useApp();
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tin, setTin] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');

  const filteredSuppliers = suppliers.filter(s => {
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      name,
      email,
      phone,
      address,
      tin: tin || undefined,
      paymentTerms,
      totalPurchases: 0,
      outstandingBills: 0,
      billsCount: 0,
      aiInsight: 'New vendor account registered. Ready to track purchase orders and bills.',
    });
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setTin('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Suppliers & Vendors
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Vendor profiles, credit terms, cumulative purchases, and procurement history
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search supplier, email, TIN..."
            className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredSuppliers.map(sup => (
          <div
            key={sup.id}
            onClick={() => setSelectedSupplier(sup)}
            className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-stone-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{sup.name}</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Terms: <strong className="text-stone-700">{sup.paymentTerms}</strong> · {sup.tin ? `TIN: ${sup.tin}` : 'No TIN'}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                  {sup.billsCount} Bills
                </span>
              </div>

              <div className="mt-4 space-y-1 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{sup.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{sup.phone}</span>
                </div>
              </div>

              {sup.aiInsight && (
                <div className="mt-4 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-700">
                  <div className="flex items-center gap-1 font-semibold text-stone-900 mb-0.5">
                    <Bot className="w-3 h-3 text-stone-600" /> Vendor Insights
                  </div>
                  <p>{sup.aiInsight}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-stone-400">Total Purchases</p>
                <p className="font-mono font-bold text-stone-900">{formatMoney(sup.totalPurchases)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-stone-400">Outstanding Payables</p>
                <p className={`font-mono font-bold ${sup.outstandingBills > 0 ? 'text-amber-800' : 'text-stone-900'}`}>
                  {formatMoney(sup.outstandingBills)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">Add Supplier</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSupplier} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mukwano Agro Processors Ltd"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Prepaid">Prepaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">URA TIN</label>
                  <input
                    type="text"
                    value={tin}
                    onChange={e => setTin(e.target.value)}
                    placeholder="10-digit TIN"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Physical Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Plot 4 8th Street Industrial Area"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
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
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
