import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice, InvoiceStatus, InvoiceLineItem } from '../../types';
import { PdfExportService } from '../../services/pdfExportService';
import {
  Plus,
  Search,
  FileText,
  Download,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Smartphone,
  Landmark,
  Eye,
  Bot,
  CreditCard,
  X,
  Share2,
  Trash2,
  Zap,
  RefreshCw,
  Check
} from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const {
    invoices,
    customers,
    currentOrg,
    addInvoice,
    recordInvoicePayment,
    sendInvoiceReminder,
    triggerStkPush,
    currencySymbol,
    formatMoney,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | InvoiceStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Invoice Modal State
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [items, setItems] = useState<Omit<InvoiceLineItem, 'id'>[]>([
    { description: 'Organic Bugisu Arabica AA (50kg Bag)', quantity: 2, unitPrice: 480000, taxRate: 18, amount: 960000 },
  ]);
  const [notes, setNotes] = useState('Thank you for choosing Kampala Fresh Supplies.');

  // Payment Recording Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money_airtel');

  // STK Push Instant Checkout Modal State
  const [isStkModalOpen, setIsStkModalOpen] = useState(false);
  const [stkGateway, setStkGateway] = useState<'airtel_moneypay' | 'mpesa'>('airtel_moneypay');
  const [stkPhone, setStkPhone] = useState('');
  const [isStkProcessing, setIsStkProcessing] = useState(false);

  // AI Reminder Modal State
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderTone, setReminderTone] = useState<'friendly' | 'professional' | 'firm'>('professional');

  const filteredInvoices = invoices.filter(inv => {
    if (activeTab !== 'all' && inv.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { description: 'Export Grade Hass Avocados (10kg Crate)', quantity: 10, unitPrice: 85000, taxRate: 0, amount: 850000 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.amount = (updated.quantity || 1) * (updated.unitPrice || 0);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxTotal = items.reduce((sum, item) => sum + Math.round(item.amount * (item.taxRate / 100)), 0);
  const grandTotal = subtotal + taxTotal;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId) || customers[0];
    const invoiceNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    addInvoice({
      invoiceNumber,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerPhone: cust.phone,
      customerAddress: cust.address,
      customerTin: cust.tin,
      issueDate,
      dueDate,
      status: 'sent',
      items: items.map((item, idx) => ({ ...item, id: `item-${idx}` })),
      subtotal,
      taxTotal,
      discountTotal: 0,
      total: grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      currency: 'UGX',
      notes,
      paymentInstructions: 'Pay via Airtel MoneyPay #887211, M-Pesa Till #904210 or Stanbic Bank A/C 9030018829410',
      mobileMoneyPaymentNumber: 'Airtel MoneyPay #887211 | M-Pesa Till #904210',
      bankAccountDetails: 'Stanbic Bank Uganda A/C 9030018829410',
      remindersSentCount: 0,
    });

    setIsNewInvoiceOpen(false);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !paymentAmount) return;

    recordInvoicePayment(selectedInvoice.id, parseFloat(paymentAmount), paymentMethod);
    setIsPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleTriggerStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || !stkPhone) return;

    setIsStkProcessing(true);
    await triggerStkPush({
      invoiceId: selectedInvoice.id,
      phoneNumber: stkPhone,
      amount: selectedInvoice.balanceDue,
      gateway: stkGateway,
    });
    setIsStkProcessing(false);
    setIsStkModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleSendReminderSubmit = () => {
    if (!selectedInvoice) return;
    sendInvoiceReminder(selectedInvoice.id, reminderTone);
    setIsReminderModalOpen(false);
  };

  const getReminderPreview = () => {
    if (!selectedInvoice) return '';
    if (reminderTone === 'friendly') {
      return `Hi ${selectedInvoice.customerName}, gentle reminder that invoice ${selectedInvoice.invoiceNumber} for ${formatMoney(selectedInvoice.balanceDue)} is due on ${selectedInvoice.dueDate}. You can conveniently pay via Airtel MoneyPay #887211 or M-Pesa Till #904210. Thank you!`;
    }
    if (reminderTone === 'firm') {
      return `URGENT NOTICE: Invoice ${selectedInvoice.invoiceNumber} for ${selectedInvoice.customerName} in the amount of ${formatMoney(selectedInvoice.balanceDue)} is OVERDUE. Please remit payment immediately via Airtel MoneyPay #887211, M-Pesa Till #904210, or Stanbic Bank EFT.`;
    }
    return `Dear Accounts Team at ${selectedInvoice.customerName}, this is a statement regarding outstanding invoice ${selectedInvoice.invoiceNumber} (${formatMoney(selectedInvoice.balanceDue)}). Due date: ${selectedInvoice.dueDate}. Please initiate settlement via Airtel MoneyPay or M-Pesa.`;
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Sales Invoices & Receivables
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            URA EFRIS e-invoices with instant Airtel MoneyPay & M-Pesa Daraja STK Push checkouts
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'sent', label: 'Sent' },
            { id: 'partially_paid', label: 'Partially Paid' },
            { id: 'paid', label: 'Paid' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'draft', label: 'Draft' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice # or client..."
            className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3">Invoice Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-stone-900 whitespace-nowrap">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-stone-900">{inv.customerName}</p>
                    <p className="text-[10px] text-stone-500">{inv.customerEmail}</p>
                  </td>
                  <td className="p-3 font-mono text-stone-500 whitespace-nowrap">{inv.issueDate}</td>
                  <td className="p-3 font-mono text-stone-500 whitespace-nowrap">
                    <span className={inv.status === 'overdue' ? 'text-red-800 font-bold' : ''}>
                      {inv.dueDate}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-stone-900 tabular-nums whitespace-nowrap">
                    {formatMoney(inv.total)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                    <span className={inv.balanceDue > 0 ? 'text-amber-800' : 'text-emerald-800'}>
                      {formatMoney(inv.balanceDue)}
                    </span>
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : inv.status === 'overdue'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : inv.status === 'partially_paid'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-stone-100 text-stone-800 border border-stone-200'
                      }`}
                    >
                      {inv.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* PDF Export */}
                      <button
                        onClick={() => PdfExportService.exportInvoicePdf(inv, currentOrg)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Payment Reminder */}
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsReminderModalOpen(true);
                          }}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md cursor-pointer"
                          title="Send Payment Reminder"
                        >
                          <Bot className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* STK Push Instant Checkout (Airtel MoneyPay / M-Pesa) */}
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setStkPhone(inv.customerPhone || '+256 701 554 892');
                            setIsStkModalOpen(true);
                          }}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded text-[11px] font-semibold border border-amber-200 flex items-center gap-1 cursor-pointer"
                          title="Trigger Airtel MoneyPay or M-Pesa STK Push"
                        >
                          <Zap className="w-3 h-3 text-amber-800" />
                          <span>STK Push</span>
                        </button>
                      )}

                      {/* Record Manual Payment */}
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setPaymentAmount(inv.balanceDue.toString());
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-2 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STK Push Live Modal (Airtel MoneyPay & M-Pesa) */}
      {isStkModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-700 text-white">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Instant Mobile Money Checkout</h2>
                  <p className="text-[10px] text-stone-500">Live STK push prompt directly to customer handset</p>
                </div>
              </div>
              <button onClick={() => setIsStkModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTriggerStkPush} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-2">Select Gateway Rail</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStkGateway('airtel_moneypay')}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      stkGateway === 'airtel_moneypay'
                        ? 'border-red-700 bg-red-50/70 text-red-950 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded bg-red-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      AIR
                    </div>
                    <div>
                      <p className="font-bold">Airtel MoneyPay</p>
                      <p className="text-[10px] text-stone-500">Till #887211</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStkGateway('mpesa')}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      stkGateway === 'mpesa'
                        ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      M
                    </div>
                    <div>
                      <p className="font-bold">M-Pesa Daraja</p>
                      <p className="text-[10px] text-stone-500">Till #904210</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Customer Phone Number</label>
                <input
                  type="text"
                  value={stkPhone}
                  onChange={e => setStkPhone(e.target.value)}
                  placeholder="+256 701 554 892"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                  required
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center font-mono">
                <span className="font-sans text-stone-600">Amount to Push:</span>
                <span className="text-base font-bold text-stone-900">{formatMoney(selectedInvoice.balanceDue)}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStkModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isStkProcessing}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isStkProcessing ? 'animate-spin' : ''}`} />
                  <span>{isStkProcessing ? 'Waiting for PIN Authorization...' : 'Send STK Prompt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h2 className="text-sm font-bold text-stone-900">New Sales Tax Invoice</h2>
                <p className="text-xs text-stone-500">URA EFRIS-compliant electronic tax invoice</p>
              </div>
              <button
                onClick={() => setIsNewInvoiceOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Customer</label>
                  <select
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={e => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
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

              {/* Line Items */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">Line Items</label>
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Item name & specs"
                        className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-xs"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="Qty"
                        className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-xs"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={e => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-xs font-mono"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={item.taxRate}
                        onChange={e => handleItemChange(idx, 'taxRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-1 py-1.5 bg-white border border-stone-300 rounded text-xs"
                      >
                        <option value={18}>18% VAT</option>
                        <option value={0}>0% Exempt</option>
                      </select>
                    </div>
                    <div className="col-span-1 text-center">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-stone-400 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Item
                </button>
              </div>

              {/* Totals Breakdown */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5 max-w-xs ml-auto font-medium">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono text-stone-900">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>VAT (18%):</span>
                  <span className="font-mono text-stone-900">{formatMoney(taxTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-200 pt-1.5">
                  <span>Total Amount:</span>
                  <span className="font-mono text-stone-900">{formatMoney(grandTotal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Notes & Payment Instructions</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  rows={2}
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">
                Record Payment for {selectedInvoice.invoiceNumber}
              </h2>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Amount Received (UGX)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  max={selectedInvoice.balanceDue}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold"
                  required
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Remaining balance: {formatMoney(selectedInvoice.balanceDue)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  <option value="mobile_money_airtel">Airtel MoneyPay Gateway</option>
                  <option value="mobile_money_mpesa">Safaricom / Vodacom M-Pesa</option>
                  <option value="mobile_money_mtn">MTN Mobile Money Till</option>
                  <option value="bank_transfer">Stanbic Bank EFT</option>
                  <option value="cash">Cash Settlement</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Reminder Modal with 3 Tone Options */}
      {isReminderModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-stone-700" />
                <h2 className="text-sm font-bold text-stone-900">Payment Reminder Generator</h2>
              </div>
              <button
                onClick={() => setIsReminderModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">Select Reminder Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['friendly', 'professional', 'firm'] as const).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setReminderTone(tone)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                        reminderTone === tone
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-900 shadow-2xs'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Generated Message Preview</label>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans">
                  {getReminderPreview()}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                <span>Dispatches via WhatsApp & SMS to {selectedInvoice.customerPhone || 'Customer Phone'}</span>
                <button
                  onClick={handleSendReminderSubmit}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
