import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BankAccountItem, BankFeedItem } from '../../types';
import { AfricanBank, AFRICAN_BANKS_CATALOG } from '../../data/africanBanks';
import { BankIntegrationService, ParsedStatementTransaction } from '../../services/bankIntegrationService';
import {
  Landmark,
  Smartphone,
  Plus,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  CreditCard,
  X,
  Upload,
  ArrowRightLeft,
  Search,
  Filter,
  FileText,
  Sliders,
  ShieldCheck,
  Check,
  Trash2,
  ExternalLink,
  Zap,
  Globe2,
  Lock,
  Calendar,
  AlertCircle,
  Coins
} from 'lucide-react';

export const BankingView: React.FC = () => {
  const {
    bankAccounts,
    bankFeed,
    bankFeedRules,
    accounts,
    connectBankAccount,
    disconnectBankAccount,
    syncBankAccount,
    importStatementTransactions,
    executeBankTransfer,
    addBankFeedRule,
    deleteBankFeedRule,
    toggleBankFeedRule,
    setCurrentView,
    addToast,
    formatMoney,
    currencySymbol,
  } = useApp();

  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [feedSearch, setFeedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unmatched' | 'matched'>('all');

  // Connect African Bank Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [bankSearch, setBankSearch] = useState('');
  const [selectedBank, setSelectedBank] = useState<AfricanBank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('Kampala Fresh Supplies Ltd');
  const [initialBalance, setInitialBalance] = useState('18500000');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Statement Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [targetAccountId, setTargetAccountId] = useState(bankAccounts[0]?.id || '');
  const [statementFile, setStatementFile] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<ParsedStatementTransaction[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'mt940' | 'ofx' | 'camt053'>('csv');

  // Float Sweep Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [fromAccountId, setFromAccountId] = useState(bankAccounts.find(b => b.type === 'bank')?.id || accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(bankAccounts.find(b => b.type === 'mobile_money')?.id || accounts[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');
  const [tariffFee, setTariffFee] = useState('1500');
  const [transferMemo, setTransferMemo] = useState('Weekly working capital float sweep to Airtel MoneyPay');

  // Feed Rules Modal State
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleConditionValue, setNewRuleConditionValue] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState('Transport & Fleet Fuel Expense');
  const [newRuleAutoReconcile, setNewRuleAutoReconcile] = useState(true);

  // Filtered African Banks
  const filteredBanks = AFRICAN_BANKS_CATALOG.filter(b => {
    if (selectedCountry !== 'all' && b.country !== selectedCountry) return false;
    if (bankSearch) {
      const q = bankSearch.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.shortName.toLowerCase().includes(q) ||
        b.swiftBic.toLowerCase().includes(q) ||
        b.countryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Bank Feed Stream
  const filteredFeed = bankFeed.filter(feed => {
    if (selectedAccountId !== 'all' && feed.accountId !== selectedAccountId) return false;
    if (statusFilter !== 'all' && feed.reconciliationStatus !== statusFilter) return false;
    if (feedSearch) {
      const q = feedSearch.toLowerCase();
      return (
        feed.description.toLowerCase().includes(q) ||
        feed.reference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      addToast({
        type: 'success',
        title: 'All Feeds Synchronized',
        message: 'Checked 4 connected institutions via Open Banking & Direct SFTP. Feeds up to date.',
      });
    }, 1200);
  };

  const handleConnectBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) return;

    setIsAuthorizing(true);
    const result = await BankIntegrationService.connectOpenBanking(
      selectedBank,
      accountNumber,
      accountHolder,
      parseFloat(initialBalance) || 0,
      'org-01'
    );

    connectBankAccount(result.account, result.initialFeed);
    setIsAuthorizing(false);
    setIsConnectModalOpen(false);
    setSelectedBank(null);
    setAccountNumber('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatementFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const parsed = BankIntegrationService.parseStatementFile(content, file.name);
      setParsedPreview(parsed);
    };
    reader.readAsText(file);
  };

  const loadSampleStatement = (format: 'csv' | 'mt940' | 'ofx' | 'camt053') => {
    setSelectedFormat(format);
    const sample = BankIntegrationService.generateSimulatedStatementTransactions();
    setParsedPreview(sample);
  };

  const handleCommitImport = () => {
    if (parsedPreview.length === 0) return;
    importStatementTransactions(targetAccountId, parsedPreview);
    setIsImportModalOpen(false);
    setStatementFile(null);
    setParsedPreview([]);
  };

  const handleExecuteTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    const fee = parseFloat(tariffFee) || 0;
    if (!amt || amt <= 0) return;

    executeBankTransfer(fromAccountId, toAccountId, amt, fee, transferMemo);
    setIsTransferModalOpen(false);
    setTransferAmount('');
  };

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRuleConditionValue) return;

    addBankFeedRule({
      name: newRuleName,
      conditionField: 'description',
      conditionValue: newRuleConditionValue,
      actionCategory: newRuleCategory,
      autoReconcile: newRuleAutoReconcile,
      isActive: true,
    });

    setNewRuleName('');
    setNewRuleConditionValue('');
  };

  const totalBankBalance = bankAccounts
    .filter(b => b.type === 'bank')
    .reduce((sum, b) => sum + b.balance, 0);

  const totalMomoBalance = bankAccounts
    .filter(b => b.type === 'mobile_money')
    .reduce((sum, b) => sum + b.balance, 0);

  const totalCashBalance = bankAccounts
    .filter(b => b.type === 'cash')
    .reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              African Banking & Open Feeds
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-300">
              Open Banking API & MT940
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Seamless integration with commercial banks across Uganda, Kenya, Tanzania, Rwanda, Nigeria, Ghana, and South Africa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentView('crypto')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/10 hover:bg-purple-900/20 text-purple-950 border border-purple-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 text-purple-800" />
            <span>Crypto Treasury</span>
          </button>

          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Feed Rules ({bankFeedRules.filter(r => r.isActive).length})</span>
          </button>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Bank-MoMo Transfer</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Statement</span>
          </button>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect African Bank</span>
          </button>
        </div>
      </div>

      {/* Account Categories Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Commercial Banks</span>
            <div className="p-1.5 rounded-lg bg-stone-100 text-stone-800">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(totalBankBalance)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>{bankAccounts.filter(b => b.type === 'bank').length} Live Bank Feeds</span>
            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Auto-Sync
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Mobile Money Tills</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-2 font-mono tabular-nums">
            {formatMoney(totalMomoBalance)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>Airtel · M-Pesa · MTN</span>
            <span className="text-stone-700 font-mono font-medium">Real-time Push</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Petty Cash & Floats</span>
            <div className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(totalCashBalance)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>Office Vault Box</span>
            <span className="text-stone-600">Reconciled Weekly</span>
          </div>
        </div>
      </div>

      {/* Connected Accounts Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Connected Accounts ({bankAccounts.length})
          </h2>

          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Refreshing Feeds...' : 'Refresh All'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bankAccounts.map(acc => (
            <div
              key={acc.id}
              className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-stone-100 text-stone-800 border border-stone-200">
                      {acc.type === 'mobile_money' ? (
                        <Smartphone className="w-5 h-5 text-emerald-800" />
                      ) : acc.type === 'bank' ? (
                        <Landmark className="w-5 h-5 text-stone-900" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-stone-700" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">{acc.name}</h3>
                      <p className="text-[10px] text-stone-500">{acc.institution}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Live
                  </span>
                </div>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">Available Balance</p>
                    <span className="text-[10px] font-mono font-semibold text-stone-600">{acc.currency}</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-stone-900 mt-0.5 tabular-nums">
                    {formatMoney(acc.balance, acc.currency)}
                  </p>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Account:</span>
                    <span className="font-mono text-stone-800 font-medium">{acc.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Account Holder:</span>
                    <span className="text-stone-800 truncate max-w-[170px]">{acc.accountHolder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Last Synced:</span>
                    <span className="text-stone-700 font-mono text-[11px]">
                      {new Date(acc.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => syncBankAccount(acc.id)}
                  className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Sync Feed
                </button>

                <button
                  onClick={() => setCurrentView('reconciliation')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  Reconcile <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Bank Statement Feed Stream */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Live Bank & Mobile Money Statement Feed ({filteredFeed.length} Items)
            </h2>
            <p className="text-xs text-stone-500">
              Raw statement entries ingested via Open Banking APIs, MT940 files, and MoMo merchant webhooks
            </p>
          </div>

          {/* Feed Filter controls */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedAccountId}
              onChange={e => setSelectedAccountId(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
            >
              <option value="all">All Accounts</option>
              {bankAccounts.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="unmatched">Unmatched</option>
              <option value="matched">Matched</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={feedSearch}
                onChange={e => setFeedSearch(e.target.value)}
                placeholder="Filter description..."
                className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 w-48 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-3">Posting Date</th>
                  <th className="p-3">Bank / Statement Description</th>
                  <th className="p-3">Reference / SWIFT</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3 text-right">Inflow / Outflow</th>
                  <th className="p-3 text-center">Match Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredFeed.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No feed items match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFeed.map(feed => (
                    <tr key={feed.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono text-stone-500 whitespace-nowrap">{feed.date}</td>
                      <td className="p-3 font-mono font-medium text-stone-800 max-w-sm truncate">
                        {feed.description}
                      </td>
                      <td className="p-3 font-mono text-stone-500 whitespace-nowrap">{feed.reference}</td>
                      <td className="p-3 text-stone-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200">
                          {feed.channel || 'Open Banking API'}
                        </span>
                      </td>
                      <td className={`p-3 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                        feed.amount > 0 ? 'text-emerald-800' : 'text-stone-900'
                      }`}>
                        {feed.amount > 0 ? '+' : ''} {formatMoney(feed.amount)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            feed.reconciliationStatus === 'matched'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {feed.reconciliationStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setCurrentView('reconciliation')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-stone-100 border border-stone-300 rounded text-stone-800 cursor-pointer"
                        >
                          Match
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CONNECT AFRICAN BANK MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-800 text-white">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Connect African Bank Account</h2>
                  <p className="text-xs text-stone-500">
                    Open Banking API direct integration across East, West, Central and Southern Africa
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsConnectModalOpen(false);
                  setSelectedBank(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!selectedBank ? (
              /* Step 1: Select Bank from African Catalog */
              <div className="p-5 space-y-4">
                {/* Country Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'All Africa' },
                    { id: 'UG', label: 'Uganda (UG)' },
                    { id: 'KE', label: 'Kenya (KE)' },
                    { id: 'TZ', label: 'Tanzania (TZ)' },
                    { id: 'RW', label: 'Rwanda (RW)' },
                    { id: 'NG', label: 'Nigeria (NG)' },
                    { id: 'GH', label: 'Ghana (GH)' },
                    { id: 'ZA', label: 'South Africa (ZA)' },
                    { id: 'ZM', label: 'Zambia (ZM)' },
                    { id: 'ET', label: 'Ethiopia (ET)' },
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCountry(c.id)}
                      className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCountry === c.id
                          ? 'bg-stone-900 text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Bank Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={bankSearch}
                    onChange={e => setBankSearch(e.target.value)}
                    placeholder="Search bank name, SWIFT BIC (e.g. Stanbic, Equity, KCB, Absa, GTBank, CRDB, FNB)..."
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                {/* Bank Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pt-1">
                  {filteredBanks.map(b => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBank(b);
                        setAccountNumber(`${b.clearingCode}0300188${Math.floor(1000 + Math.random() * 9000)}`);
                      }}
                      className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-emerald-800 rounded-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-stone-900">{b.name}</h4>
                            <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                              SWIFT: <strong className="text-stone-700">{b.swiftBic}</strong> · {b.countryName} ({b.currency})
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-stone-800 border border-stone-200">
                            {b.currency}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-2 leading-tight">{b.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="font-mono text-emerald-800 font-semibold">{b.instantEftRail}</span>
                        <span className="font-semibold text-stone-800 flex items-center gap-0.5">
                          Select <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 2: Open Banking Handshake & Account Details */
              <form onSubmit={handleConnectBankSubmit} className="p-5 space-y-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-xs">
                      {selectedBank.currency}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{selectedBank.name}</h3>
                      <p className="text-[11px] text-stone-500">
                        {selectedBank.countryName} · SWIFT: {selectedBank.swiftBic} · Rail: {selectedBank.instantEftRail}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBank(null)}
                    className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                  >
                    Change Bank
                  </button>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lock className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Bank-Grade 256-bit TLS Open Banking Handshake</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Read-only statement access via {selectedBank.openBankingProvider.replace(/_/g, ' ').toUpperCase()}. No credentials stored.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Account Number / IBAN</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="e.g. 9030018829410"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Account Holder Legal Name</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={e => setAccountHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Opening Ledger Balance ({selectedBank.currency})</label>
                    <input
                      type="number"
                      value={initialBalance}
                      onChange={e => setInitialBalance(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Sync Frequency</label>
                    <select className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs">
                      <option value="realtime">Real-time Webhook Push</option>
                      <option value="every_4_hours">Every 4 Hours</option>
                      <option value="daily">Daily at 06:00 UTC</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBank(null)}
                    className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isAuthorizing}
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuthorizing ? 'animate-spin' : ''}`} />
                    <span>{isAuthorizing ? 'Authorizing with Bank API...' : 'Authorize & Connect Feed'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* IMPORT BANK STATEMENT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-stone-900 text-white">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Import Bank Statement File</h2>
                  <p className="text-xs text-stone-500">Supports MT940, OFX, CAMT.053 (ISO 20022), CSV & PDF</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setParsedPreview([]);
                  setStatementFile(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Destination Bank Account</label>
                <select
                  value={targetAccountId}
                  onChange={e => setTargetAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  {bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.accountNumber}) - {b.institution}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-xl p-6 text-center bg-stone-50/50 transition-colors">
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="font-semibold text-stone-800">
                  {statementFile ? statementFile.name : 'Drag & drop bank statement file or click to browse'}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Accepts .CSV, .MT940, .OFX, .QFX, .XML (CAMT.053), or .PDF
                </p>
                <input
                  type="file"
                  accept=".csv,.txt,.mt940,.ofx,.qfx,.xml,.pdf"
                  onChange={handleFileSelect}
                  className="mt-3 text-xs text-stone-600"
                />
              </div>

              {/* Sample Statement Generators for instant testing */}
              <div className="pt-2">
                <p className="font-semibold text-stone-700 mb-2">Or load simulated statement template:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => loadSampleStatement('csv')}
                    className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-center font-semibold text-stone-800 cursor-pointer"
                  >
                    Stanbic CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleStatement('mt940')}
                    className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-center font-semibold text-stone-800 cursor-pointer"
                  >
                    SWIFT MT940
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleStatement('ofx')}
                    className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-center font-semibold text-stone-800 cursor-pointer"
                  >
                    Open OFX
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleStatement('camt053')}
                    className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-center font-semibold text-stone-800 cursor-pointer"
                  >
                    CAMT.053 XML
                  </button>
                </div>
              </div>

              {/* Parsed Preview Table */}
              {parsedPreview.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900">
                      Parsed Statement Entries ({parsedPreview.length} Transactions)
                    </h4>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Ready to Ingest
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-lg">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-600">
                        <tr>
                          <th className="p-2">Date</th>
                          <th className="p-2">Description</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-mono">
                        {parsedPreview.map((p, idx) => (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="p-2 whitespace-nowrap text-stone-600">{p.date}</td>
                            <td className="p-2 truncate max-w-[240px] text-stone-800">{p.description}</td>
                            <td className={`p-2 text-right font-bold ${p.amount > 0 ? 'text-emerald-800' : 'text-stone-900'}`}>
                              {p.amount > 0 ? '+' : ''}{p.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCommitImport}
                  disabled={parsedPreview.length === 0}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Import {parsedPreview.length} Entries into Live Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT SWEEP & BANK-MOMO TRANSFER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-stone-900 text-white">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Bank-to-MoMo Float Transfer</h2>
                  <p className="text-[10px] text-stone-500">Instant double-entry float sweep with tariff fee tracking</p>
                </div>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransferSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Source Account</label>
                  <select
                    value={fromAccountId}
                    onChange={e => setFromAccountId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    {accounts.filter(a => a.subtype === 'cash_and_bank' || a.subtype === 'mobile_money').map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Destination Account</label>
                  <select
                    value={toAccountId}
                    onChange={e => setToAccountId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    {accounts.filter(a => a.subtype === 'cash_and_bank' || a.subtype === 'mobile_money').map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Transfer Amount (UGX)</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    placeholder="5000000"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs font-bold text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Telecom / Bank Tariff Fee</label>
                  <input
                    type="number"
                    value={tariffFee}
                    onChange={e => setTariffFee(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Transfer Memo / Narration</label>
                <input
                  type="text"
                  value={transferMemo}
                  onChange={e => setTransferMemo(e.target.value)}
                  placeholder="e.g. Replenish Airtel MoneyPay till float"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                  required
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 text-[11px] space-y-1">
                <p className="font-semibold text-stone-800">Double-Entry Impact:</p>
                <p>• Credit Source Account: -{formatMoney(parseFloat(transferAmount) || 0)}</p>
                <p>• Debit Destination Account: +{formatMoney(parseFloat(transferAmount) || 0)}</p>
                <p>• Debit Financial Fee Expense: +{formatMoney(parseFloat(tariffFee) || 0)}</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Execute Float Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANK FEED RULES MODAL */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-stone-900 text-white">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Bank Feed Automation Rules</h2>
                  <p className="text-[10px] text-stone-500">Automatically categorize and reconcile matching bank statement lines</p>
                </div>
              </div>
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs">
              {/* Existing Rules List */}
              <div className="space-y-2">
                <h3 className="font-bold text-stone-900 uppercase tracking-wider">
                  Active Automation Rules ({bankFeedRules.length})
                </h3>

                <div className="space-y-2">
                  {bankFeedRules.map(rule => (
                    <div
                      key={rule.id}
                      className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{rule.name}</span>
                          {rule.autoReconcile && (
                            <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                              Auto-Reconcile
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600">
                          If description contains <strong className="font-mono text-stone-900">"{rule.conditionValue}"</strong> → Assign to <strong className="text-stone-900">{rule.actionCategory}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleBankFeedRule(rule.id)}
                          className={`px-2 py-1 text-[10px] font-semibold rounded cursor-pointer ${
                            rule.isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {rule.isActive ? 'Active' : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBankFeedRule(rule.id)}
                          className="p-1 text-stone-400 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Rule Form */}
              <form onSubmit={handleCreateRuleSubmit} className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="font-bold text-stone-900">Create New Statement Automation Rule</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Rule Name</label>
                    <input
                      type="text"
                      value={newRuleName}
                      onChange={e => setNewRuleName(e.target.value)}
                      placeholder="e.g. TotalEnergies Fuel Auto-Match"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Description Contains</label>
                    <input
                      type="text"
                      value={newRuleConditionValue}
                      onChange={e => setNewRuleConditionValue(e.target.value)}
                      placeholder="e.g. TOTAL / UMEME / AIRTEL"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Action: Assign Category</label>
                  <select
                    value={newRuleCategory}
                    onChange={e => setNewRuleCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Transport & Fleet Fuel Expense">Transport & Fleet Fuel Expense</option>
                    <option value="Warehouse Rent & Electricity (Umeme)">Warehouse Rent & Electricity (Umeme)</option>
                    <option value="Staff Salaries & Casual Wages">Staff Salaries & Casual Wages</option>
                    <option value="Cost of Produce Purchased">Cost of Produce Purchased</option>
                    <option value="Fresh Produce Wholesale Sales">Fresh Produce Wholesale Sales</option>
                    <option value="Mobile Money & Banking Fees">Mobile Money & Banking Fees</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="ruleAutoRec"
                    checked={newRuleAutoReconcile}
                    onChange={e => setNewRuleAutoReconcile(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-800"
                  />
                  <label htmlFor="ruleAutoRec" className="font-semibold text-stone-800">
                    Automatically reconcile matching statement lines on sync
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                  >
                    Save & Activate Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
