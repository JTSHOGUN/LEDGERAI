import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Organization,
  Account,
  Transaction,
  Invoice,
  Bill,
  Customer,
  Supplier,
  Product,
  BankAccountItem,
  BankFeedItem,
  BankFeedRule,
  OpenBankingConfig,
  CryptoWallet,
  CryptoTransactionItem,
  CryptoMarketCoin,
  OcrExtractedData,
  DocumentItem,
  AIInsightItem,
  AuditLogItem,
  TeamMember,
  CurrencyCode,
  CountryCode,
  ReconciliationStatus,
  InvoiceStatus,
  AiMessage,
  AirtelMoneyPayConfig,
  MpesaDarajaConfig,
  MtnMomoConfig,
  AccaWorkingPaper,
  AccaMateriality,
  AccaAuditRiskItem,
  AccaAdjustingJournal,
  AccaAuditReport
} from '../types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_ACCOUNTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_INVOICES,
  INITIAL_BILLS,
  INITIAL_TRANSACTIONS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_BANK_FEED,
  INITIAL_OCR_RECEIPTS,
  INITIAL_DOCUMENTS,
  INITIAL_AI_INSIGHTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TEAM_MEMBERS,
  SUPPORTED_CURRENCIES,
  SUPPORTED_COUNTRIES,
} from '../data/initialData';
import { ParsedStatementTransaction } from '../services/bankIntegrationService';
import { CryptoService } from '../services/cryptoService';
import { AccaService } from '../services/accaService';
import { AccountingEngine, ProfitAndLossReport, BalanceSheetReport, CashFlowReport, TrialBalanceReport, TaxReportData, AgingBucket } from '../services/accountingEngine';
import { SectorTheme, getSectorTheme } from '../utils/theme';

export type AppView = 
  | 'landing'
  | 'privacy'
  | 'terms'
  | 'onboarding'
  | 'dashboard'
  | 'transactions'
  | 'sales'
  | 'expenses'
  | 'invoices'
  | 'bills'
  | 'customers'
  | 'suppliers'
  | 'products'
  | 'banking'
  | 'crypto'
  | 'reconciliation'
  | 'reports'
  | 'taxes'
  | 'ai-assistant'
  | 'scanner'
  | 'documents'
  | 'insights'
  | 'forecasting'
  | 'accountant'
  | 'team'
  | 'audit'
  | 'settings';

