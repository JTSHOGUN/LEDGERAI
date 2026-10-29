import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Bot,
  CreditCard,
  FileText,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, invoices, addCustomer, setCurrentView, formatMoney } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tin, setTin] = useState('');

  const filteredCustomers = customers.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.tin && c.tin.includes(q))
      );
    }
    return true;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name,
      email,
      phone,
      address,
      tin: tin || undefined,
      preferredPaymentMethod: 'mobile_money_airtel',
      totalRevenue: 0,
      outstandingBalance: 0,
      invoiceCount: 0,
      averagePaymentDays: 14,
      creditStatus: 'good',
      aiInsight: 'New customer account initialized. Awaiting initial sales transaction.',
    });
    setIsNewCustomerOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setTin('');
  };

  const customerInvoices = selectedCustomer
    ? invoices.filter(i => i.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Customer Directory & Insights
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Client profiles, payment velocity, credit ratings, and AI collection insights
          </p>
        </div>

        <button
          onClick={() => setIsNewCustomerOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer name, email, TIN..."
            className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(cust => (
          <div
            key={cust.id}
            onClick={() => setSelectedCustomer(cust)}
            className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-stone-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{cust.name}</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">{cust.tin ? `TIN: ${cust.tin}` : 'No TIN registered'}</p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    cust.creditStatus === 'excellent'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : cust.creditStatus === 'overdue_risk'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  {cust.creditStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{cust.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{cust.phone}</span>
                </div>
              </div>

              {cust.aiInsight && (
                <div className="mt-4 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-700">
                  <div className="flex items-center gap-1 font-semibold text-stone-900 mb-0.5">
                    <Bot className="w-3 h-3 text-stone-600" /> Customer Payment Behavior
                  </div>
                  <p className="line-clamp-2">{cust.aiInsight}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-stone-400">Total Billed</p>
                <p className="font-mono font-bold text-stone-900">{formatMoney(cust.totalRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-stone-400">Outstanding</p>
                <p className={`font-mono font-bold ${cust.outstandingBalance > 0 ? 'text-red-700' : 'text-emerald-800'}`}>
                  {formatMoney(cust.outstandingBalance)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Profile Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-stone-950/50" />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-stone-200 flex flex-col">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div>
                  <h2 className="text-base font-bold text-stone-900">{selectedCustomer.name}</h2>
                  <p className="text-xs text-stone-500">Customer Profile & Audit</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-1.5 text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400">Total Lifetime Value</span>
                    <p className="text-lg font-bold font-mono text-stone-900 mt-0.5">
                      {formatMoney(selectedCustomer.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400">Current Balance Due</span>
                    <p className={`text-lg font-bold font-mono mt-0.5 ${selectedCustomer.outstandingBalance > 0 ? 'text-red-700' : 'text-emerald-800'}`}>
                      {formatMoney(selectedCustomer.outstandingBalance)}
                    </p>
                  </div>
                </div>

                {/* Behavioral Insight */}
                {selectedCustomer.aiInsight && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-900">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-stone-900">
                      <Bot className="w-4 h-4 text-stone-700" />
                      <span>LedgerAI Payment Intelligence</span>
                    </div>
                    <p className="leading-relaxed text-stone-700">{selectedCustomer.aiInsight}</p>
                    <div className="mt-2 text-[11px] text-stone-500">
                      Average Days to Settle: <strong>{selectedCustomer.averagePaymentDays} days</strong>
                    </div>
                  </div>
                )}

                {/* Customer Contact Details */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <p className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">Contact & Registration</p>
                  <p><strong className="text-stone-500">Email:</strong> {selectedCustomer.email}</p>
                  <p><strong className="text-stone-500">Phone:</strong> {selectedCustomer.phone}</p>
                  <p><strong className="text-stone-500">Address:</strong> {selectedCustomer.address}</p>
                  <p><strong className="text-stone-500">Tax ID (TIN):</strong> {selectedCustomer.tin || 'Not Registered'}</p>
                  <p><strong className="text-stone-500">Payment Channel:</strong> {selectedCustomer.preferredPaymentMethod.replace(/_/g, ' ').toUpperCase()}</p>
                </div>

                {/* Invoices History */}
                <div>
                  <h3 className="font-bold text-stone-900 mb-2">Invoice History</h3>
                  <div className="space-y-2">
                    {customerInvoices.length === 0 ? (
                      <p className="text-stone-400">No invoices on record for this customer.</p>
                    ) : (
                      customerInvoices.map(inv => (
                        <div key={inv.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
                          <div>
                            <p className="font-mono font-bold text-stone-900">{inv.invoiceNumber}</p>
                            <p className="text-[10px] text-stone-500">Due {inv.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-stone-900">{formatMoney(inv.total)}</p>
                            <span className="text-[10px] font-semibold text-stone-700 uppercase">{inv.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCurrentView('invoices');
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Create Invoice for Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isNewCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">Add New Customer</h2>
              <button onClick={() => setIsNewCustomerOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Customer / Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Entebbe Grand Hotel"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="procurement@hotel.ug"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone (MoMo / Airtel)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+256 701 ..."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Plot 18 Circular Road, Entebbe"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">URA TIN (Optional for EFRIS)</label>
                <input
                  type="text"
                  value={tin}
                  onChange={e => setTin(e.target.value)}
                  placeholder="10-digit URA TIN"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
