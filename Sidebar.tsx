import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Receipt,
  FileText,
  FileCheck2,
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
  LineChart,
  UserCheck,
  Users2,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Compass,
  Coins
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, currentOrg, aiInsights, bankFeed, theme } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingReconCount = bankFeed.filter(b => b.reconciliationStatus === 'unmatched').length;
  const activeAlertsCount = aiInsights.filter(i => !i.resolved).length;

  const navGroups: {
    title: string;
    items: {
      id: AppView;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      title: 'FINANCIAL CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'transactions', label: 'Transactions', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'sales', label: 'Sales & Revenue', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-4 h-4" /> },
      ],
    },
    {
      title: 'OPERATIONS & BILLING',
      items: [
        { id: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
        { id: 'bills', label: 'Bills (Payables)', icon: <FileCheck2 className="w-4 h-4" /> },
        { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
        { id: 'suppliers', label: 'Suppliers', icon: <Building2 className="w-4 h-4" /> },
        { id: 'products', label: 'Products & Inventory', icon: <Package className="w-4 h-4" /> },
      ],
    },
    {
      title: 'BANKING, MOMO & CRYPTO',
      items: [
        { id: 'banking', label: 'Bank & MoMo Accounts', icon: <Landmark className="w-4 h-4" /> },
        { id: 'crypto', label: 'Crypto & Web3 Wallets', icon: <Coins className="w-4 h-4" /> },
        {
          id: 'reconciliation',
          label: 'Reconciliation',
          icon: <Scale className="w-4 h-4" />,
          badge: pendingReconCount > 0 ? pendingReconCount : undefined,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        },
      ],
    },
    {
      title: 'INTELLIGENCE & VAULT',
      items: [
        { id: 'ai-assistant', label: 'Financial Copilot', icon: <Bot className="w-4 h-4" /> },
        { id: 'scanner', label: 'Receipt Scanner (OCR)', icon: <Camera className="w-4 h-4" /> },
        {
          id: 'insights',
          label: 'Business Insights',
          icon: <Compass className="w-4 h-4" />,
          badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        },
        { id: 'forecasting', label: 'Cash Runway Forecast', icon: <LineChart className="w-4 h-4" /> },
        { id: 'documents', label: 'Document Vault', icon: <FolderLock className="w-4 h-4" /> },
      ],
    },
    {
      title: 'COMPLIANCE & REPORTS',
      items: [
        { id: 'reports', label: 'Financial Reports', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'taxes', label: 'Tax Center (URA EFRIS)', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'accountant', label: 'Accountant Mode', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'audit', label: 'Audit Trail', icon: <History className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ORGANIZATION',
      items: [
        { id: 'team', label: 'Team & Permissions', icon: <Users2 className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings & Gateways', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-stone-950/95 backdrop-blur-2xl text-stone-300 border-r border-white/10 flex flex-col transition-all duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div
              style={{ backgroundColor: theme.primaryColorHex }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-tight shrink-0 shadow-md ring-1 ring-white/20"
            >
              <span className="font-mono">L</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-white">LedgerAI</span>
                  <span
                    style={{ borderColor: `${theme.primaryColorHex}60` }}
                    className="text-[9px] font-bold text-stone-200 bg-stone-900 px-1.5 py-0.2 rounded-full border uppercase tracking-wide"
                  >
                    {theme.name.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 truncate">Your books, understood.</p>
              </div>
            )}
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-6 h-6 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map(group => (
            <div key={group.title}>
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      style={isActive ? { backgroundColor: theme.primaryColorHex } : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? 'text-white font-bold shadow-lg ring-1 ring-white/20'
                          : 'text-stone-300 hover:bg-white/5 hover:text-white'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      <span className={`shrink-0 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {!isCollapsed && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            item.badgeColor || 'bg-stone-800 text-stone-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer & Gateway Status Banner */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-white/10 shrink-0 bg-stone-950/80">
            {/* Live Gateway Status */}
            <div className="p-2.5 bg-stone-900/90 rounded-xl border border-white/10 text-xs mb-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Airtel & M-Pesa Rails
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.2 rounded-full border border-emerald-500/40">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">
                Till #887211 · M-Pesa #904210
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <button
                onClick={() => handleNavClick('privacy')}
                className="hover:text-emerald-400 transition-colors"
              >
                Privacy
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavClick('terms')}
                className="hover:text-emerald-400 transition-colors"
              >
                Terms
              </button>
              <span>·</span>
              <button
                onClick={() => handleNavClick('landing')}
                className="hover:text-emerald-400 transition-colors"
              >
                Website
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-white/10 flex justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Connected" />
          </div>
        )}
      </aside>
    </>
  );
};
