import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/layout/Toast';
import { CommandMenu } from './components/layout/CommandMenu';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { PrivacyPolicyPage } from './components/legal/PrivacyPolicyPage';
import { TermsPage } from './components/legal/TermsPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { SalesView } from './components/sales/SalesView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { BillsView } from './components/bills/BillsView';
import { CustomersView } from './components/customers/CustomersView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { ProductsView } from './components/products/ProductsView';
import { BankingView } from './components/banking/BankingView';
import { CryptoView } from './components/crypto/CryptoView';
import { ReconciliationView } from './components/reconciliation/ReconciliationView';
import { ReportsView } from './components/reports/ReportsView';
import { TaxesView } from './components/taxes/TaxesView';
import { AiAssistantView } from './components/ai-assistant/AiAssistantView';
import { ReceiptScannerView } from './components/scanner/ReceiptScannerView';
import { DocumentsView } from './components/documents/DocumentsView';
import { InsightsView } from './components/insights/InsightsView';
import { ForecastingView } from './components/forecasting/ForecastingView';
import { AccountantModeView } from './components/accountant/AccountantModeView';
import { TeamView } from './components/team/TeamView';
import { AuditLogView } from './components/audit/AuditLogView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Standalone Full-Page Routes
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage />
        <CommandMenu />
        <ToastContainer />
      </>
    );
  }

  if (currentView === 'privacy') {
    return (
      <>
        <PrivacyPolicyPage />
        <CommandMenu />
        <ToastContainer />
      </>
    );
  }

  if (currentView === 'terms') {
    return (
      <>
        <TermsPage />
        <CommandMenu />
        <ToastContainer />
      </>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <>
        <OnboardingWizard />
        <ToastContainer />
      </>
    );
  }

  // App Layout with Glassmorphism, Ambient Lighting & Background Silhouettes
  return (
    <div className="flex h-screen bg-stone-100/90 overflow-hidden font-sans antialiased text-stone-900 relative">
      {/* Ambient background lighting & subtle photographic depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-72 bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Collapsible Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header with Glass Effect */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'transactions' && <TransactionsView />}
            {currentView === 'sales' && <SalesView />}
            {currentView === 'expenses' && <ExpensesView />}
            {currentView === 'invoices' && <InvoicesView />}
            {currentView === 'bills' && <BillsView />}
            {currentView === 'customers' && <CustomersView />}
            {currentView === 'suppliers' && <SuppliersView />}
            {currentView === 'products' && <ProductsView />}
            {currentView === 'banking' && <BankingView />}
            {currentView === 'crypto' && <CryptoView />}
            {currentView === 'reconciliation' && <ReconciliationView />}
            {currentView === 'reports' && <ReportsView />}
            {currentView === 'taxes' && <TaxesView />}
            {currentView === 'ai-assistant' && <AiAssistantView />}
            {currentView === 'scanner' && <ReceiptScannerView />}
            {currentView === 'documents' && <DocumentsView />}
            {currentView === 'insights' && <InsightsView />}
            {currentView === 'forecasting' && <ForecastingView />}
            {currentView === 'accountant' && <AccountantModeView />}
            {currentView === 'team' && <TeamView />}
            {currentView === 'audit' && <AuditLogView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav />
      </div>

      {/* Global Modals & Notifications */}
      <CommandMenu />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
