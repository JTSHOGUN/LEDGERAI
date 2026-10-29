export type CurrencyCode = 'UGX' | 'KES' | 'TZS' | 'RWF' | 'NGN' | 'GHS' | 'ZAR' | 'ZMW' | 'ETB' | 'USD' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
  exchangeRateToUGX: number; // 1 unit in UGX
}

export type CountryCode = 'UG' | 'KE' | 'TZ' | 'RW' | 'NG' | 'GH' | 'ZA' | 'ZM' | 'ET';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  defaultCurrency: CurrencyCode;
  taxAuthority: string;
  standardVatRate: number;
  withholdingTaxRate: number;
  mobileMoneyProviders: string[];
}

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type AccountSubtype = 
  | 'cash_and_bank' 
  | 'mobile_money'
  | 'crypto_wallet'
  | 'accounts_receivable' 
  | 'inventory' 
  | 'fixed_asset' 
  | 'accounts_payable' 
  | 'credit_card' 
  | 'tax_payable' 
  | 'retained_earnings' 
  | 'sales_revenue' 
  | 'service_revenue' 
  | 'cost_of_goods' 
  | 'operating_expense' 
  | 'tax_expense' 
  | 'financial_fee';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  subtype: AccountSubtype;
  balance: number;
  currency: CurrencyCode;
  isSystem?: boolean;
  accountNumber?: string;
  provider?: string; // MTN, Airtel MoneyPay, M-Pesa, Stanbic, Centenary, Solana, Binance, Ethereum, etc.
}

export type TransactionType = 'income' | 'expense' | 'transfer' | 'journal';
export type PaymentMethod = 
  | 'mobile_money_mtn' 
  | 'mobile_money_airtel' 
  | 'mobile_money_mpesa' 
  | 'crypto_transfer'
  | 'bank_transfer' 
  | 'cash' 
  | 'card' 
  | 'cheque';
export type ReconciliationStatus = 'reconciled' | 'unreconciled' | 'pending_match';

export interface Transaction {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  description: string;
  amount: number;
  currency: CurrencyCode;
  type: TransactionType;
  debitAccountId: string;
  creditAccountId: string;
  category: string;
  customerOrSupplier?: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  status: ReconciliationStatus;
  aiClassification?: {
    category: string;
    confidence: number;
    isAnomaly: boolean;
    anomalyReason?: string;
    suggestedTaxDeductible: boolean;
  };
  isPersonalFund?: boolean;
  receiptId?: string;
  invoiceId?: string;
  billId?: string;
  notes?: string;
  createdAt: string;
  organizationId: string;
}

export interface JournalLine {
  accountId: string;
  description?: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  narration: string;
  lines: JournalLine[];
  organizationId: string;
  createdById: string;
  createdAt: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'overdue';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 18 for 18% VAT
  discountPercent?: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerTin?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceLineItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  currency: CurrencyCode;
  notes?: string;
  paymentInstructions?: string;
  mobileMoneyPaymentNumber?: string;
  bankAccountDetails?: string;
  cryptoPaymentDetails?: {
    walletAddress: string;
    chain: string;
    coinSymbol: string;
    cryptoAmountDue: number;
  };
  remindersSentCount?: number;
  lastReminderDate?: string;
  organizationId: string;
  createdAt: string;
}

export type BillStatus = 'draft' | 'awaiting_approval' | 'approved' | 'partially_paid' | 'paid' | 'overdue';