export type DatePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: number;
  duration?: number;
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedPeriod: DatePeriod;
  setSelectedPeriod: (period: DatePeriod) => void;
  
  // Organizations
  organizations: Organization[];
  currentOrg: Organization;
  switchOrganization: (orgId: string) => void;
  updateOrganization: (org: Partial<Organization>) => void;
  addBusinessOrganization: (orgData: {
    name: string;
    legalName: string;
    country: CountryCode;
    currency: CurrencyCode;
    tin: string;
    industry: string;
  }) => boolean;
  
  // Custom Domain & Gateways
  verifyCustomDomain: (domain: string) => Promise<boolean>;
  updateAirtelGateway: (config: Partial<AirtelMoneyPayConfig>) => void;
  updateMpesaGateway: (config: Partial<MpesaDarajaConfig>) => void;
  updateMtnMomoGateway: (config: Partial<MtnMomoConfig>) => void;
  testGatewayConnection: (gateway: 'airtel_moneypay' | 'mpesa' | 'mtn_momo' | 'open_banking' | 'crypto_rpc') => Promise<boolean>;
  triggerStkPush: (req: {
    invoiceId: string;
    phoneNumber: string;
    amount: number;
    gateway: 'airtel_moneypay' | 'mpesa' | 'mtn_momo';
  }) => Promise<{ success: boolean; reference: string }>;
  
  // Open Banking Configuration
  openBankingConfig: OpenBankingConfig;
  updateOpenBankingConfig: (config: Partial<OpenBankingConfig>) => void;
  
  // Crypto Treasury & Wallets
  cryptoWallets: CryptoWallet[];
  cryptoTransactions: CryptoTransactionItem[];
  cryptoMarketRates: CryptoMarketCoin[];
  connectCryptoWallet: (wallet: Omit<CryptoWallet, 'id' | 'organizationId' | 'lastSynced'>) => Promise<void>;
  disconnectCryptoWallet: (id: string) => void;
  syncCryptoWallet: (id: string) => Promise<void>;
  recordCryptoTransaction: (tx: Omit<CryptoTransactionItem, 'id'>) => void;
  matchCryptoTransaction: (id: string, invoiceId?: string) => void;
  
  // Data
  accounts: Account[];
  transactions: Transaction[];
  invoices: Invoice[];
  bills: Bill[];
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  bankAccounts: BankAccountItem[];
  bankFeed: BankFeedItem[];
  bankFeedRules: BankFeedRule[];
  ocrReceipts: OcrExtractedData[];
  documents: DocumentItem[];
  aiInsights: AIInsightItem[];
  auditLogs: AuditLogItem[];
  teamMembers: TeamMember[];
  
  // Financial Computed Reports
  pnlReport: ProfitAndLossReport;
  balanceSheetReport: BalanceSheetReport;
  cashFlowReport: CashFlowReport;
  trialBalanceReport: TrialBalanceReport;
  taxSummaryReport: TaxReportData;
  receivablesAging: AgingBucket[];
  payablesAging: AgingBucket[];
  
  // Banking Integration Actions
  connectBankAccount: (account: BankAccountItem, initialFeed?: BankFeedItem[]) => void;
  disconnectBankAccount: (accountId: string) => void;
  syncBankAccount: (accountId: string) => Promise<void>;
  importStatementTransactions: (accountId: string, parsedTxns: ParsedStatementTransaction[]) => void;
  executeBankTransfer: (fromAccountId: string, toAccountId: string, amount: number, fee: number, memo?: string) => void;
  addBankFeedRule: (rule: Omit<BankFeedRule, 'id'>) => void;
  deleteBankFeedRule: (id: string) => void;
  toggleBankFeedRule: (id: string) => void;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'organizationId'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  bulkCategorizeTransactions: (ids: string[], category: string) => void;
  bulkReconcileTransactions: (ids: string[]) => void;
  deleteTransaction: (id: string) => void;
  
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt' | 'organizationId'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  recordInvoicePayment: (id: string, amount: number, paymentMethod: string) => void;
  sendInvoiceReminder: (id: string, tone: 'friendly' | 'professional' | 'firm') => void;
  
  addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'organizationId'>) => void;
  recordBillPayment: (id: string, amount: number) => void;
  
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt' | 'organizationId'>) => void;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  
  addSupplier: (sup: Omit<Supplier, 'id' | 'createdAt' | 'organizationId'>) => void;
  updateSupplier: (id: string, sup: Partial<Supplier>) => void;
  
  addProduct: (prod: Omit<Product, 'id' | 'organizationId'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  
  // Reconciliation actions
  matchBankFeedItem: (feedId: string, targetId: string, targetType: 'transaction' | 'invoice' | 'bill') => void;
  ignoreBankFeedItem: (feedId: string) => void;
  
  // OCR Ingestion
  addOcrReceipt: (data: OcrExtractedData) => void;
  convertOcrToExpense: (ocrId: string, category: string, accountId: string) => void;
  
  // Documents
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate' | 'organizationId'>) => void;
  deleteDocument: (id: string) => void;
  
  // Insights
  resolveInsight: (id: string) => void;
  
  // Team
  inviteTeamMember: (name: string, email: string, role: TeamMember['role']) => void;
  
  // AI Chat
  aiMessages: AiMessage[];
  sendAiQuery: (query: string) => void;
  
  // UI & Command Palette
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (open: boolean) => void;
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  
  // ACCA Mode & Chartered Corporate Audit
  isAccaMode: boolean;
  setIsAccaMode: (enabled: boolean) => void;
  accaWorkingPapers: AccaWorkingPaper[];
  updateWorkingPaper: (id: string, updates: Partial<AccaWorkingPaper>) => void;
  accaMateriality: AccaMateriality;
  updateMateriality: (benchmarkType: AccaMateriality['benchmarkType'], benchmarkAmount?: number, overallPercentage?: number) => void;
  accaAuditRisks: AccaAuditRiskItem[];
  updateAuditRiskStatus: (id: string, status: AccaAuditRiskItem['status']) => void;
  accaAdjustingJournals: AccaAdjustingJournal[];
  addAdjustingJournal: (journal: Omit<AccaAdjustingJournal, 'id'>) => void;
  accaAuditReport: AccaAuditReport;
  signOffAuditReport: (opinionType: AccaAuditReport['opinionType'], auditorName: string, memberNumber: string, firmName: string) => void;
  
  // Sector / Industry Dynamic Theme
  theme: SectorTheme;
  
  // Currency & Formatting Helpers
  currencySymbol: string;
  formatMoney: (amount: number, overrideCurrency?: CurrencyCode) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'privacy') return 'privacy';
    if (path === 'terms') return 'terms';
    if (path === 'landing' || path === 'home') return 'landing';
    return 'dashboard';
  });

  const [selectedPeriod, setSelectedPeriod] = useState<DatePeriod>('month');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Multi-organization state
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [currentOrgId, setCurrentOrgId] = useState<string>('org-01');

  // Open Banking Configuration
  const [openBankingConfig, setOpenBankingConfig] = useState<OpenBankingConfig>({
    enabled: true,
    provider: 'mono_africa',
    monoAppId: 'app_live_ug_88921a8b',
    monoSecretKey: '••••••••••••••••••••••••••••••••',
    stitchClientId: 'stitch_client_9941a8',
    stitchClientSecret: '••••••••••••••••••••••••••••••••',
    autoSyncFrequency: 'every_4_hours',
    lastSyncTimestamp: '2026-09-08T06:00:00Z',
    status: 'connected',
  });

  // Crypto Wallets & Market Rates State
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>(() => CryptoService.getInitialWallets());
  const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransactionItem[]>(() => CryptoService.getInitialCryptoTransactions());
  const [cryptoMarketRates, setCryptoMarketRates] = useState<CryptoMarketCoin[]>(() => CryptoService.getMarketRates('UGX'));

  // Ledger state
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>(INITIAL_BANK_ACCOUNTS);
  const [bankFeed, setBankFeed] = useState<BankFeedItem[]>(INITIAL_BANK_FEED);
  
  // Bank Feed Rules
  const [bankFeedRules, setBankFeedRules] = useState<BankFeedRule[]>([
    {
      id: 'rule-01',
      name: 'UMEME Electricity Auto-Tag',
      conditionField: 'description',
      conditionValue: 'UMEME',
      actionCategory: 'Warehouse Rent & Electricity (Umeme)',
      actionAccountId: 'acc-5100',
      autoReconcile: true,
      isActive: true,
    },
    {
      id: 'rule-02',
      name: 'Airtel Money Sweep Matching',
      conditionField: 'description',
      conditionValue: 'AIRTEL MONEYPAY',
      actionCategory: 'Fresh Produce Wholesale Sales',
      actionAccountId: 'acc-1040',
      autoReconcile: true,
      isActive: true,
    },
    {
      id: 'rule-03',
      name: 'TotalEnergies Fuel Fleet',
      conditionField: 'description',
      conditionValue: 'TOTAL',
      actionCategory: 'Transport & Fleet Fuel Expense',
      actionAccountId: 'acc-5100',
      autoReconcile: false,
      isActive: true,
    },
  ]);

  const [ocrReceipts, setOcrReceipts] = useState<OcrExtractedData[]>(INITIAL_OCR_RECEIPTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [aiInsights, setAiInsights] = useState<AIInsightItem[]>(INITIAL_AI_INSIGHTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  // ACCA Mode State for Higher Tier Organizations
  const [isAccaMode, setIsAccaMode] = useState<boolean>(true);
  const [accaWorkingPapers, setAccaWorkingPapers] = useState<AccaWorkingPaper[]>(() =>
    AccaService.getDefaultWorkingPapers(INITIAL_ORGANIZATIONS[0], 84520000)
  );
  const [accaMateriality, setAccaMateriality] = useState<AccaMateriality>(() =>
    AccaService.calculateMateriality(84520000, 28180000, 220000000, 'revenue')
  );
  const [accaAuditRisks, setAccaAuditRisks] = useState<AccaAuditRiskItem[]>(() =>
    AccaService.getDefaultAuditRisks()
  );
  const [accaAdjustingJournals, setAccaAdjustingJournals] = useState<AccaAdjustingJournal[]>(() =>
    AccaService.getDefaultAdjustingJournals(INITIAL_ORGANIZATIONS[0])
  );
  const [accaAuditReport, setAccaAuditReport] = useState<AccaAuditReport>(() =>
    AccaService.generateAuditReport(INITIAL_ORGANIZATIONS[0], 84520000, 28180000, 220000000)
  );

  const updateWorkingPaper = (id: string, updates: Partial<AccaWorkingPaper>) => {
    setAccaWorkingPapers(prev =>
      prev.map(wp => (wp.id === id ? { ...wp, ...updates } : wp))
    );
    addToast({
      type: 'success',
      title: 'IFRS Working Paper Updated',
      message: 'Audit working paper updated and audit trail logged.',
    });
  };

  const updateMateriality = (
    benchmarkType: AccaMateriality['benchmarkType'],
    benchmarkAmount?: number,
    overallPercentage?: number
  ) => {
    const rev = benchmarkAmount || 84520000;
    const mat = AccaService.calculateMateriality(rev, 28180000, 220000000, benchmarkType);
    if (overallPercentage) {
      mat.overallPercentage = overallPercentage;
      mat.overallMateriality = (mat.benchmarkAmount * overallPercentage) / 100;
      mat.performanceMateriality = (mat.overallMateriality * mat.performancePercentage) / 100;
      mat.trivialThreshold = (mat.overallMateriality * mat.trivialThresholdPercentage) / 100;
    }
    setAccaMateriality(mat);
    addToast({
      type: 'info',
      title: 'ISA 320 Materiality Recalculated',
      message: `Overall materiality set to ${currentOrg.currency} ${mat.overallMateriality.toLocaleString()}`,
    });
  };

  const updateAuditRiskStatus = (id: string, status: AccaAuditRiskItem['status']) => {
    setAccaAuditRisks(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  const addAdjustingJournal = (journal: Omit<AccaAdjustingJournal, 'id'>) => {
    const newAje: AccaAdjustingJournal = {
      ...journal,
      id: `aje-${Date.now()}`,
    };
    setAccaAdjustingJournals(prev => [newAje, ...prev]);
    addToast({
      type: 'success',
      title: 'Adjusting Journal Entry Posted',
      message: `${newAje.reference} posted to General Ledger under ${newAje.standard}.`,
    });
  };

  const signOffAuditReport = (
    opinionType: AccaAuditReport['opinionType'],
    auditorName: string,
    memberNumber: string,
    firmName: string
  ) => {
    setAccaAuditReport(prev => ({
      ...prev,
      opinionType,
      auditorName,
      accaMemberNumber: memberNumber,
      firmName,
      signedDate: new Date().toISOString().split('T')[0],
      digitalSignatureHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    }));
    addToast({
      type: 'success',
      title: 'ACCA Audit Report Signed & Sealed',
      message: `Formal ${opinionType.toUpperCase()} opinion issued by ${auditorName} (${memberNumber}).`,
    });
  };

  // AI Chat Messages
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      timestamp: '2026-09-07T00:00:00Z',
      text: 'Hello David! I am your LedgerAI financial copilot. I have analyzed your books for Kampala Fresh Supplies Ltd. How can I assist with your finances today?',
      structuredData: {
        directAnswer: 'Your books are reconciled and in good standing with UGX 22.84M in liquid cash across Bank, MTN MoMo, Airtel MoneyPay, and M-Pesa, plus UGX 121.5M in Crypto Treasury Assets (Solana, Binance, Tron & Ethereum).',
        supportingNumbers: [
          { label: 'Current Revenue', value: 'UGX 84.52M', trend: '+12.4% MoM' },
          { label: 'Net Profit', value: 'UGX 28.18M', trend: '33.3% margin' },
          { label: 'Crypto Treasury', value: 'UGX 121.5M', trend: '4 Wallets' },
        ],
        explanation: 'Stanbic Bank balance is UGX 14.25M, MTN MoMo is UGX 3.24M, Airtel MoneyPay is UGX 1.85M, and M-Pesa is UGX 2.45M. Solana Treasury has 48.5 SOL + $8.5K USDC.',
        recommendation: 'Try asking "What is our crypto capital gain?" or "Connect a new Solana or Binance Pay wallet" for automated ledger sync.',
        relatedAction: {
          label: 'View Crypto Wallets',
          route: 'crypto',
        },
      },
    },
  ]);

  const currentOrg = useMemo(() => {
    return organizations.find(o => o.id === currentOrgId) || organizations[0];
  }, [organizations, currentOrgId]);

  // Sector / Industry Dynamic Color Palette
  const theme = useMemo(() => {
    return getSectorTheme(currentOrg.industry);
  }, [currentOrg.industry]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      Object.entries(theme.cssVariables).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
    }
  }, [theme]);

  const currencyConfig = useMemo(() => {
    return SUPPORTED_CURRENCIES[currentOrg.currency] || SUPPORTED_CURRENCIES.UGX;
  }, [currentOrg.currency]);

  const currencySymbol = currencyConfig.symbol;

  const formatMoney = (amount: number, overrideCurrency?: CurrencyCode): string => {
    const symbol = overrideCurrency ? (SUPPORTED_CURRENCIES[overrideCurrency]?.symbol || overrideCurrency) : currencySymbol;
    return `${symbol} ${Math.round(amount).toLocaleString()}`;
  };

  const addToast = (toast: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const newToast: ToastItem = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      duration: toast.duration ?? 5000,
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live reports using double-entry engine
  const pnlReport = useMemo(() => {
    return AccountingEngine.calculateProfitAndLoss(accounts, transactions);
  }, [accounts, transactions]);

  const balanceSheetReport = useMemo(() => {
    return AccountingEngine.calculateBalanceSheet(accounts, pnlReport.netProfit);
  }, [accounts, pnlReport.netProfit]);

  const cashFlowReport = useMemo(() => {
    return AccountingEngine.calculateCashFlow(accounts, transactions);
  }, [accounts, transactions]);

  const trialBalanceReport = useMemo(() => {
    return AccountingEngine.calculateTrialBalance(accounts);
  }, [accounts]);

  const taxSummaryReport = useMemo(() => {
    return AccountingEngine.calculateTaxSummary(invoices, bills, pnlReport);
  }, [invoices, bills, pnlReport]);

  const receivablesAging = useMemo(() => {
    return AccountingEngine.calculateReceivablesAging(invoices);
  }, [invoices]);

  const payablesAging = useMemo(() => {
    return AccountingEngine.calculatePayablesAging(bills);
  }, [bills]);

  const switchOrganization = (orgId: string) => {
    setCurrentOrgId(orgId);
    const target = organizations.find(o => o.id === orgId);
    if (target) {
      addToast({
        type: 'info',
        title: 'Switched Business',
        message: `Now viewing ${target.name} (${target.currency})`,
      });
    }
  };

  const updateOrganization = (updates: Partial<Organization>) => {
    setOrganizations(prev =>
      prev.map(org => (org.id === currentOrgId ? { ...org, ...updates } : org))
    );
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Business profile and preferences updated successfully.',
    });
  };

  const addBusinessOrganization = (orgData: {
    name: string;
    legalName: string;
    country: CountryCode;
    currency: CurrencyCode;
    tin: string;
    industry: string;
  }): boolean => {
    const limit = currentOrg.maxBusinessesAllowed || 3;
    if (organizations.length >= limit) {
      addToast({
        type: 'warning',
        title: 'Organization Limit Reached',
        message: `Your current plan allows up to ${limit} businesses. Upgrade to add more companies.`,
      });
      return false;
    }

    const newOrgId = `org-${String(organizations.length + 1).padStart(2, '0')}`;
    const newOrg: Organization = {
      id: newOrgId,
      name: orgData.name,
      legalName: orgData.legalName,
      country: orgData.country,
      currency: orgData.currency,
      tin: orgData.tin,
      efrisRegistered: true,
      address: 'Plot 10 Kampala Road',
      city: 'Kampala',
      phone: '+256 700 000 000',
      email: `accounts@${orgData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.ug`,
      fiscalYearEnd: 'December 31',
      industry: orgData.industry,
      plan: currentOrg.plan,
      maxBusinessesAllowed: limit,
      cryptoWalletsEnabled: true,
      mtnMomo: {
        enabled: true,
        environment: 'production',
        apiUserId: `momo-usr-${Date.now()}`,
        apiKey: '••••••••••••••••••••••••••••••••',
        primarySubscriptionKey: '••••••••••••••••••••••••••••••••',
        merchantNumber: `Till #${Math.floor(100000 + Math.random() * 900000)}`,
        country: orgData.country,
        currency: orgData.currency,
        webhookUrl: `https://${orgData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.ledgerai.africa/api/v1/webhooks/mtn-momo`,
        status: 'connected',
        lastPing: new Date().toISOString(),
        autoReconcile: true,
        collectionMode: 'request_to_pay',
      },
    };

    setOrganizations(prev => [...prev, newOrg]);
    setCurrentOrgId(newOrgId);

    addToast({
      type: 'success',
      title: 'New Business Created',
      message: `${orgData.name} initialized. Workspace ready (${organizations.length + 1}/${limit} used).`,
    });
    return true;
  };

  const updateAirtelGateway = (config: Partial<AirtelMoneyPayConfig>) => {
    setOrganizations(prev =>
      prev.map(org => {
        if (org.id === currentOrgId) {
          return {
            ...org,
            airtelMoneyPay: {
              ...(org.airtelMoneyPay || {
                enabled: true,
                environment: 'production',
                merchantId: 'AIRTEL-UG-887211',
                clientId: '',
                clientSecret: '',
                country: org.country,
                currency: org.currency,
                webhookUrl: `https://${org.customDomain?.domain || 'app.ledgerai.africa'}/api/v1/webhooks/airtel-moneypay`,
                status: 'connected',
                lastPing: new Date().toISOString(),
                autoReconcile: true,
              }),
              ...config,
            },
          };
        }
        return org;
      })
    );
    addToast({
      type: 'success',
      title: 'Airtel MoneyPay Gateway Updated',
      message: 'Configuration and merchant webhook endpoints saved.',
    });
  };

  const updateMpesaGateway = (config: Partial<MpesaDarajaConfig>) => {
    setOrganizations(prev =>
      prev.map(org => {
        if (org.id === currentOrgId) {
          return {
            ...org,
            mpesaDaraja: {
              ...(org.mpesaDaraja || {
                enabled: true,
                environment: 'production',
                businessShortCode: '904210',
                accountType: 'till_number',
                consumerKey: '',
                consumerSecret: '',
                passkey: '',
                webhookCallbackUrl: `https://${org.customDomain?.domain || 'app.ledgerai.africa'}/api/v1/webhooks/mpesa-daraja`,
                status: 'connected',
                lastPing: new Date().toISOString(),
                autoReconcile: true,
              }),
              ...config,
            },
          };
        }
        return org;
      })
    );
    addToast({
      type: 'success',
      title: 'M-Pesa Daraja Gateway Updated',
      message: 'Shortcode, passkey, and callback endpoints updated.',
    });
  };

  const updateMtnMomoGateway = (config: Partial<MtnMomoConfig>) => {
    setOrganizations(prev =>
      prev.map(org => {
        if (org.id === currentOrgId) {
          return {
            ...org,
            mtnMomo: {
              ...(org.mtnMomo || {
                enabled: true,
                environment: 'production',
                apiUserId: '88a192b0-1c44-481a-8892-1a8b01c4481a',
                apiKey: '',
                primarySubscriptionKey: '',
                merchantNumber: 'Till #654210',
                country: org.country,
                currency: org.currency,
                webhookUrl: `https://${org.customDomain?.domain || 'app.ledgerai.africa'}/api/v1/webhooks/mtn-momo`,
                status: 'connected',
                lastPing: new Date().toISOString(),
                autoReconcile: true,
                collectionMode: 'request_to_pay',
              }),
              ...config,
            },
          };
        }
        return org;
      })
    );
    addToast({
      type: 'success',
      title: 'MTN MoMo Gateway Updated',
      message: 'MTN Open API keys, Collection User ID, and callback endpoints saved.',
    });
  };

  const updateOpenBankingConfig = (config: Partial<OpenBankingConfig>) => {
    setOpenBankingConfig(prev => ({ ...prev, ...config }));
    addToast({
      type: 'success',
      title: 'Open Banking Settings Updated',
      message: 'API aggregator parameters and sync schedule saved.',
    });
  };

  const testGatewayConnection = async (gateway: 'airtel_moneypay' | 'mpesa' | 'mtn_momo' | 'open_banking' | 'crypto_rpc'): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const title = 
          gateway === 'airtel_moneypay' ? 'Airtel MoneyPay API' :
          gateway === 'mpesa' ? 'M-Pesa Daraja 2.0 API' :
          gateway === 'mtn_momo' ? 'MTN Mobile Money Open API' :
          gateway === 'crypto_rpc' ? 'Solana & EVM RPC Node Network' :
          'African Open Banking Feed';

        addToast({
          type: 'success',
          title: `${title} Health: OK`,
          message: 'TLS 1.3 handshake verified. Endpoints responding 200 OK.',
        });
        resolve(true);
      }, 1000);
    });
  };

  // Crypto Actions
  const connectCryptoWallet = async (walletData: Omit<CryptoWallet, 'id' | 'organizationId' | 'lastSynced'>): Promise<void> => {
    const newWalletId = `cw-${Date.now()}`;
    const newWallet: CryptoWallet = {
      ...walletData,
      id: newWalletId,
      organizationId: currentOrgId,
      lastSynced: new Date().toISOString(),
    };

    setCryptoWallets(prev => [newWallet, ...prev]);

    // Also register a crypto asset account in the double-entry chart of accounts
    const chartAccount: Account = {
      id: `acc-crypto-${Date.now()}`,
      code: `10${Math.floor(70 + Math.random() * 20)}`,
      name: `${walletData.name} (${walletData.nativeSymbol})`,
      type: 'asset',
      subtype: 'crypto_wallet',
      balance: walletData.fiatValue,
      currency: currentOrg.currency,
      accountNumber: `${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}`,
      provider: walletData.walletProvider.replace(/_/g, ' ').toUpperCase(),
    };
    setAccounts(prev => [...prev, chartAccount]);

    addToast({
      type: 'success',
      title: 'Crypto Wallet Connected',
      message: `Connected ${walletData.name} on ${walletData.chain.toUpperCase()}. Native Balance: ${walletData.balanceNative} ${walletData.nativeSymbol}.`,
    });
  };

  const disconnectCryptoWallet = (id: string) => {
    setCryptoWallets(prev => prev.filter(w => w.id !== id));
    addToast({
      type: 'info',
      title: 'Crypto Wallet Disconnected',
      message: 'Wallet unlinked from accounting workspace.',
    });
  };

  const syncCryptoWallet = async (id: string): Promise<void> => {
    const target = cryptoWallets.find(w => w.id === id);
    if (!target) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        setCryptoWallets(prev =>
          prev.map(w => (w.id === id ? { ...w, lastSynced: new Date().toISOString() } : w))
        );

        // Add 1 fresh incoming crypto settlement
        const newTx: CryptoTransactionItem = {
          id: `ctx-${Date.now()}`,
          walletId: target.id,
          txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
          chain: target.chain,
          timestamp: new Date().toISOString(),
          fromAddress: `${target.chain === 'tron' ? 'TJ' : '0x'}${Math.random().toString(36).substring(2, 10)}...`,
          toAddress: target.address,
          amount: 850,
          coinSymbol: target.tokens[0]?.symbol || target.nativeSymbol,
          fiatAmount: CryptoService.convertCryptoToFiat(850, target.tokens[0]?.symbol || target.nativeSymbol, currentOrg.currency),
          fiatCurrency: currentOrg.currency,
          networkFee: 0.001,
          feeSymbol: target.nativeSymbol,
          type: 'receive',
          reconciliationStatus: 'unmatched',
          suggestedCategory: 'Fresh Produce Wholesale Sales',
          customerOrVendor: 'Direct B2B Web3 Buyer',
        };

        setCryptoTransactions(prev => [newTx, ...prev]);

        addToast({
          type: 'success',
          title: 'Crypto Wallet Synced',
          message: `Fetched latest on-chain transactions for ${target.name}.`,
        });
        resolve();
      }, 900);
    });
  };

  const recordCryptoTransaction = (tx: Omit<CryptoTransactionItem, 'id'>) => {
    const newTx: CryptoTransactionItem = {
      ...tx,
      id: `ctx-${Date.now()}`,
    };
    setCryptoTransactions(prev => [newTx, ...prev]);

    // Also post double-entry entry
    addTransaction({
      date: tx.timestamp.split('T')[0],
      description: `Crypto Settlement (${tx.amount} ${tx.coinSymbol}) - TX: ${tx.txHash.slice(0, 10)}...`,
      amount: tx.fiatAmount,
      currency: tx.fiatCurrency,
      type: tx.type === 'receive' ? 'income' : 'expense',
      debitAccountId: tx.type === 'receive' ? 'acc-1045' : 'acc-5100',
      creditAccountId: tx.type === 'receive' ? 'acc-1200' : 'acc-1010',
      category: tx.suggestedCategory || 'Crypto Web3 Settlements',
      paymentMethod: 'crypto_transfer',
      referenceNumber: `CRYPTO-${tx.txHash.slice(0, 12)}`,
      status: 'reconciled',
    });

    addToast({
      type: 'success',
      title: 'Crypto Transaction Posted',
      message: `${tx.amount} ${tx.coinSymbol} (${formatMoney(tx.fiatAmount)}) recorded in general ledger.`,
    });
  };

  const matchCryptoTransaction = (id: string, invoiceId?: string) => {
    setCryptoTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, reconciliationStatus: 'matched', invoiceId } : t))
    );
    addToast({
      type: 'success',
      title: 'Crypto Transaction Reconciled',
      message: 'On-chain settlement matched to accounting ledger.',
    });
  };

  // Banking Actions
  const connectBankAccount = (newAcc: BankAccountItem, initialFeed?: BankFeedItem[]) => {
    setBankAccounts(prev => [newAcc, ...prev]);

    // Also add to chart of accounts if not present
    const chartAccount: Account = {
      id: `acc-${Date.now()}`,
      code: `10${Math.floor(20 + Math.random() * 70)}`,
      name: newAcc.name,
      type: 'asset',
      subtype: 'cash_and_bank',
      balance: newAcc.balance,
      currency: newAcc.currency,
      accountNumber: newAcc.accountNumber,
      provider: newAcc.institution,
    };
    setAccounts(prev => [...prev, chartAccount]);

    if (initialFeed && initialFeed.length > 0) {
      setBankFeed(prev => [...initialFeed, ...prev]);
    }

    addToast({
      type: 'success',
      title: 'Bank Account Connected',
      message: `Seamless integration established with ${newAcc.institution}. Feeds active.`,
    });
  };

  const disconnectBankAccount = (accountId: string) => {
    setBankAccounts(prev => prev.filter(b => b.id !== accountId));
    addToast({
      type: 'info',
      title: 'Account Disconnected',
      message: 'Bank feed unlinked from workspace.',
    });
  };

  const syncBankAccount = async (accountId: string): Promise<void> => {
    const acc = bankAccounts.find(b => b.id === accountId);
    if (!acc) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        setBankAccounts(prev =>
          prev.map(b => (b.id === accountId ? { ...b, lastSynced: new Date().toISOString() } : b))
        );

        // Add 1 fresh statement feed item
        const today = new Date().toISOString().split('T')[0];
        const newFeed: BankFeedItem = {
          id: `feed-${Date.now()}`,
          accountId: acc.id,
          date: today,
          description: `DIRECT INTERBANK EFT / INCOMING SETTLEMENT REF #${Math.floor(100000 + Math.random() * 900000)}`,
          amount: 1750000,
          balanceAfter: acc.balance + 1750000,
          reference: `EFT-${Math.floor(10000 + Math.random() * 90000)}`,
          reconciliationStatus: 'unmatched',
          suggestedMatchType: 'invoice',
          matchConfidence: 96,
        };
        setBankFeed(prev => [newFeed, ...prev]);

        addToast({
          type: 'success',
          title: 'Feed Refreshed',
          message: `Synced latest transactions from ${acc.institution}.`,
        });
        resolve();
      }, 1000);
    });
  };

  const importStatementTransactions = (accountId: string, parsedTxns: ParsedStatementTransaction[]) => {
    const acc = bankAccounts.find(b => b.id === accountId) || bankAccounts[0];
    let runningBalance = acc.balance;

    const newFeedItems: BankFeedItem[] = parsedTxns.map((pt, idx) => {
      runningBalance += pt.amount;
      return {
        id: `feed-import-${Date.now()}-${idx}`,
        accountId: acc.id,
        date: pt.date,
        description: pt.description,
        amount: pt.amount,
        balanceAfter: pt.balanceAfter || runningBalance,
        reference: pt.reference,
        channel: pt.channel || 'Statement Import',
        reconciliationStatus: 'unmatched',
        suggestedMatchType: pt.amount > 0 ? 'invoice' : 'bill',
        matchConfidence: 91,
      };
    });

    setBankFeed(prev => [...newFeedItems, ...prev]);

    // Apply active rules
    let rulesMatched = 0;
    bankFeedRules.filter(r => r.isActive).forEach(rule => {
      newFeedItems.forEach(item => {
        if (rule.conditionField === 'description' && item.description.toLowerCase().includes(rule.conditionValue.toLowerCase())) {
          rulesMatched++;
        }
      });
    });

    addToast({
      type: 'success',
      title: 'Statement Imported',
      message: `Successfully ingested ${parsedTxns.length} transactions into bank feed. ${rulesMatched > 0 ? `${rulesMatched} matched auto-rules.` : ''}`,
    });
  };

  const executeBankTransfer = (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    fee: number,
    memo?: string
  ) => {
    const fromAcc = accounts.find(a => a.id === fromAccountId) || accounts[0];
    const toAcc = accounts.find(a => a.id === toAccountId) || accounts[1];
    const today = new Date().toISOString().split('T')[0];

    // Double-entry transfer transaction
    addTransaction({
      date: today,
      description: memo || `Internal Float Sweep: ${fromAcc.name} to ${toAcc.name}`,
      amount: amount,
      currency: fromAcc.currency,
      type: 'transfer',
      debitAccountId: toAcc.id,
      creditAccountId: fromAcc.id,
      category: 'Internal Bank & Float Transfers',
      paymentMethod: 'bank_transfer',
      referenceNumber: `SWEEP-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'reconciled',
    });

    // Telecom / Bank transaction fee entry if fee > 0
    if (fee > 0) {
      addTransaction({
        date: today,
        description: `Transfer Tariff Fee for Sweep from ${fromAcc.name}`,
        amount: fee,
        currency: fromAcc.currency,
        type: 'expense',
        debitAccountId: 'acc-5100',
        creditAccountId: fromAcc.id,
        category: 'Mobile Money & Banking Fees',
        paymentMethod: 'bank_transfer',
        referenceNumber: `FEE-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'reconciled',
        aiClassification: {
          category: 'Mobile Money & Banking Fees',
          confidence: 100,
          isAnomaly: false,
          suggestedTaxDeductible: true,
        },
      });
    }

    addToast({
      type: 'success',
      title: 'Float Sweep Executed',
      message: `Transferred ${formatMoney(amount)} from ${fromAcc.name} to ${toAcc.name}. Ledger updated.`,
    });
  };

  const addBankFeedRule = (rule: Omit<BankFeedRule, 'id'>) => {
    const newRule: BankFeedRule = {
      ...rule,
      id: `rule-${Date.now()}`,
    };
    setBankFeedRules(prev => [...prev, newRule]);
    addToast({
      type: 'success',
      title: 'Feed Rule Created',
      message: `Rule "${newRule.name}" active for automated categorization.`,
    });
  };

  const deleteBankFeedRule = (id: string) => {
    setBankFeedRules(prev => prev.filter(r => r.id !== id));
    addToast({
      type: 'info',
      title: 'Feed Rule Removed',
      message: 'Rule deleted from bank automation queue.',
    });
  };

  const toggleBankFeedRule = (id: string) => {
    setBankFeedRules(prev =>
      prev.map(r => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const triggerStkPush = async (req: {
    invoiceId: string;
    phoneNumber: string;
    amount: number;
    gateway: 'airtel_moneypay' | 'mpesa' | 'mtn_momo';
  }): Promise<{ success: boolean; reference: string }> => {
    const isMpesa = req.gateway === 'mpesa';
    const isMtn = req.gateway === 'mtn_momo';
    const prefix = isMpesa ? 'MPESA' : isMtn ? 'MTN-MOMO' : 'AIRTEL';
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const reference = `${prefix}-${randomCode}`;

    const gatewayTitle = isMpesa ? 'M-Pesa STK Push' : isMtn ? 'MTN MoMo RequestToPay' : 'Airtel MoneyPay Prompt';
    const paymentMethodName = isMpesa ? 'mobile_money_mpesa' : isMtn ? 'mobile_money_mtn' : 'mobile_money_airtel';
    const debitAccId = isMpesa ? 'acc-1045' : isMtn ? 'acc-1030' : 'acc-1040';

    return new Promise((resolve) => {
      addToast({
        type: 'info',
        title: `${gatewayTitle} Sent`,
        message: `Prompt sent to ${req.phoneNumber}. Awaiting PIN authorization on customer phone...`,
      });

      setTimeout(() => {
        // Record payment in double-entry ledger
        recordInvoicePayment(req.invoiceId, req.amount, paymentMethodName);

        // Add transaction
        addTransaction({
          date: new Date().toISOString().split('T')[0],
          description: `${isMpesa ? 'M-Pesa Lipa na M-Pesa' : isMtn ? 'MTN MoMo Merchant Collection' : 'Airtel MoneyPay Instant Payment'} from ${req.phoneNumber}`,
          amount: req.amount,
          currency: 'UGX',
          type: 'income',
          debitAccountId: debitAccId,
          creditAccountId: 'acc-1200',
          category: 'Fresh Produce Wholesale Sales',
          paymentMethod: paymentMethodName,
          referenceNumber: reference,
          status: 'reconciled',
          aiClassification: {
            category: 'Fresh Produce Wholesale Sales',
            confidence: 100,
            isAnomaly: false,
            suggestedTaxDeductible: false,
          },
          isPersonalFund: false,
          invoiceId: req.invoiceId,
        });

        addToast({
          type: 'success',
          title: `Payment Received (${reference})`,
          message: `Successfully collected ${formatMoney(req.amount)} via ${isMpesa ? 'M-Pesa' : isMtn ? 'MTN MoMo' : 'Airtel MoneyPay'}. Invoice reconciled.`,
        });

        resolve({ success: true, reference });
      }, 1800);
    });
  };

  const verifyCustomDomain = async (domain: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setOrganizations(prev =>
          prev.map(org => {
            if (org.id === currentOrgId) {
              return {
                ...org,
                customDomain: {
                  domain,
                  verified: true,
                  sslActive: true,
                  cnameTarget: 'cname.ledgerai.africa',
                  txtVerificationCode: `ledgerai-verify-ug-${Math.floor(10000000 + Math.random() * 90000000)}`,
                  lastChecked: new Date().toISOString(),
                },
              };
            }
            return org;
          })
        );
        addToast({
          type: 'success',
          title: 'Custom Domain Connected',
          message: `DNS records verified for ${domain}. SSL certificate active.`,
        });
        resolve(true);
      }, 1400);
    });
  };

  // Transaction handlers
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt' | 'organizationId'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
      organizationId: currentOrgId,
    };
    setTransactions(prev => [newTx, ...prev]);

    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === tx.debitAccountId) {
          return { ...acc, balance: acc.balance + tx.amount };
        }
        if (acc.id === tx.creditAccountId) {
          return { ...acc, balance: acc.balance - tx.amount };
        }
        return acc;
      })
    );

    const audit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: 'Sarah Namubiru',
      userRole: 'Finance Manager',
      action: 'Created Transaction',
      entityType: 'Transaction',
      entityId: newTx.id,
      newValue: `${tx.type.toUpperCase()}: ${formatMoney(tx.amount)} - ${tx.description}`,
      isAiAction: false,
      ipAddress: '197.239.12.88 (Kampala, Uganda)',
      organizationId: currentOrgId,
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast({
      type: 'success',
      title: 'Transaction Recorded',
      message: `${formatMoney(tx.amount)} added to ${tx.category}`,
    });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast({
      type: 'info',
      title: 'Transaction Updated',
      message: 'Changes saved to ledger.',
    });
  };

  const bulkCategorizeTransactions = (ids: string[], category: string) => {
    setTransactions(prev =>
      prev.map(t => (ids.includes(t.id) ? { ...t, category } : t))
    );
    addToast({
      type: 'success',
      title: 'Bulk Categorization',
      message: `Updated ${ids.length} transactions to "${category}"`,
    });
  };

  const bulkReconcileTransactions = (ids: string[]) => {
    setTransactions(prev =>
      prev.map(t => (ids.includes(t.id) ? { ...t, status: 'reconciled' } : t))
    );
    addToast({
      type: 'success',
      title: 'Bulk Reconciliation',
      message: `Marked ${ids.length} transactions as Reconciled`,
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast({
      type: 'info',
      title: 'Transaction Deleted',
      message: 'Record removed from ledger.',
    });
  };

  // Invoice handlers
  const addInvoice = (inv: Omit<Invoice, 'id' | 'createdAt' | 'organizationId'>) => {
    const newInv: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      organizationId: currentOrgId,
    };
    setInvoices(prev => [newInv, ...prev]);

    setAccounts(prev =>
      prev.map(acc => {
        if (acc.code === '1200') {
          return { ...acc, balance: acc.balance + newInv.balanceDue };
        }
        if (acc.code === '4010') {
          return { ...acc, balance: acc.balance + newInv.subtotal };
        }
        if (acc.code === '2100') {
          return { ...acc, balance: acc.balance + newInv.taxTotal };
        }
        return acc;
      })
    );

    addToast({
      type: 'success',
      title: 'Invoice Created',
      message: `${newInv.invoiceNumber} for ${newInv.customerName} (${formatMoney(newInv.total)})`,
    });
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const recordInvoicePayment = (id: string, amount: number, paymentMethod: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const newAmountPaid = inv.amountPaid + amount;
          const newBalanceDue = Math.max(0, inv.total - newAmountPaid);
          const newStatus: InvoiceStatus = newBalanceDue === 0 ? 'paid' : 'partially_paid';
          return {
            ...inv,
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    addToast({
      type: 'success',
      title: 'Payment Recorded',
      message: `Received ${formatMoney(amount)} via ${paymentMethod.replace(/_/g, ' ').toUpperCase()}`,
    });
  };

  const sendInvoiceReminder = (id: string, tone: 'friendly' | 'professional' | 'firm') => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          return {
            ...inv,
            remindersSentCount: (inv.remindersSentCount || 0) + 1,
            lastReminderDate: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );

    addToast({
      type: 'info',
      title: `${tone.toUpperCase()} Reminder Sent`,
      message: `Automated payment reminder dispatched via SMS & WhatsApp.`,
    });
  };

  // Bill handlers
  const addBill = (bill: Omit<Bill, 'id' | 'createdAt' | 'organizationId'>) => {
    const newBill: Bill = {
      ...bill,
      id: `bill-${Date.now()}`,
      createdAt: new Date().toISOString(),
      organizationId: currentOrgId,
    };
    setBills(prev => [newBill, ...prev]);

    setAccounts(prev =>
      prev.map(acc => {
        if (acc.code === '2010') {
          return { ...acc, balance: acc.balance + newBill.balanceDue };
        }
        return acc;
      })
    );

    addToast({
      type: 'success',
      title: 'Supplier Bill Logged',
      message: `${newBill.billNumber} from ${newBill.supplierName}`,
    });
  };

  const recordBillPayment = (id: string, amount: number) => {
    setBills(prev =>
      prev.map(b => {
        if (b.id === id) {
          const newPaid = b.amountPaid + amount;
          const newDue = Math.max(0, b.total - newPaid);
          return {
            ...b,
            amountPaid: newPaid,
            balanceDue: newDue,
            status: newDue === 0 ? 'paid' : 'partially_paid',
          };
        }
        return b;
      })
    );
    addToast({
      type: 'success',
      title: 'Bill Payment Recorded',
      message: `Disbursed ${formatMoney(amount)} to supplier.`,
    });
  };

  // Customer / Supplier / Product handlers
  const addCustomer = (cust: Omit<Customer, 'id' | 'createdAt' | 'organizationId'>) => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
      organizationId: currentOrgId,
    };
    setCustomers(prev => [newCust, ...prev]);
    addToast({
      type: 'success',
      title: 'Customer Added',
      message: `${newCust.name} added to directory`,
    });
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addSupplier = (sup: Omit<Supplier, 'id' | 'createdAt' | 'organizationId'>) => {
    const newSup: Supplier = {
      ...sup,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString(),
      organizationId: currentOrgId,
    };
    setSuppliers(prev => [newSup, ...prev]);
    addToast({
      type: 'success',
      title: 'Supplier Added',
      message: `${newSup.name} added to directory`,
    });
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const addProduct = (prod: Omit<Product, 'id' | 'organizationId'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      organizationId: currentOrgId,
    };
    setProducts(prev => [newProd, ...prev]);
    addToast({
      type: 'success',
      title: 'Item Added to Catalog',
      message: `${newProd.name} (${newProd.sku})`,
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Bank reconciliation
  const matchBankFeedItem = (feedId: string, _targetId: string, targetType: 'transaction' | 'invoice' | 'bill') => {
    setBankFeed(prev =>
      prev.map(item => (item.id === feedId ? { ...item, reconciliationStatus: 'matched' } : item))
    );
    addToast({
      type: 'success',
      title: 'Feed Item Reconciled',
      message: `Matched bank feed entry to ${targetType.toUpperCase()}`,
    });
  };

  const ignoreBankFeedItem = (feedId: string) => {
    setBankFeed(prev =>
      prev.map(item => (item.id === feedId ? { ...item, reconciliationStatus: 'ignored' } : item))
    );
    addToast({
      type: 'info',
      title: 'Feed Item Ignored',
      message: 'Item removed from pending reconciliation queue.',
    });
  };

  // OCR
  const addOcrReceipt = (data: OcrExtractedData) => {
    setOcrReceipts(prev => [data, ...prev]);
  };

  const convertOcrToExpense = (ocrId: string, category: string, accountId: string) => {
    const item = ocrReceipts.find(o => o.id === ocrId);
    if (!item) return;

    addTransaction({
      date: item.date,
      description: `${item.merchantName} - OCR Extracted (${item.referenceNumber})`,
      amount: item.totalAmount,
      currency: item.currency,
      type: 'expense',
      debitAccountId: 'acc-5100',
      creditAccountId: accountId || 'acc-1010',
      category,
      customerOrSupplier: item.merchantName,
      paymentMethod: item.paymentMethod,
      referenceNumber: item.referenceNumber,
      status: 'reconciled',
      aiClassification: {
        category,
        confidence: item.confidenceScore,
        isAnomaly: false,
        suggestedTaxDeductible: true,
      },
      isPersonalFund: false,
    });

    setOcrReceipts(prev => prev.filter(o => o.id !== ocrId));
    addToast({
      type: 'success',
      title: 'Receipt Posted to Expenses',
      message: `${formatMoney(item.totalAmount)} recorded as ${category}`,
    });
  };

  // Documents
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadDate' | 'organizationId'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      organizationId: currentOrgId,
    };
    setDocuments(prev => [newDoc, ...prev]);
    addToast({
      type: 'success',
      title: 'Document Stored',
      message: `${newDoc.name} securely archived and indexed for AI search.`,
    });
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    addToast({
      type: 'info',
      title: 'Document Removed',
      message: 'File deleted from vault.',
    });
  };

  // Insights
  const resolveInsight = (id: string) => {
    setAiInsights(prev =>
      prev.map(i => (i.id === id ? { ...i, resolved: true } : i))
    );
    addToast({
      type: 'info',
      title: 'Insight Resolved',
      message: 'Marked as reviewed.',
    });
  };

  // Team
  const inviteTeamMember = (name: string, email: string, role: TeamMember['role']) => {
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role,
      status: 'invited',
      lastActive: 'Never (Invite Pending)',
      organizationId: currentOrgId,
    };
    setTeamMembers(prev => [...prev, newMember]);
    addToast({
      type: 'success',
      title: 'Invitation Sent',
      message: `Invited ${email} as ${role}`,
    });
  };

  // AI Copilot Query Execution
  const sendAiQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: query,
    };

    setAiMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      import('../services/aiCopilotService').then(({ AiCopilotService }) => {
        const result = AiCopilotService.queryCopilot(query, {
          accounts,
          transactions,
          invoices,
          customers,
          suppliers,
          currencySymbol,
        });

        const assistantMsg: AiMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: result.directAnswer,
          structuredData: result,
        };

        setAiMessages(prev => [...prev, assistantMsg]);
      });
    }, 600);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedPeriod,
        setSelectedPeriod,
        organizations,
        currentOrg,
        switchOrganization,
        updateOrganization,
        addBusinessOrganization,
        verifyCustomDomain,
        updateAirtelGateway,
        updateMpesaGateway,
        updateMtnMomoGateway,
        testGatewayConnection,
        triggerStkPush,
        openBankingConfig,
        updateOpenBankingConfig,
        cryptoWallets,
        cryptoTransactions,
        cryptoMarketRates,
        connectCryptoWallet,
        disconnectCryptoWallet,
        syncCryptoWallet,
        recordCryptoTransaction,
        matchCryptoTransaction,
        accounts,
        transactions,
        invoices,
        bills,
        customers,
        suppliers,
        products,
        bankAccounts,
        bankFeed,
        bankFeedRules,
        ocrReceipts,
        documents,
        aiInsights,
        auditLogs,
        teamMembers,
        pnlReport,
        balanceSheetReport,
        cashFlowReport,
        trialBalanceReport,
        taxSummaryReport,
        receivablesAging,
        payablesAging,
        connectBankAccount,
        disconnectBankAccount,
        syncBankAccount,
        importStatementTransactions,
        executeBankTransfer,
        addBankFeedRule,
        deleteBankFeedRule,
        toggleBankFeedRule,
        addTransaction,
        updateTransaction,
        bulkCategorizeTransactions,
        bulkReconcileTransactions,
        deleteTransaction,
        addInvoice,
        updateInvoiceStatus,
        recordInvoicePayment,
        sendInvoiceReminder,
        addBill,
        recordBillPayment,
        addCustomer,
        updateCustomer,
        addSupplier,
        updateSupplier,
        addProduct,
        updateProduct,
        matchBankFeedItem,
        ignoreBankFeedItem,
        addOcrReceipt,
        convertOcrToExpense,
        addDocument,
        deleteDocument,
        resolveInsight,
        inviteTeamMember,
        aiMessages,
        sendAiQuery,
        isCommandMenuOpen,
        setIsCommandMenuOpen,
        toasts,
        addToast,
        removeToast,
        isAccaMode,
        setIsAccaMode,
        accaWorkingPapers,
        updateWorkingPaper,
        accaMateriality,
        updateMateriality,
        accaAuditRisks,
        updateAuditRiskStatus,
        accaAdjustingJournals,
        addAdjustingJournal,
        accaAuditReport,
        signOffAuditReport,
        theme,
        currencySymbol,
        formatMoney,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
