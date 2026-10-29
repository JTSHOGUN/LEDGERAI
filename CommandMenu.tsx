import React, { useState, useEffect, useRef } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Search,
  LayoutDashboard,
  Receipt,
  FileText,
  CreditCard,
  Users,
  Building2,
  Package,
  Landmark,
  Scale,
  BarChart3,
  ShieldCheck,
  Bot,
  Camera,
  FolderLock,
  TrendingUp,
  LineChart,
  UserCheck,
  History,
  Settings,
  PlusCircle,
  Globe,
  FileCode2,
  X
} from 'lucide-react';

export const CommandMenu: React.FC = () => {
  const {
    isCommandMenuOpen,
    setIsCommandMenuOpen,
    setCurrentView,
    invoices,
    customers,
    transactions,
    currencySymbol,
  } = useApp();

  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandMenuOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
    }
  }, [isCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setIsCommandMenuOpen(false);
  };

  const menuItems: {
    id: string;
    category: string;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    action: () => void;
  }[] = [
    // Quick Actions
    {
      id: 'qa-inv',
      category: 'Quick Actions',
      title: 'Create New Invoice',
      subtitle: 'Issue e-invoice to customer',
      icon: <PlusCircle className="w-4 h-4 text-emerald-700" />,
      action: () => navigateTo('invoices'),
    },
    {
      id: 'qa-scan',
      category: 'Quick Actions',
      title: 'Scan Receipt or Bill (OCR)',
      subtitle: 'Upload image or PDF to extract data',
      icon: <Camera className="w-4 h-4 text-emerald-700" />,
      action: () => navigateTo('scanner'),
    },
    {
      id: 'qa-tx',
      category: 'Quick Actions',
      title: 'Record Transaction / Expense',
      subtitle: 'Log Mobile Money or Bank movement',
      icon: <CreditCard className="w-4 h-4 text-amber-700" />,
      action: () => navigateTo('transactions'),
    },
    {
      id: 'qa-ai',
      category: 'Quick Actions',
      title: 'Ask LedgerAI Copilot',
      subtitle: 'Query financial records in plain English',
      icon: <Bot className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('ai-assistant'),
    },

    // Navigation Pages
    {
      id: 'nav-dash',
      category: 'Navigation',
      title: 'Dashboard',
      subtitle: 'Financial command center and KPI metrics',
      icon: <LayoutDashboard className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('dashboard'),
    },
    {
      id: 'nav-tx',
      category: 'Navigation',
      title: 'Transactions',
      subtitle: 'All double-entry income & expenses',
      icon: <CreditCard className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('transactions'),
    },
    {
      id: 'nav-inv',
      category: 'Navigation',
      title: 'Invoices',
      subtitle: 'Accounts receivable & automated reminders',
      icon: <FileText className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('invoices'),
    },
    {
      id: 'nav-bills',
      category: 'Navigation',
      title: 'Bills',
      subtitle: 'Accounts payable & supplier billing',
      icon: <Receipt className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('bills'),
    },
    {
      id: 'nav-cust',
      category: 'Navigation',
      title: 'Customers',
      subtitle: 'Customer directory & payment insights',
      icon: <Users className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('customers'),
    },
    {
      id: 'nav-sup',
      category: 'Navigation',
      title: 'Suppliers',
      subtitle: 'Vendor directory & purchase terms',
      icon: <Building2 className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('suppliers'),
    },
    {
      id: 'nav-prod',
      category: 'Navigation',
      title: 'Products & Services',
      subtitle: 'Inventory stock & service catalog',
      icon: <Package className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('products'),
    },
    {
      id: 'nav-bank',
      category: 'Navigation',
      title: 'Banking & Mobile Money',
      subtitle: 'Stanbic, Centenary, MTN MoMo, Airtel Money, M-Pesa',
      icon: <Landmark className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('banking'),
    },
    {
      id: 'nav-recon',
      category: 'Navigation',
      title: 'Reconciliation',
      subtitle: 'Side-by-side feed matching engine',
      icon: <Scale className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('reconciliation'),
    },
    {
      id: 'nav-rep',
      category: 'Navigation',
      title: 'Financial Reports',
      subtitle: 'P&L, Balance Sheet, Cash Flow, General Ledger',
      icon: <BarChart3 className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('reports'),
    },
    {
      id: 'nav-tax',
      category: 'Navigation',
      title: 'Tax Center',
      subtitle: 'Uganda URA EFRIS, VAT 18%, WHT 6% filings',
      icon: <ShieldCheck className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('taxes'),
    },
    {
      id: 'nav-ins',
      category: 'Navigation',
      title: 'Business Insights',
      subtitle: 'Margin health, cash runway, debtor days',
      icon: <TrendingUp className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('insights'),
    },
    {
      id: 'nav-fore',
      category: 'Navigation',
      title: 'Cash Runway Forecasting',
      subtitle: '30d/90d/6mo/12mo cash trajectory scenarios',
      icon: <LineChart className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('forecasting'),
    },
    {
      id: 'nav-docs',
      category: 'Navigation',
      title: 'Document Management',
      subtitle: 'Vault with indexed search',
      icon: <FolderLock className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('documents'),
    },
    {
      id: 'nav-acc',
      category: 'Navigation',
      title: 'Accountant Mode',
      subtitle: 'Multi-client audit & review queue for CPAs',
      icon: <UserCheck className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('accountant'),
    },
    {
      id: 'nav-aud',
      category: 'Navigation',
      title: 'Audit Log',
      subtitle: 'Immutable record of user operations',
      icon: <History className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('audit'),
    },
    {
      id: 'nav-sett',
      category: 'Navigation',
      title: 'Settings & Gateways',
      subtitle: 'Airtel MoneyPay, M-Pesa, DNS verification',
      icon: <Settings className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('settings'),
    },
    {
      id: 'nav-land',
      category: 'Public Pages',
      title: 'Public Landing Page',
      subtitle: 'Product overview & pricing tiers',
      icon: <Globe className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('landing'),
    },
    {
      id: 'nav-priv',
      category: 'Legal',
      title: 'Privacy Policy',
      subtitle: 'African data protection & financial compliance',
      icon: <FileCode2 className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('privacy'),
    },
    {
      id: 'nav-term',
      category: 'Legal',
      title: 'Terms and Conditions',
      subtitle: 'SaaS licensing & liability terms',
      icon: <FileCode2 className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('terms'),
    },
  ];

  // Also include matching live customer records
  const dynamicItems = [
    ...customers.map(c => ({
      id: `cust-${c.id}`,
      category: 'Customers',
      title: c.name,
      subtitle: `TIN: ${c.tin || 'N/A'} | Outstanding: ${currencySymbol} ${c.outstandingBalance.toLocaleString()}`,
      icon: <Users className="w-4 h-4 text-emerald-700" />,
      action: () => navigateTo('customers'),
    })),
    ...invoices.map(inv => ({
      id: `inv-${inv.id}`,
      category: 'Invoices',
      title: `${inv.invoiceNumber} (${inv.customerName})`,
      subtitle: `Due ${inv.dueDate} | ${currencySymbol} ${inv.total.toLocaleString()} (${inv.status.toUpperCase()})`,
      icon: <FileText className="w-4 h-4 text-stone-700" />,
      action: () => navigateTo('invoices'),
    })),
  ];

  const allItems = [...menuItems, ...dynamicItems];
  const query = search.toLowerCase().trim();

  const filteredItems = query
    ? allItems.filter(
        i =>
          i.title.toLowerCase().includes(query) ||
          i.category.toLowerCase().includes(query) ||
          (i.subtitle && i.subtitle.toLowerCase().includes(query))
      )
    : menuItems;

  const grouped = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-stone-950/60">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-stone-200 gap-3 bg-stone-50">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type a command or search records (e.g. 'Invoices', 'Stanbic', 'Entebbe')..."
            className="w-full bg-transparent border-none text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsCommandMenuOpen(false)}
            className="text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5 rounded border border-stone-200 bg-white"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-3">
          {Object.keys(grouped).length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-stone-600">No matching results found</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for a customer, invoice, or section name.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2.5 py-1">
                  {category}
                </p>
                <div className="space-y-0.5">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-stone-100 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 bg-stone-100 group-hover:bg-white rounded-md border border-stone-200 shrink-0 transition-colors">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-800 group-hover:text-stone-900 transition-colors truncate">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-[11px] text-stone-500 truncate">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-stone-400 bg-stone-100 group-hover:bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                        Jump
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] font-mono">⌘K</kbd>
            <span>or</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] font-mono">Ctrl+K</kbd>
          </div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