export interface BillLineItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  supplierId: string;
  supplierName: string;
  issueDate: string;
  dueDate: string;
  status: BillStatus;
  items: BillLineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  currency: CurrencyCode;
  notes?: string;
  receiptAttachmentUrl?: string;
  organizationId: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tin?: string;
  preferredPaymentMethod: PaymentMethod;
  totalRevenue: number;
  outstandingBalance: number;
  invoiceCount: number;
  averagePaymentDays: number;
  creditStatus: 'excellent' | 'good' | 'average' | 'overdue_risk';
  aiInsight?: string;
  organizationId: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tin?: string;
  paymentTerms: string; // e.g. 'Net 15', 'Net 30', 'Cash on Delivery'
  totalPurchases: number;
  outstandingBills: number;
  billsCount: number;
  aiInsight?: string;
  organizationId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  type: 'product' | 'service';
  unitPrice: number;
  costPrice: number;
  taxRate: number;
  inventoryQuantity: number;
  reorderPoint: number;
  unit: string; // 'pcs', 'kg', 'hours', 'boxes'
  currency: CurrencyCode;
  organizationId: string;
}

export interface BankAccountItem {
  id: string;
  name: string;
  institution: string; // Stanbic Bank Uganda, Centenary Bank, Equity Bank, KCB, Absa, GTBank, Standard Bank, etc.
  type: 'bank' | 'mobile_money' | 'cash';
  accountNumber: string;
  accountHolder: string;
  balance: number;
  currency: CurrencyCode;
  lastSynced: string;
  isConnected: boolean;
  status: 'active' | 'syncing' | 'error';
  swiftBic?: string;
  country?: CountryCode;
  connectionMethod?: 'open_banking' | 'direct_api' | 'sftp_host_to_host' | 'manual_statement';
  openBankingProvider?: 'mono_africa' | 'stitch_money' | 'okra' | 'direct_bank_api';
  organizationId: string;
}

export interface BankFeedItem {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number; // positive = credit/deposit, negative = debit/withdrawal
  balanceAfter: number;
  reference: string;
  channel?: string;
  suggestedMatchId?: string;
  suggestedMatchType?: 'transaction' | 'invoice' | 'bill';
  matchConfidence?: number;
  reconciliationStatus: 'unmatched' | 'matched' | 'ignored';
}

export interface BankFeedRule {
  id: string;
  name: string;
  conditionField: 'description' | 'amount_greater' | 'amount_less' | 'reference';
  conditionValue: string;
  actionCategory: string;
  actionAccountId?: string;
  autoReconcile: boolean;
  isActive: boolean;
}

export interface OpenBankingConfig {
  enabled: boolean;
  provider: 'mono_africa' | 'stitch_money' | 'okra' | 'direct_bank_api';
  monoAppId?: string;
  monoSecretKey?: string;
  stitchClientId?: string;
  stitchClientSecret?: string;
  autoSyncFrequency: 'realtime' | 'every_4_hours' | 'daily' | 'manual';
  lastSyncTimestamp: string;
  status: 'connected' | 'disconnected' | 'testing';
}

// CRYPTO WALLET & ASSET TYPES
export type CryptoChain = 
  | 'solana' 
  | 'ethereum' 
  | 'binance' 
  | 'bitcoin' 
  | 'polygon' 
  | 'tron' 
  | 'arbitrum' 
  | 'avalanche' 
  | 'base';

export type CryptoWalletProvider = 
  | 'phantom' 
  | 'metamask' 
  | 'binance_pay' 
  | 'coinbase' 
  | 'trust_wallet' 
  | 'solflare' 
  | 'ledger_hardware' 
  | 'manual_address';

export interface CryptoTokenItem {
  symbol: string;
  name: string;
  balance: number;
  fiatValue: number;
  chain: CryptoChain;
  contractAddress?: string;
}

export interface CryptoWallet {
  id: string;
  name: string;
  chain: CryptoChain;
  walletProvider: CryptoWalletProvider;
  address: string; // Public address
  encryptedSecret?: string; // Client-side AES-256 encrypted viewing key/secret
  encryptionSalt?: string;
  isEncrypted: boolean;
  balanceNative: number;
  nativeSymbol: string;
  fiatValue: number;
  fiatCurrency: CurrencyCode;
  tokens: CryptoTokenItem[];
  lastSynced: string;
  isConnected: boolean;
  status: 'active' | 'syncing' | 'error';
  organizationId: string;
  explorerUrl: string;
}

