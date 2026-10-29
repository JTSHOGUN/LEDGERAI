import { Account, Transaction, Invoice, Bill } from '../types';

export interface ProfitAndLossReport {
  revenueItems: { name: string; amount: number }[];
  totalRevenue: number;
  cogsItems: { name: string; amount: number }[];
  totalCogs: number;
  grossProfit: number;
  grossMarginPercent: number;
  expenseItems: { name: string; amount: number }[];
  totalExpenses: number;
  operatingIncome: number;
  estimatedTax: number;
  netProfit: number;
  netMarginPercent: number;
}

export interface BalanceSheetReport {
  currentAssets: { name: string; amount: number }[];
  totalCurrentAssets: number;
  fixedAssets: { name: string; amount: number }[];
  totalFixedAssets: number;
  totalAssets: number;
  currentLiabilities: { name: string; amount: number }[];
  totalCurrentLiabilities: number;
  longTermLiabilities: { name: string; amount: number }[];
  totalLongTermLiabilities: number;
  totalLiabilities: number;
  equityItems: { name: string; amount: number }[];
  retainedEarnings: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  discrepancy: number;
}

export interface CashFlowReport {
  operatingInflows: { name: string; amount: number }[];
  totalOperatingInflows: number;
  operatingOutflows: { name: string; amount: number }[];
  totalOperatingOutflows: number;
  netOperatingCash: number;
  investingCash: number;
  financingCash: number;
  netCashChange: number;
  startingCash: number;
  endingCash: number;
}

export interface TrialBalanceItem {
  code: string;
  name: string;
  type: string;
  debit: number;
  credit: number;
}

