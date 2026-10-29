import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType, PaymentMethod, ReconciliationStatus } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Smartphone,
  Landmark,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
  Check,
  ChevronDown
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    accounts,
    addTransaction,
    deleteTransaction,
    bulkCategorizeTransactions,
    bulkReconcileTransactions,
    currencySymbol,
    formatMoney,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add Transaction Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txCategory, setTxCategory] = useState('Transport & Fleet Fuel Expense');
  const [txAccount, setTxAccount] = useState('acc-1010'); // Stanbic
  const [txMethod, setTxMethod] = useState<PaymentMethod>('mobile_money_airtel');
  const [txCustomerOrSup, setTxCustomerOrSup] = useState('');
  const [isPersonal, setIsPersonal] = useState(false);

  // Bulk categorization modal
  const [bulkCategory, setBulkCategory] = useState('Cost of Produce Purchased');
  const [isBulkCatOpen, setIsBulkCatOpen] = useState(false);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (selectedType !== 'all' && tx.type !== selectedType) return false;
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && tx.status !== selectedStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          (tx.customerOrSupplier && tx.customerOrSupplier.toLowerCase().includes(q)) ||
          (tx.referenceNumber && tx.referenceNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [transactions, selectedType, selectedCategory, selectedStatus, search]);

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTransactions.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDesc || !txAmount) return;

    const parsedAmount = parseFloat(txAmount);
    const debitAcc = txType === 'income' ? txAccount : 'acc-5100';
    const creditAcc = txType === 'income' ? 'acc-4010' : txAccount;

    addTransaction({
      date: txDate,
      description: txDesc,
      amount: parsedAmount,
      currency: 'UGX',
      type: txType,
      debitAccountId: debitAcc,
      creditAccountId: creditAcc,
      category: txCategory,
      customerOrSupplier: txCustomerOrSup || undefined,
      paymentMethod: txMethod,
      status: 'reconciled',
      aiClassification: {
        category: txCategory,
        confidence: 98,
        isAnomaly: false,
        suggestedTaxDeductible: !isPersonal,
      },
      isPersonalFund: isPersonal,
      referenceNumber: `MAN-${Date.now().toString().slice(-6)}`,
    });

    setIsModalOpen(false);
    setTxDesc('');
    setTxAmount('');
  };

  const exportCsv = () => {
    const headers = ['Date', 'Description', 'Category', 'Customer/Supplier', 'Type', 'Amount', 'Payment Method', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.customerOrSupplier || ''}"`,
      t.type,
      t.amount,
      t.paymentMethod,
      t.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Double-Entry Transactions
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit-grade journal entries with native mobile money fees and automated classifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search description, payee, reference number..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income (Inflows)</option>
            <option value="expense">Expenses (Outflows)</option>
            <option value="transfer">Internal Transfers</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none max-w-xs truncate"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="reconciled">Reconciled</option>
            <option value="unreconciled">Unreconciled</option>
          </select>
        </div>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 bg-stone-100 border border-stone-300 rounded-lg flex items-center justify-between text-xs animate-fadeIn">
            <span className="font-semibold text-stone-900">
              {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => bulkReconcileTransactions(selectedIds)}
                className="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded-md font-semibold hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Mark Reconciled
              </button>
              <button
                onClick={() => setIsBulkCatOpen(true)}
                className="px-2.5 py-1 bg-white border border-stone-300 text-stone-800 rounded-md font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Categorize
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-stone-500 hover:text-stone-800 text-xs px-2 cursor-pointer"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length > 0 && selectedIds.length === filteredTransactions.length}
                    className="rounded text-emerald-800 focus:ring-emerald-800"
                  />
                </th>
                <th className="p-3">Date</th>
                <th className="p-3">Description & Reference</th>
                <th className="p-3">Category</th>
                <th className="p-3">Payment Channel</th>
                <th className="p-3">Ledger Status</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Reconciliation</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-500">
                    <p className="font-semibold text-stone-700">No transactions match your search</p>
                    <p className="text-xs text-stone-400 mt-1">Try resetting filters or adding a new transaction.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr
                    key={tx.id}
                    className={`hover:bg-stone-50 transition-colors ${
                      selectedIds.includes(tx.id) ? 'bg-stone-100/50' : ''
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(tx.id)}
                        onChange={() => handleSelectOne(tx.id)}
                        className="rounded text-emerald-800 focus:ring-emerald-800"
                      />
                    </td>
                    <td className="p-3 font-mono text-stone-600 whitespace-nowrap">{tx.date}</td>
                    <td className="p-3 max-w-[220px]">
                      <p className="font-semibold text-stone-900 truncate">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400">
                        {tx.referenceNumber && <span>Ref: {tx.referenceNumber}</span>}
                        {tx.isPersonalFund && (
                          <span className="text-amber-800 bg-amber-50 px-1 rounded border border-amber-200">
                            Personal Drawing
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-stone-700 truncate max-w-[150px]">{tx.category}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {tx.paymentMethod.includes('mobile_money') ? (
                          <Smartphone className="w-3 h-3 text-emerald-800" />
                        ) : (
                          <Landmark className="w-3 h-3 text-stone-700" />
                        )}
                        {tx.paymentMethod.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      {tx.aiClassification ? (
                        <div>
                          <div className="flex items-center gap-1 text-[11px]">
                            <Bot className="w-3 h-3 text-stone-600" />
                            <span className="font-semibold text-stone-800">
                              {tx.aiClassification.category}
                            </span>
                          </div>
                          {tx.aiClassification.isAnomaly && (
                            <span className="inline-block mt-0.5 text-[10px] font-semibold text-red-800 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                              {tx.aiClassification.anomalyReason || 'Audit Flag'}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Manual Entry</span>
                      )}
                    </td>
                    <td className={`p-3 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-800' : 'text-stone-900'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'} {formatMoney(tx.amount)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Reconciled
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-stone-400 hover:text-red-700 p-1 rounded hover:bg-stone-100 cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer totals */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
          <span>Showing {filteredTransactions.length} of {transactions.length} entries</span>
          <span className="font-medium text-stone-700">
            Filtered Total: <strong className="font-mono text-stone-900">{formatMoney(filteredTransactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0))}</strong>
          </span>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Record Transaction</h2>
                <p className="text-xs text-stone-500">Double-entry accounting journal entry</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Type</label>
                  <select
                    value={txType}
                    onChange={e => setTxType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="expense">Expense (Outflow)</option>
                    <option value="income">Income (Inflow)</option>
                    <option value="transfer">Internal Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={e => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description / Memo</label>
                <input
                  type="text"
                  value={txDesc}
                  onChange={e => setTxDesc(e.target.value)}
                  placeholder="e.g. Fuel for delivery van UBA 441Z"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Amount (UGX)</label>
                  <input
                    type="number"
                    value={txAmount}
                    onChange={e => setTxAmount(e.target.value)}
                    placeholder="380000"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method</label>
                  <select
                    value={txMethod}
                    onChange={e => setTxMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="mobile_money_airtel">Airtel MoneyPay (Till #887211)</option>
                    <option value="mobile_money_mpesa">M-Pesa Daraja (Till #904210)</option>
                    <option value="mobile_money_mtn">MTN Mobile Money (Till #654210)</option>
                    <option value="bank_transfer">Stanbic Bank Transfer (EFT)</option>
                    <option value="cash">Petty Cash Float</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={e => setTxCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs truncate"
                  >
                    <option value="Transport & Fleet Fuel Expense">Transport & Fleet Fuel Expense</option>
                    <option value="Cost of Produce Purchased">Cost of Produce Purchased</option>
                    <option value="Staff Salaries & Casual Wages">Staff Salaries & Casual Wages</option>
                    <option value="Warehouse Rent & Electricity (Umeme)">Warehouse Rent & Electricity</option>
                    <option value="Packaging Bags & Wooden Crates">Packaging Bags & Crates</option>
                    <option value="Mobile Money & Banking Fees">Mobile Money & Banking Fees</option>
                    <option value="Fresh Produce Wholesale Sales">Fresh Produce Wholesale Sales</option>
                    <option value="Cold Storage & Logistics Services">Cold Storage & Logistics Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Funding Account</label>
                  <select
                    value={txAccount}
                    onChange={e => setTxAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs truncate"
                  >
                    {accounts.filter(a => a.subtype === 'cash_and_bank' || a.subtype === 'mobile_money').map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal funds toggle (Crucial African SME feature) */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPersonal}
                    onChange={e => setIsPersonal(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-800"
                  />
                  <span>Director Personal Drawing / Non-Business Expense</span>
                </label>
                <p className="text-[10px] text-stone-500 mt-0.5 pl-5">
                  Segregates personal drawings from tax deductions while keeping cash ledger balanced.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Category Modal */}
      {isBulkCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-sm bg-white rounded-xl p-5 border border-stone-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Bulk Categorize ({selectedIds.length} items)</h3>
            <select
              value={bulkCategory}
              onChange={e => setBulkCategory(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
            >
              <option value="Cost of Produce Purchased">Cost of Produce Purchased</option>
              <option value="Transport & Fleet Fuel Expense">Transport & Fleet Fuel Expense</option>
              <option value="Packaging Bags & Wooden Crates">Packaging Bags & Wooden Crates</option>
              <option value="Staff Salaries & Casual Wages">Staff Salaries & Casual Wages</option>
              <option value="Mobile Money & Banking Fees">Mobile Money & Banking Fees</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBulkCatOpen(false)}
                className="px-3 py-1.5 text-xs text-stone-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  bulkCategorizeTransactions(selectedIds, bulkCategory);
                  setIsBulkCatOpen(false);
                  setSelectedIds([]);
                }}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Apply Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