export interface CryptoTransactionItem {
  id: string;
  walletId: string;
  txHash: string;
  chain: CryptoChain;
  timestamp: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  coinSymbol: string;
  fiatAmount: number;
  fiatCurrency: CurrencyCode;
  networkFee: number;
  feeSymbol: string;
  type: 'receive' | 'send' | 'swap' | 'stake_reward';
  reconciliationStatus: 'unmatched' | 'matched' | 'ignored';
  suggestedCategory?: string;
  invoiceId?: string;
  customerOrVendor?: string;
}

export interface CryptoMarketCoin {
  symbol: string;
  name: string;
  chain: CryptoChain;
  priceUSD: number;
  priceUGX: number;
  priceKES: number;
  priceNGN: number;
  priceZAR: number;
  change24h: number;
  marketCapUSD: number;
  icon: string;
}

export interface OcrExtractedData {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'receipt' | 'invoice' | 'bill' | 'statement';
  merchantName: string;
  merchantTin?: string;
  date: string;
  referenceNumber: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  currency: CurrencyCode;
  paymentMethod: PaymentMethod;
  suggestedCategory: string;
  confidenceScore: number; // 0 to 100
  isDuplicate: boolean;
  duplicateOfId?: string;
  organizationId: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'receipt' | 'invoice' | 'bill' | 'tax_document' | 'contract' | 'bank_statement';
  fileSize: string;
  uploadDate: string;
  tags: string[];
  linkedEntityId?: string;
  linkedEntityType?: 'transaction' | 'invoice' | 'bill' | 'customer' | 'supplier';
  ocrStatus: 'processed' | 'pending' | 'failed';
  extractedTotal?: number;
  currency: CurrencyCode;
  organizationId: string;
}

export interface AIInsightItem {
  id: string;
  title: string;
  type: 'anomaly' | 'opportunity' | 'tax_alert' | 'cashflow_warning' | 'collection_tip';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impactAmount?: number;
  currency: CurrencyCode;
  suggestedAction: string;
  actionRoute?: string;
  timestamp: string;
  resolved: boolean;
  organizationId: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  isAiAction: boolean;
  ipAddress: string;
  organizationId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Accountant' | 'Finance Manager' | 'Employee' | 'Viewer';
  status: 'active' | 'invited' | 'disabled';
  lastActive: string;
  organizationId: string;
}

export interface AirtelMoneyPayConfig {
  enabled: boolean;
  environment: 'sandbox' | 'production';
  merchantId: string; // e.g. "AIRTEL-UG-887211"
  clientId: string;
  clientSecret: string;
  country: CountryCode;
  currency: CurrencyCode;
  webhookUrl: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastPing: string;
  autoReconcile: boolean;
}

export interface MpesaDarajaConfig {
  enabled: boolean;
  environment: 'sandbox' | 'production';
  businessShortCode: string; // Paybill e.g. "522522" or Till e.g. "904210"
  accountType: 'paybill' | 'till_number';
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  webhookCallbackUrl: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastPing: string;
  autoReconcile: boolean;
}