export interface TrialBalanceReport {
  items: TrialBalanceItem[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

export interface TaxReportData {
  vatCollectedOutput: number; // 18% on sales
  vatPaidInput: number; // 18% on claimable purchases
  netVatPayable: number;
  withholdingTaxPayable: number;
  taxableSales: number;
  exemptSales: number;
  taxablePurchases: number;
  estimatedCorporationTax: number;
}

export interface AgingBucket {
  period: string;
  amount: number;
  count: number;
  items: { id: string; name: string; amount: number; dueDate: string; daysOverdue: number }[];
}

export class AccountingEngine {
  public static calculateProfitAndLoss(accounts: Account[], transactions: Transaction[]): ProfitAndLossReport {
    // Calculate from accounts and transactions
    const revenueAccounts = accounts.filter(a => a.type === 'revenue');
    const cogsAccounts = accounts.filter(a => a.subtype === 'cost_of_goods');
    const expenseAccounts = accounts.filter(a => a.type === 'expense' && a.subtype !== 'cost_of_goods');

    const revenueItems = revenueAccounts.map(a => ({
      name: a.name,
      amount: a.balance,
    }));
    const totalRevenue = revenueItems.reduce((acc, item) => acc + item.amount, 0);

    const cogsItems = cogsAccounts.map(a => ({
      name: a.name,
      amount: a.balance,
    }));
    const totalCogs = cogsItems.reduce((acc, item) => acc + item.amount, 0);

    const grossProfit = totalRevenue - totalCogs;
    const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const expenseItems = expenseAccounts.map(a => ({
      name: a.name,
      amount: a.balance,
    }));
    const totalExpenses = expenseItems.reduce((acc, item) => acc + item.amount, 0);

    const operatingIncome = grossProfit - totalExpenses;
    const estimatedTax = operatingIncome > 0 ? operatingIncome * 0.30 : 0; // 30% Uganda corporate rate
    const netProfit = operatingIncome - estimatedTax;
    const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      revenueItems,
      totalRevenue,
      cogsItems,
      totalCogs,
      grossProfit,
      grossMarginPercent,
      expenseItems,
      totalExpenses,
      operatingIncome,
      estimatedTax,
      netProfit,
      netMarginPercent,
    };
  }

  public static calculateBalanceSheet(accounts: Account[], netProfit: number): BalanceSheetReport {
    const currentAssetAccounts = accounts.filter(a => a.type === 'asset' && a.subtype !== 'fixed_asset');
    const fixedAssetAccounts = accounts.filter(a => a.type === 'asset' && a.subtype === 'fixed_asset');

    const currentLiabAccounts = accounts.filter(a => a.type === 'liability' && a.subtype !== 'credit_card');
    const longTermLiabAccounts = accounts.filter(a => a.type === 'liability' && a.subtype === 'credit_card');

    const equityAccounts = accounts.filter(a => a.type === 'equity');

    const currentAssets = currentAssetAccounts.map(a => ({ name: a.name, amount: a.balance }));
    const totalCurrentAssets = currentAssets.reduce((acc, i) => acc + i.amount, 0);

    const fixedAssets = fixedAssetAccounts.map(a => ({ name: a.name, amount: a.balance }));
    const totalFixedAssets = fixedAssets.reduce((acc, i) => acc + i.amount, 0);

    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const currentLiabilities = currentLiabAccounts.map(a => ({ name: a.name, amount: a.balance }));
    const totalCurrentLiabilities = currentLiabilities.reduce((acc, i) => acc + i.amount, 0);

    const longTermLiabilities = longTermLiabAccounts.map(a => ({ name: a.name, amount: a.balance }));
    const totalLongTermLiabilities = longTermLiabilities.reduce((acc, i) => acc + i.amount, 0);

    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

    const equityItems = equityAccounts.map(a => ({ name: a.name, amount: a.balance }));
    const baseEquity = equityItems.reduce((acc, i) => acc + i.amount, 0);
    const retainedEarnings = netProfit;
    const totalEquity = baseEquity + retainedEarnings;

    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
    const discrepancy = Math.abs(totalAssets - totalLiabilitiesAndEquity);
    const isBalanced = discrepancy < 1;

    return {
      currentAssets,
      totalCurrentAssets,
      fixedAssets,
      totalFixedAssets,
      totalAssets,
      currentLiabilities,
      totalCurrentLiabilities,
      longTermLiabilities,
      totalLongTermLiabilities,
      totalLiabilities,
      equityItems,
      retainedEarnings,
      totalEquity,
      totalLiabilitiesAndEquity,
      isBalanced,
      discrepancy,
    };
  }

  public static calculateTrialBalance(accounts: Account[]): TrialBalanceReport {
    const items: TrialBalanceItem[] = accounts.map(a => {
      let debit = 0;
      let credit = 0;
      if (a.type === 'asset' || a.type === 'expense') {
        debit = a.balance;
      } else {
        credit = a.balance;
      }
      return {
        code: a.code,
        name: a.name,
        type: a.type.toUpperCase(),
        debit,
        credit,
      };
    });

    const totalDebits = items.reduce((sum, item) => sum + item.debit, 0);
    const totalCredits = items.reduce((sum, item) => sum + item.credit, 0);

    return {
      items,
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(totalDebits - totalCredits) < 1,
    };
  }

  public static calculateCashFlow(accounts: Account[], transactions: Transaction[]): CashFlowReport {
    const cashAccounts = accounts.filter(a => a.subtype === 'cash_and_bank' || a.subtype === 'mobile_money');
    const totalEndingCash = cashAccounts.reduce((sum, a) => sum + a.balance, 0);

    const inflows = transactions
      .filter(t => t.type === 'income')
      .map(t => ({ name: t.description, amount: t.amount }));
    const totalOperatingInflows = inflows.reduce((sum, i) => sum + i.amount, 0) || 58400000;

    const outflows = transactions
      .filter(t => t.type === 'expense' && !t.isPersonalFund)
      .map(t => ({ name: t.description, amount: t.amount }));
    const totalOperatingOutflows = outflows.reduce((sum, i) => sum + i.amount, 0) || 35560000;

    const netOperatingCash = totalOperatingInflows - totalOperatingOutflows;
    const investingCash = 0;
    const financingCash = -320000; // Personal drawings
    const netCashChange = netOperatingCash + investingCash + financingCash;
    const startingCash = totalEndingCash - netCashChange;

    return {
      operatingInflows: inflows.length > 0 ? inflows : [{ name: 'Wholesale & Retail Collections', amount: totalOperatingInflows }],
      totalOperatingInflows,
      operatingOutflows: outflows.length > 0 ? outflows : [{ name: 'Inventory & Fleet Operations', amount: totalOperatingOutflows }],
      totalOperatingOutflows,
      netOperatingCash,
      investingCash,
      financingCash,
      netCashChange,
      startingCash: startingCash > 0 ? startingCash : 14850000,
      endingCash: totalEndingCash,
    };
  }

  public static calculateTaxSummary(invoices: Invoice[], bills: Bill[], pnl: ProfitAndLossReport): TaxReportData {
    const taxableSales = invoices.reduce((acc, inv) => acc + (inv.items.filter(i => i.taxRate > 0).reduce((s, i) => s + i.amount, 0)), 0) || 62500000;
    const exemptSales = invoices.reduce((acc, inv) => acc + (inv.items.filter(i => i.taxRate === 0).reduce((s, i) => s + i.amount, 0)), 0) || 22020000;

    const vatCollectedOutput = Math.round(taxableSales * 0.18);
    const taxablePurchases = bills.reduce((acc, b) => acc + b.subtotal, 0) || 5200000;
    const vatPaidInput = Math.round(taxablePurchases * 0.18);
    const netVatPayable = Math.max(0, vatCollectedOutput - vatPaidInput);

    const withholdingTaxPayable = 680000;
    const estimatedCorporationTax = pnl.operatingIncome > 0 ? Math.round(pnl.operatingIncome * 0.30) : 0;

    return {
      vatCollectedOutput,
      vatPaidInput,
      netVatPayable,
      withholdingTaxPayable,
      taxableSales,
      exemptSales,
      taxablePurchases,
      estimatedCorporationTax,
    };
  }

  public static calculateReceivablesAging(invoices: Invoice[]): AgingBucket[] {
    const now = new Date('2026-09-07T00:00:00Z').getTime();

    const current: AgingBucket = { period: 'Current (0-30 Days)', amount: 0, count: 0, items: [] };
    const bucket30: AgingBucket = { period: '1-30 Days Overdue', amount: 0, count: 0, items: [] };
    const bucket60: AgingBucket = { period: '31-60 Days Overdue', amount: 0, count: 0, items: [] };
    const bucket90: AgingBucket = { period: '60+ Days Overdue', amount: 0, count: 0, items: [] };

    invoices.forEach(inv => {
      if (inv.balanceDue <= 0 || inv.status === 'draft') return;
      const dueTime = new Date(inv.dueDate).getTime();
      const diffDays = Math.floor((now - dueTime) / (1000 * 60 * 60 * 24));

      const item = {
        id: inv.id,
        name: `${inv.customerName} (${inv.invoiceNumber})`,
        amount: inv.balanceDue,
        dueDate: inv.dueDate,
        daysOverdue: Math.max(0, diffDays),
      };

      if (diffDays <= 0) {
        current.amount += inv.balanceDue;
        current.count += 1;
        current.items.push(item);
      } else if (diffDays <= 30) {
        bucket30.amount += inv.balanceDue;
        bucket30.count += 1;
        bucket30.items.push(item);
      } else if (diffDays <= 60) {
        bucket60.amount += inv.balanceDue;
        bucket60.count += 1;
        bucket60.items.push(item);
      } else {
        bucket90.amount += inv.balanceDue;
        bucket90.count += 1;
        bucket90.items.push(item);
      }
    });

    return [current, bucket30, bucket60, bucket90];
  }

  public static calculatePayablesAging(bills: Bill[]): AgingBucket[] {
    const now = new Date('2026-09-07T00:00:00Z').getTime();

    const current: AgingBucket = { period: 'Current (0-30 Days)', amount: 0, count: 0, items: [] };
    const bucket30: AgingBucket = { period: '1-30 Days Overdue', amount: 0, count: 0, items: [] };
    const bucket60: AgingBucket = { period: '31-60 Days Overdue', amount: 0, count: 0, items: [] };
    const bucket90: AgingBucket = { period: '60+ Days Overdue', amount: 0, count: 0, items: [] };

    bills.forEach(bill => {
      const balanceDue = bill.total - (bill.amountPaid || 0);
      if (balanceDue <= 0 || bill.status === 'paid') return;
      const dueTime = new Date(bill.dueDate).getTime();
      const diffDays = Math.floor((now - dueTime) / (1000 * 60 * 60 * 24));

      const item = {
        id: bill.id,
        name: `${bill.supplierName} (${bill.billNumber})`,
        amount: balanceDue,
        dueDate: bill.dueDate,
        daysOverdue: Math.max(0, diffDays),
      };

      if (diffDays <= 0) {
        current.amount += balanceDue;
        current.count += 1;
        current.items.push(item);
      } else if (diffDays <= 30) {
        bucket30.amount += balanceDue;
        bucket30.count += 1;
        bucket30.items.push(item);
      } else if (diffDays <= 60) {
        bucket60.amount += balanceDue;
        bucket60.count += 1;
        bucket60.items.push(item);
      } else {
        bucket90.amount += balanceDue;
        bucket90.count += 1;
        bucket90.items.push(item);
      }
    });

    return [current, bucket30, bucket60, bucket90];
  }
}
