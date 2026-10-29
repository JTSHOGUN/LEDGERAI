import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Plus,
  Building2,
  ChevronDown,
  Bot,
  Globe,
  FileText,
  Camera,
  CreditCard,
  Check,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Landmark,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenNotifications }) => {
  const {
    currentOrg,
    organizations,
    switchOrganization,
    setIsCommandMenuOpen,
    setCurrentView,
    aiInsights,
    theme,
  } = useApp();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const unreadAlertsCount = aiInsights.filter(i => !i.resolved).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/85 backdrop-blur-xl border-b border-stone-200/80 shadow-xs">
      {/* Left: Organization Switcher & Search Bar */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-stone-600 rounded-lg md:hidden hover:bg-stone-100"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Organization Switcher with Glass Pill */}
        <div className="relative">
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-left bg-stone-50/90 hover:bg-stone-100 border border-stone-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <div className={`flex items-center justify-center w-7 h-7 ${theme.avatarBg} text-white rounded-lg text-xs font-bold shadow-xs`}>
              {currentOrg.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-stone-900 leading-none truncate max-w-[160px]">
                  {currentOrg.name}
                </p>
                <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${theme.badge}`}>
                  {theme.name.split(' ')[0]}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">
                {currentOrg.currency} · {currentOrg.industry}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {/* Org Switcher Dropdown */}
          {isOrgDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50">
              <div className="px-3.5 py-2 border-b border-stone-100">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Switch Business Entity & Sector
                </p>
              </div>
              {organizations.map(org => (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org.id);
                    setIsOrgDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-stone-50 transition-colors ${
                    org.id === currentOrg.id ? `${theme.bgSurface} font-medium` : 'text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                        org.id === currentOrg.id
                          ? `${theme.avatarBg} text-white shadow-xs`
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {org.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate">{org.name}</p>
                      <p className="text-[10px] text-stone-500">{org.currency} · {org.industry.split(' ')[0]}</p>
                    </div>
                  </div>
                  {org.id === currentOrg.id && (
                    <Check className={`w-4 h-4 ${theme.textAccent} shrink-0`} />
                  )}
                </button>
              ))}
              <div className="pt-2 mt-1 border-t border-stone-100 px-3.5">
                <button
                  onClick={() => {
                    setIsOrgDropdownOpen(false);
                    setCurrentView('settings');
                  }}
                  className={`text-xs font-bold ${theme.textAccent} flex items-center gap-1 cursor-pointer`}
                >
                  Manage Organizations & Sector <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={() => setIsCommandMenuOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-stone-50/90 hover:bg-stone-100 border border-stone-200/80 rounded-xl text-stone-400 text-xs w-64 transition-all cursor-pointer shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-stone-500 font-medium">Search records or jump...</span>
          <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-white border border-stone-200 rounded text-stone-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions, AI Assistant, Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Public Website Preview Link */}
        <button
          onClick={() => setCurrentView('landing')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-stone-200"
          title="View Public SaaS Landing Page"
        >
          <Globe className="w-3.5 h-3.5 text-stone-500" />
          <span>Landing Page</span>
        </button>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 ${theme.btnPrimary} rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Action</span>
          </button>

          {isQuickActionOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-stone-200/80 py-2 z-50">
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  setCurrentView('invoices');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs text-stone-700 hover:bg-stone-50"
              >
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">New Sales Invoice</p>
                  <p className="text-[10px] text-stone-500">Bill client with URA & MoMo details</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  setCurrentView('scanner');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs text-stone-700 hover:bg-stone-50"
              >
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Scan Receipt / Bill</p>
                  <p className="text-[10px] text-stone-500">Extract line items with OCR</p>
                </div>
              </button>
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  setCurrentView('transactions');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs text-stone-700 hover:bg-stone-50"
              >
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-800">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Record Transaction</p>
                  <p className="text-[10px] text-stone-500">Log bank or mobile money entry</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Ask AI Copilot Button with Glass Look */}
        <button
          onClick={() => setCurrentView('ai-assistant')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          title="Open LedgerAI Financial Copilot"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">LedgerAI</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-stone-800 to-stone-950 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            DM
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-stone-900 leading-tight">David Mugisha</p>
            <p className="text-[10px] text-stone-500 leading-tight">Business Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
};