export interface MtnMomoConfig {
  enabled: boolean;
  environment: 'sandbox' | 'production';
  apiUserId: string; // MTN MoMo API User GUID
  apiKey: string; // MTN MoMo API Key
  primarySubscriptionKey: string; // Ocp-Apim-Subscription-Key
  secondarySubscriptionKey?: string;
  merchantNumber: string; // e.g. "Till #654210"
  country: CountryCode;
  currency: CurrencyCode;
  webhookUrl: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastPing: string;
  autoReconcile: boolean;
  collectionMode: 'request_to_pay' | 'b2b_payout' | 'open_api';
}

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  country: CountryCode;
  currency: CurrencyCode;
  tin: string; // Tax Identification Number
  efrisRegistered: boolean;
  address: string;
  city: string;
  phone: string;
  email: string;
  fiscalYearEnd: string; // e.g. "December 31" or "June 30"
  customDomain?: {
    domain: string;
    verified: boolean;
    sslActive: boolean;
    cnameTarget: string;
    txtVerificationCode: string;
    lastChecked: string;
  };
  airtelMoneyPay?: AirtelMoneyPayConfig;
  mpesaDaraja?: MpesaDarajaConfig;
  mtnMomo?: MtnMomoConfig;
  openBankingConfig?: OpenBankingConfig;
  cryptoWalletsEnabled?: boolean;
  industry: string;
  plan: 'Starter' | 'Growth' | 'Business' | 'Enterprise';
  maxBusinessesAllowed: number; // Starter: 3, Growth: 10, Business: 25, Enterprise: 999
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  structuredData?: {
    directAnswer: string;
    supportingNumbers: { label: string; value: string; trend?: string }[];
    explanation: string;
    recommendation: string;
    relatedAction?: {
      label: string;
      route: string;
    };
  };
}

export interface ForecastPoint {
  period: string; // Month name or Week
  revenueBase: number;
  revenueOptimistic: number;
  revenueConservative: number;
  expenseBase: number;
  expenseOptimistic: number;
  expenseConservative: number;
  netCashBase: number;
  netCashOptimistic: number;
  netCashConservative: number;
}

// ACCA & CHARTERED IFRS AUDIT WORKPAPERS
export type IfrsStandardCode = 
  | 'IFRS 15' 
  | 'IFRS 16' 
  | 'IFRS 9' 
  | 'IAS 12' 
  | 'IAS 36' 
  | 'IAS 24' 
  | 'IAS 10' 
  | 'IAS 41';

export interface AccaWorkingPaper {
  id: string;
  standard: IfrsStandardCode;
  title: string;
  description: string;
  status: 'draft' | 'in_review' | 'signed_off' | 'not_applicable';
  preparedBy: string;
  reviewedBy: string;
  signOffDate?: string;
  notes: string;
  keyMetrics: Record<string, string | number>;
}

export interface AccaMateriality {
  benchmarkType: 'revenue' | 'profit_before_tax' | 'total_assets' | 'net_assets';
  benchmarkAmount: number;
  overallPercentage: number;
  overallMateriality: number;
  performancePercentage: number;
  performanceMateriality: number;
  trivialThresholdPercentage: number;
  trivialThreshold: number;
  rationale: string;
}

export interface AccaAuditRiskItem {
  id: string;
  area: string;
  assertion: 'Completeness' | 'Accuracy' | 'Cut-Off' | 'Existence' | 'Rights & Obligations' | 'Valuation & Allocation';
  inherentRisk: 'Low' | 'Medium' | 'High' | 'Significant';
  controlRisk: 'Low' | 'Medium' | 'High';
  auditResponse: string;
  testedBy: string;
  status: 'open' | 'testing' | 'concluded';
}

export interface AccaAdjustingJournal {
  id: string;
  reference: string;
  date: string;
  standard: string;
  description: string;
  status: 'proposed' | 'posted' | 'reversed';
  lines: { accountId: string; accountName: string; debit: number; credit: number; explanation: string }[];
  approvedBy: string;
}

export interface AccaAuditReport {
  id: string;
  organizationId: string;
  fiscalYear: string;
  opinionType: 'unmodified' | 'qualified' | 'adverse' | 'disclaimer';
  keyAuditMatters: { title: string; standard: string; issue: string; auditorResponse: string }[];
  goingConcernEvaluation: {
    status: 'Satisfactory' | 'Material Uncertainty' | 'Going Concern Inappropriate';
    details: string;
    zScore: number;
    currentRatio: number;
  };
  auditorName: string;
  auditorDesignation: 'ACCA' | 'FCCA' | 'CPA (ICPAU)' | 'CPA (ICPAK)' | 'FCA';
  accaMemberNumber: string;
  firmName: string;
  signedDate: string;
  digitalSignatureHash: string;
}
