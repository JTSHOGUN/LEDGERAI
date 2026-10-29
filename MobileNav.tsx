import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  CreditCard,
  Camera,
  FileText,
  Bot,
  Plus,
  X,
  TrendingUp,
  Receipt,
  ArrowRightLeft
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, theme } = useApp();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Ledger', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="w-5 h-5" /> },
    { id: 'ai-assistant', label: 'Copilot', icon: <Bot className="w-5 h-5" /> },
  ];

  const handleAction = (view: AppView) => {
    setCurrentView(view);
    setIsActionSheetOpen(false);
  };

  return (
    <>
      {/* Mobile Action Sheet Backdrop */}
      {isActionSheetOpen && (
        <div
          onClick={() => setIsActionSheetOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/60 md:hidden"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-5 shadow-2xl border-t border-stone-200 z-50"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <p className="text-sm font-bold text-stone-900">Quick Actions</p>
                <p className="text-xs text-stone-500">Record a financial transaction or scan receipt</p>
              </div>
              <button
                onClick={() => setIsActionSheetOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleAction('scanner')}
                className="flex flex-col items-center justify-center p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-center transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-stone-900">Scan Receipt</span>
                <span className="text-[10px] text-stone-500 mt-0.5">OCR data capture</span>
              </button>

              <button
                onClick={() => handleAction('invoices')}
                className={`flex flex-col items-center justify-center p-3.5 ${theme.bgSurface} border ${theme.borderAccent} rounded-lg text-center transition-colors cursor-pointer`}
              >
                <div
                  style={{ backgroundColor: theme.primaryColorHex }}
                  className="w-10 h-10 rounded-lg text-white flex items-center justify-center mb-2 shadow-xs"
                >
                  <FileText className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold ${theme.textAccent}`}>New Invoice</span>
                <span className="text-[10px] text-stone-500 mt-0.5">Bill client with MoMo</span>
              </button>

              <button
                onClick={() => handleAction('expenses')}
                className="flex flex-col items-center justify-center p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-center transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-800 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-amber-950">Log Expense</span>
                <span className="text-[10px] text-amber-700 mt-0.5">Business or personal</span>
              </button>

              <button
                onClick={() => handleAction('banking')}
                className="flex flex-col items-center justify-center p-3.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-center transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-stone-800 text-white flex items-center justify-center mb-2 shadow-xs">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-stone-900">MoMo Transfer</span>
                <span className="text-[10px] text-stone-600 mt-0.5">Bank to MoMo float</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg md:hidden font-sans">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 2).map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  isActive ? `${theme.textAccent} font-bold` : 'text-stone-500'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1">{item.label}</span>
              </button>
            );
          })}

          {/* Center Action Button */}
          <div className="flex items-center justify-center -mt-5">
            <button
              onClick={() => setIsActionSheetOpen(true)}
              style={{ backgroundColor: theme.primaryColorHex }}
              className="flex items-center justify-center w-12 h-12 text-white rounded-lg shadow-lg transition-transform active:scale-95 cursor-pointer"
              aria-label="Quick Action"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {navItems.slice(2, 4).map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  isActive ? `${theme.textAccent} font-bold` : 'text-stone-500'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
