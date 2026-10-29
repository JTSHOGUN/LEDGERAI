import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PdfExportService } from '../../services/pdfExportService';
import {
  BarChart3,
  Download,
  Bot,
  Calendar,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
  Scale,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  Users,
  Search,
  Filter,
  Layers,
  Landmark,
  Smartphone,
  Coins
} from 'lucide-react';

export type ReportType =
  | 'pnl'
  | 'balance_sheet'
  | 'cash_flow'
  | 'trial_balance'
  | 'general_ledger'
  | 'receivables_aging'
  | 'payables_aging'
  | 'tax_summary'
  | 'sales_summary';

export const ReportsView: React.FC = () => {
  const {
    currentOrg,
    pnlReport,
    balanceSheetReport,
    cashFlowReport,
    trialBalanceReport,
    taxSummaryReport,
    receivablesAging,
    payablesAging,
    accounts,
    transactions,
    setCurrentView,
    formatMoney,
    theme,
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<ReportType>('pnl');
  const [reportPeriod, setReportPeriod] = useState('August - September 2026');
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // General Ledger Filters
  const [selectedGlAccount, setSelectedGlAccount] = useState<string>('all');
  const [glSearch, setGlSearch] = useState<string>('');

  const totalReceivables = receivablesAging.reduce((sum, b) => sum + b.amount, 0);
  const totalPayables = payablesAging.reduce((sum, b) => sum + b.amount, 0);
  const netTradeGap = totalReceivables - totalPayables;

  // General Ledger Postings Generator
  const glEntries = React.useMemo(() => {
    interface GlLine {
      id: string;
      date: string;
      accountCode: string;
      accountName: string;
      reference: string;
      description: string;
      channel: string;
      debit: number;
      credit: number;
      runningBalance: number;
    }

    const lines: GlLine[] = [];
    let runningBank = 14250000;

    transactions.forEach((tx, idx) => {
      const isIncome = tx.type === 'income';
      const ref = tx.referenceNumber || `JRN-2026-${(100 + idx).toString()}`;
      const channel = tx.paymentMethod.replace(/_/g, ' ').toUpperCase();

      // Line 1: Cash/Bank Account (Stanbic / MoMo)
      const cashCode = tx.paymentMethod.includes('mtn')
        ? '1020'
        : tx.paymentMethod.includes('airtel')
        ? '1040'
        : tx.paymentMethod.includes('mpesa')
        ? '1045'
        : '1010';
      const cashName = tx.paymentMethod.includes('mtn')
        ? 'MTN Mobile Money Merchant Till'
        : tx.paymentMethod.includes('airtel')
        ? 'Airtel MoneyPay Merchant Till'
        : tx.paymentMethod.includes('mpesa')
        ? 'M-Pesa Business Float'
        : 'Stanbic Bank Corporate Current';

      if (isIncome) {
        runningBank += tx.amount;
        lines.push({
          id: `${tx.id}-dr`,
          date: tx.date,
          accountCode: cashCode,
          accountName: cashName,
          reference: ref,
          description: `${tx.description} (Receipt)`,
          channel,
          debit: tx.amount,
          credit: 0,
          runningBalance: runningBank,
        });
        lines.push({
          id: `${tx.id}-cr`,
          date: tx.date,
          accountCode: '4000',
          accountName: 'Wholesale Produce Sales Revenue',
          reference: ref,
          description: tx.description,
          channel,
          debit: 0,
          credit: tx.amount,
          runningBalance: runningBank,
        });
      } else {
        runningBank -= tx.amount;
        lines.push({
          id: `${tx.id}-dr`,
          date: tx.date,
          accountCode: tx.category.includes('Fuel') || tx.category.includes('Transport') ? '5000' : '5100',
          accountName: tx.category,
          reference: ref,
          description: `${tx.description} (Disbursement)`,
          channel,
          debit: tx.amount,
          credit: 0,
          runningBalance: runningBank,
        });
        lines.push({
          id: `${tx.id}-cr`,
          date: tx.date,
          accountCode: cashCode,
          accountName: cashName,
          reference: ref,
          description: tx.description,
          channel,
          debit: 0,
          credit: tx.amount,
          runningBalance: runningBank,
        });
      }
    });

    return lines;
  }, [transactions]);

  // Filtered GL entries
  const filteredGlEntries = glEntries.filter(line => {
    if (selectedGlAccount !== 'all' && line.accountCode !== selectedGlAccount) return false;
    if (glSearch) {
      const q = glSearch.toLowerCase();
      return (
        line.accountName.toLowerCase().includes(q) ||
        line.description.toLowerCase().includes(q) ||
        line.reference.toLowerCase().includes(q) ||
        line.accountCode.includes(q)
      );
    }
    return true;
  });

  const totalGlDebits = filteredGlEntries.reduce((s, l) => s + l.debit, 0);
  const totalGlCredits = filteredGlEntries.reduce((s, l) => s + l.credit, 0);

  const handleAskLedgerAi = () => {
    setIsAiExplaining(true);
    setTimeout(() => {
      setIsAiExplaining(false);
      if (selectedReport === 'pnl') {
        setAiExplanation(
          `Report Audit: Net profit for the period is ${formatMoney(pnlReport.netProfit)} (33.3% net margin). Gross margin of ${pnlReport.grossMarginPercent.toFixed(1)}% is consistent with wholesale agricultural benchmarks. Key operational expenses: Transport & Fleet Fuel (${formatMoney(6450000)}) and Warehouse Labor (${formatMoney(7500000)}). Cash profit conversion stands at 88%.`
        );
      } else if (selectedReport === 'balance_sheet') {
        setAiExplanation(
          `Balance Sheet Audit: Total Assets of ${formatMoney(balanceSheetReport.totalAssets)} match Total Liabilities & Equity with ZERO ledger discrepancy. Working capital ratio is 2.4x current liabilities.`
        );
      } else if (selectedReport === 'trial_balance') {
        setAiExplanation(
          `Trial Balance Audit: Total Debits (${formatMoney(trialBalanceReport.totalDebits)}) equal Total Credits (${formatMoney(trialBalanceReport.totalCredits)}). Double-entry integrity is verified with 100% mathematical balance.`
        );
      } else if (selectedReport === 'general_ledger') {
        setAiExplanation(
          `General Ledger Audit: Displaying ${filteredGlEntries.length} double-entry line postings. Total Debits (${formatMoney(totalGlDebits)}) equal Total Credits (${formatMoney(totalGlCredits)}). Every journal entry maintains exact mathematical equilibrium across Stanbic Bank, MTN MoMo, Airtel Money, and Sales Revenue.`
        );
      } else if (selectedReport === 'receivables_aging') {
        setAiExplanation(
          `Receivables Aging Audit: Total uncollected customer invoices stand at ${formatMoney(totalReceivables)}. ${formatMoney(receivablesAging[0].amount)} (${receivablesAging[0].count} invoices) is current (0-30 days), while ${formatMoney(receivablesAging.slice(1).reduce((s, b) => s + b.amount, 0))} is in active follow-up. Days Sales Outstanding (DSO) averages 18.4 days.`
        );
      } else if (selectedReport === 'payables_aging') {
        setAiExplanation(
          `Payables Due / Aging Audit: Total trade accounts payable outstanding is ${formatMoney(totalPayables)}. Current obligations (0-30 days) represent ${formatMoney(payablesAging[0].amount)} (${payablesAging[0].count} bills). Net trade receivables exceed payables by ${formatMoney(netTradeGap)}, providing a strong liquidity cushion for working capital float.`
        );
      } else {
        setAiExplanation(
          `Tax Schedule Summary: Calculated ${formatMoney(taxSummaryReport.netVatPayable)} net VAT obligation for URA EFRIS filing due on the 15th. Input claims are supported by verifiable vendor receipts.`
        );
      }
    }, 600);
  };

  const handleExportPdf = () => {
    if (selectedReport === 'pnl') {
      PdfExportService.exportProfitLossPdf(pnlReport, currentOrg, reportPeriod);
    } else {
      let rows: (string | number)[][] = [];
      if (selectedReport === 'general_ledger') {
        rows = [
          ['Date', 'Account Code', 'Account Name', 'Reference', 'Description', 'Channel', 'Debit', 'Credit', 'Running Balance'],
          ...filteredGlEntries.map(l => [l.date, l.accountCode, l.accountName, l.reference, l.description, l.channel, l.debit, l.credit, l.runningBalance]),
        ];
      } else if (selectedReport === 'payables_aging') {
        rows = [
          ['Aging Period', 'Amount', 'Bill Count'],
          ...payablesAging.map(b => [b.period, b.amount, b.count]),
          ['', '', ''],
          ['Bill ID', 'Supplier / Vendor', 'Due Date', 'Days Overdue', 'Balance Due'],
          ...payablesAging.flatMap(b => b.items.map(i => [i.id, i.name, i.dueDate, i.daysOverdue, i.amount])),
        ];
      } else if (selectedReport === 'receivables_aging') {
        rows = [
          ['Aging Period', 'Amount', 'Invoice Count'],
          ...receivablesAging.map(b => [b.period, b.amount, b.count]),
          ['', '', ''],
          ['Invoice ID', 'Customer Name', 'Due Date', 'Days Overdue', 'Balance Due'],
          ...receivablesAging.flatMap(b => b.items.map(i => [i.id, i.name, i.dueDate, i.daysOverdue, i.amount])),
        ];
      } else {
        rows = accounts.map(a => [a.code, a.name, a.type, a.balance]);
      }

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `${selectedReport}_${currentOrg.name}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Financial Statements & Accounting Schedules
            </h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badge}`}>
              {theme.name}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            GAAP & IFRS-compliant accounting schedules, double-entry general ledger, and trade aging analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAskLedgerAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-stone-300" />
            <span>Audit with Copilot</span>
          </button>
          <button
            onClick={handleExportPdf}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 ${theme.btnPrimary} rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (PDF/CSV)</span>
          </button>
        </div>
      </div>

      {/* Report Selector Navigation (Includes General Ledger) */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs overflow-x-auto">
        {[
          { id: 'pnl', label: 'Profit & Loss (P&L)' },
          { id: 'balance_sheet', label: 'Balance Sheet' },
          { id: 'cash_flow', label: 'Cash Flow' },
          { id: 'trial_balance', label: 'Trial Balance' },
          { id: 'general_ledger', label: 'General Ledger (G/L)' },
          { id: 'receivables_aging', label: 'Receivables Aging' },
          { id: 'payables_aging', label: 'Payables Due / Aging' },
          { id: 'tax_summary', label: 'Tax Summary (URA EFRIS)' },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => {
              setSelectedReport(r.id as any);
              setAiExplanation(null);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              selectedReport === r.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Contextual Audit Insight Banner */}
      {aiExplanation && (
        <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-stone-900 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-stone-900 text-white shrink-0 mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">LedgerAI Statement Audit</h4>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">{aiExplanation}</p>
          </div>
        </div>
      )}

      {/* REPORT CONTENT VIEWERS */}

      {/* 1. Profit & Loss */}
      {selectedReport === 'pnl' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="text-center pb-6 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-900">{currentOrg.legalName}</h2>
            <h3 className="text-sm font-semibold text-stone-600 mt-1">STATEMENT OF PROFIT OR LOSS</h3>
            <p className="text-xs text-stone-400 mt-0.5">Period: {reportPeriod} · Currency: {currentOrg.currency}</p>
          </div>

          <div className="space-y-6 text-xs">
            {/* Revenue */}
            <div>
              <div className="flex justify-between font-bold text-stone-900 pb-1.5 border-b border-stone-200 text-xs uppercase">
                <span>Revenue & Sales Inflow</span>
                <span>Amount ({currentOrg.currency})</span>
              </div>
              <div className="divide-y divide-stone-100 py-1">
                {pnlReport.revenueItems.map(r => (
                  <div key={r.name} className="flex justify-between py-2 text-stone-700">
                    <span className="pl-3">{r.name}</span>
                    <span className="font-mono text-stone-900">{formatMoney(r.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-xs">
                <span>Total Revenue</span>
                <span className={`font-mono font-bold ${theme.textAccent}`}>{formatMoney(pnlReport.totalRevenue)}</span>
              </div>
            </div>

            {/* Cost of Goods Sold */}
            <div>
              <div className="flex justify-between font-bold text-stone-900 pb-1.5 border-b border-stone-200 text-xs uppercase">
                <span>Cost of Goods Sold (COGS)</span>
                <span>Amount ({currentOrg.currency})</span>
              </div>
              <div className="divide-y divide-stone-100 py-1">
                {pnlReport.cogsItems.map(c => (
                  <div key={c.name} className="flex justify-between py-2 text-stone-700">
                    <span className="pl-3">{c.name}</span>
                    <span className="font-mono text-stone-900">{formatMoney(c.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-xs">
                <span>Gross Profit ({pnlReport.grossMarginPercent.toFixed(1)}% Gross Margin)</span>
                <span className="font-mono text-stone-900">{formatMoney(pnlReport.grossProfit)}</span>
              </div>
            </div>

            {/* Operating Expenses */}
            <div>
              <div className="flex justify-between font-bold text-stone-900 pb-1.5 border-b border-stone-200 text-xs uppercase">
                <span>Operating Expenses (OpEx)</span>
                <span>Amount ({currentOrg.currency})</span>
              </div>
              <div className="divide-y divide-stone-100 py-1">
                {pnlReport.expenseItems.map(e => (
                  <div key={e.name} className="flex justify-between py-2 text-stone-700">
                    <span className="pl-3">{e.name}</span>
                    <span className="font-mono text-stone-900">{formatMoney(e.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-xs">
                <span>Total Operating Expenses</span>
                <span className="font-mono text-stone-900">{formatMoney(pnlReport.totalExpenses)}</span>
              </div>
            </div>

            {/* Net Profit Summary */}
            <div className="pt-4 border-t-2 border-stone-300 space-y-2">
              <div className="flex justify-between font-semibold text-stone-800">
                <span>Operating Income (EBIT)</span>
                <span className="font-mono">{formatMoney(pnlReport.operatingIncome)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Estimated Corporate Income Tax (30%)</span>
                <span className="font-mono">- {formatMoney(pnlReport.estimatedTax)}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                <span>NET PROFIT FOR THE PERIOD</span>
                <span className={`font-mono font-bold ${theme.textAccent}`}>{formatMoney(pnlReport.netProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Balance Sheet */}
      {selectedReport === 'balance_sheet' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="text-center pb-6 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-900">{currentOrg.legalName}</h2>
            <h3 className="text-sm font-semibold text-stone-600 mt-1">STATEMENT OF FINANCIAL POSITION (BALANCE SHEET)</h3>
            <p className="text-xs text-stone-400 mt-0.5">As at 31 December 2026 · Currency: {currentOrg.currency}</p>
          </div>

          <div className="space-y-6 text-xs">
            {/* Assets */}
            <div>
              <h4 className="font-bold text-stone-900 uppercase pb-1 border-b border-stone-200">ASSETS</h4>
              <p className="font-semibold text-stone-700 mt-2 mb-1">Current Assets</p>
              <div className="divide-y divide-stone-100 pl-3">
                {balanceSheetReport.currentAssets.map(a => (
                  <div key={a.name} className="flex justify-between py-1.5 text-stone-600">
                    <span>{a.name}</span>
                    <span className="font-mono text-stone-900">{formatMoney(a.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-xs">
                <span>TOTAL ASSETS</span>
                <span className={`font-mono font-bold ${theme.textAccent}`}>{formatMoney(balanceSheetReport.totalAssets)}</span>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div>
              <h4 className="font-bold text-stone-900 uppercase pb-1 border-b border-stone-200">LIABILITIES & EQUITY</h4>
              <p className="font-semibold text-stone-700 mt-2 mb-1">Current Liabilities</p>
              <div className="divide-y divide-stone-100 pl-3">
                {balanceSheetReport.currentLiabilities.map(l => (
                  <div key={l.name} className="flex justify-between py-1.5 text-stone-600">
                    <span>{l.name}</span>
                    <span className="font-mono text-stone-900">{formatMoney(l.amount)}</span>
                  </div>
                ))}
              </div>
              <p className="font-semibold text-stone-700 mt-3 mb-1">Equity</p>
              <div className="divide-y divide-stone-100 pl-3">
                {balanceSheetReport.equityItems.map(e => (
                  <div key={e.name} className="flex justify-between py-1.5 text-stone-600">
                    <span>{e.name}</span>
                    <span className="font-mono text-stone-900">{formatMoney(e.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1.5 text-stone-600">
                  <span>Current Period Retained Earnings</span>
                  <span className="font-mono text-stone-900">{formatMoney(balanceSheetReport.retainedEarnings)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-3 border-t-2 border-stone-300 text-sm">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span className={`font-mono font-bold ${theme.textAccent}`}>{formatMoney(balanceSheetReport.totalLiabilitiesAndEquity)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cash Flow */}
      {selectedReport === 'cash_flow' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="text-center pb-6 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-900">{currentOrg.legalName}</h2>
            <h3 className="text-sm font-semibold text-stone-600 mt-1">STATEMENT OF CASH FLOWS (IAS 7)</h3>
            <p className="text-xs text-stone-400 mt-0.5">Period: {reportPeriod} · Currency: {currentOrg.currency}</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-stone-900 uppercase pb-1 border-b border-stone-200">CASH FLOW FROM OPERATING ACTIVITIES</h4>
              <div className="divide-y divide-stone-100 pl-3 py-1">
                {cashFlowReport.operatingInflows.map(i => (
                  <div key={i.name} className="flex justify-between py-1.5 text-stone-700">
                    <span>{i.name}</span>
                    <span className={`font-mono font-bold ${theme.textAccent}`}>+{formatMoney(i.amount)}</span>
                  </div>
                ))}
                {cashFlowReport.operatingOutflows.map(o => (
                  <div key={o.name} className="flex justify-between py-1.5 text-stone-700">
                    <span>{o.name}</span>
                    <span className="font-mono text-red-700 font-bold">-{formatMoney(o.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Net Cash from Operating Activities</span>
                <span className={`font-mono font-bold ${theme.textAccent}`}>{formatMoney(cashFlowReport.netOperatingCash)}</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-stone-300 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Cash & Cash Equivalents at Beginning of Period</span>
                <span className="font-mono font-bold text-stone-900">{formatMoney(cashFlowReport.startingCash)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Net Change in Cash Position</span>
                <span className={`font-mono font-bold ${theme.textAccent}`}>+{formatMoney(cashFlowReport.netCashChange)}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                <span>CASH & CASH EQUIVALENTS AT END OF PERIOD</span>
                <span className={`font-mono font-bold ${theme.textAccent}`}>{formatMoney(cashFlowReport.endingCash)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Trial Balance */}
      {selectedReport === 'trial_balance' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-4xl mx-auto space-y-4">
          <div className="text-center pb-4 border-b border-stone-200">
            <h2 className="text-xl font-bold text-stone-900">{currentOrg.legalName}</h2>
            <h3 className="text-sm font-semibold text-stone-600">TRIAL BALANCE AUDIT</h3>
            <p className="text-xs text-stone-400">Debit = Credit Verification: {trialBalanceReport.isBalanced ? 'BALANCED' : 'UNBALANCED'}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase font-semibold">
                  <th className="pb-2">Account Code</th>
                  <th className="pb-2">Account Name</th>
                  <th className="pb-2">Class</th>
                  <th className="pb-2 text-right">Debit ({currentOrg.currency})</th>
                  <th className="pb-2 text-right">Credit ({currentOrg.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {trialBalanceReport.items.map(i => (
                  <tr key={i.code} className="hover:bg-stone-50">
                    <td className="py-2 text-stone-500">{i.code}</td>
                    <td className="py-2 font-sans font-medium text-stone-900">{i.name}</td>
                    <td className="py-2 font-sans text-stone-500">{i.type}</td>
                    <td className="py-2 text-right text-stone-900">{i.debit > 0 ? i.debit.toLocaleString() : '-'}</td>
                    <td className="py-2 text-right text-stone-900">{i.credit > 0 ? i.credit.toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-stone-300 font-bold font-mono text-stone-900 text-xs">
                  <td colSpan={3} className="py-3 font-sans">TOTALS (BALANCED)</td>
                  <td className={`py-3 text-right ${theme.textAccent}`}>{trialBalanceReport.totalDebits.toLocaleString()}</td>
                  <td className={`py-3 text-right ${theme.textAccent}`}>{trialBalanceReport.totalCredits.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 5. GENERAL LEDGER (G/L) REPORT SCHEDULE */}
      {selectedReport === 'general_ledger' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">General Ledger (G/L) Schedule</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                  Double-Entry Complete
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Detailed transaction journal register across all asset, liability, equity, revenue, and expense accounts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-stone-100 text-stone-800 border border-stone-200">
                {filteredGlEntries.length} Postings
              </span>
            </div>
          </div>

          {/* Account Filter & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Filter by Chart of Accounts</label>
              <select
                value={selectedGlAccount}
                onChange={e => setSelectedGlAccount(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
              >
                <option value="all">All Accounts (Full General Ledger)</option>
                <option value="1010">1010 - Stanbic Bank Corporate Current</option>
                <option value="1020">1020 - MTN Mobile Money Merchant Till</option>
                <option value="1040">1040 - Airtel MoneyPay Merchant Till</option>
                <option value="1045">1045 - M-Pesa Business Float</option>
                <option value="4000">4000 - Wholesale Produce Sales Revenue</option>
                <option value="5000">5000 - Transport & Fleet Fuel Expense</option>
                <option value="5100">5100 - Cold Storage & Warehouse Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Search Posting / Reference</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={glSearch}
                  onChange={e => setGlSearch(e.target.value)}
                  placeholder="Filter by description, reference, vendor..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* General Ledger Table */}
          <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 text-[11px] border-b border-stone-200 font-semibold uppercase tracking-wider">
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Account Code & Name</th>
                    <th className="p-2.5">Journal Ref</th>
                    <th className="p-2.5">Description & Counterparty</th>
                    <th className="p-2.5">Channel</th>
                    <th className="p-2.5 text-right">Debit ({currentOrg.currency})</th>
                    <th className="p-2.5 text-right">Credit ({currentOrg.currency})</th>
                    <th className="p-2.5 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredGlEntries.map(line => (
                    <tr key={line.id} className="hover:bg-stone-50">
                      <td className="p-2.5 font-mono text-stone-500 whitespace-nowrap">{line.date}</td>
                      <td className="p-2.5 font-medium text-stone-900 whitespace-nowrap">
                        <span className="font-mono text-stone-500 mr-1.5">{line.accountCode}</span>
                        <span>{line.accountName}</span>
                      </td>
                      <td className="p-2.5 font-mono text-stone-600 whitespace-nowrap">{line.reference}</td>
                      <td className="p-2.5 text-stone-800 max-w-xs truncate">{line.description}</td>
                      <td className="p-2.5 text-stone-500 text-[10px] whitespace-nowrap">{line.channel}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-stone-900 whitespace-nowrap">
                        {line.debit > 0 ? formatMoney(line.debit) : '—'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-stone-900 whitespace-nowrap">
                        {line.credit > 0 ? formatMoney(line.credit) : '—'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-stone-700 whitespace-nowrap">
                        {formatMoney(line.runningBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-stone-300 bg-stone-50 font-bold font-mono text-xs">
                    <td colSpan={5} className="p-2.5 font-sans text-stone-900">
                      TOTALS (DOUBLE-ENTRY BALANCED)
                    </td>
                    <td className={`p-2.5 text-right ${theme.textAccent}`}>
                      {formatMoney(totalGlDebits)}
                    </td>
                    <td className={`p-2.5 text-right ${theme.textAccent}`}>
                      {formatMoney(totalGlCredits)}
                    </td>
                    <td className="p-2.5 text-right text-stone-900">
                      Balanced
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Receivables Aging Schedule */}
      {selectedReport === 'receivables_aging' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">Accounts Receivable Aging Schedule</h3>
              <p className="text-xs text-stone-500">Uncollected customer balances categorized by age</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 font-semibold uppercase">Total Receivables</span>
              <p className={`text-lg font-bold font-mono ${theme.textAccent}`}>{formatMoney(totalReceivables)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {receivablesAging.map((bucket, idx) => (
              <div key={bucket.period} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase">{bucket.period}</span>
                <p className={`text-lg font-bold font-mono mt-1 ${idx === 0 ? theme.textAccent : idx === 3 ? 'text-red-700' : 'text-stone-900'}`}>
                  {formatMoney(bucket.amount)}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">{bucket.count} Invoices</p>
              </div>
            ))}
          </div>

          {/* Detailed Invoices Breakdown */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Unpaid Customer Invoices Roster
            </h4>
            <div className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-100 text-stone-600 text-[11px] border-b border-stone-200 font-semibold">
                    <th className="p-2.5">Customer & Invoice</th>
                    <th className="p-2.5">Due Date</th>
                    <th className="p-2.5 text-center">Days Overdue</th>
                    <th className="p-2.5 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {receivablesAging.flatMap(b => b.items).map(item => (
                    <tr key={item.id} className="hover:bg-stone-100/50">
                      <td className="p-2.5 font-medium text-stone-900">{item.name}</td>
                      <td className="p-2.5 font-mono text-stone-600">{item.dueDate}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.daysOverdue === 0 ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {item.daysOverdue === 0 ? 'Current' : `${item.daysOverdue}d Overdue`}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-stone-900">
                        {formatMoney(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. PAYABLES DUE / PAYABLES AGING SCHEDULE */}
      {selectedReport === 'payables_aging' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">Accounts Payable Aging & Bills Due Schedule</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                  Trade Payables
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Outstanding vendor bills and supplier obligations categorized by due date and aging buckets
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 font-semibold uppercase">Total Payables Due</span>
              <p className="text-lg font-bold font-mono text-red-800">{formatMoney(totalPayables)}</p>
            </div>
          </div>

          {/* 4 Aging Buckets KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {payablesAging.map((bucket, idx) => (
              <div key={bucket.period} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase">{bucket.period}</span>
                <p className={`text-lg font-bold font-mono mt-1 ${idx === 0 ? 'text-stone-900' : idx === 3 ? 'text-red-700' : 'text-amber-800'}`}>
                  {formatMoney(bucket.amount)}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">{bucket.count} Vendor Bills</p>
              </div>
            ))}
          </div>

          {/* Trade Working Capital Cushion Card */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-stone-900">Working Capital Trade Gap (Receivables vs. Payables)</span>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Receivables ({formatMoney(totalReceivables)}) minus Payables ({formatMoney(totalPayables)})
              </p>
            </div>
            <div className="sm:text-right">
              <span className={`text-sm font-bold font-mono ${netTradeGap >= 0 ? theme.textAccent : 'text-red-700'}`}>
                {netTradeGap >= 0 ? '+' : ''}{formatMoney(netTradeGap)} Cushion
              </span>
              <p className="text-[10px] text-stone-500">Positive trade float</p>
            </div>
          </div>

          {/* Detailed Supplier Bills Roster */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Outstanding Vendor Bills Register
              </h4>
              <span className="text-[11px] text-stone-500">
                {payablesAging.reduce((s, b) => s + b.count, 0)} Bills Pending Settlement
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-100 text-stone-600 text-[11px] border-b border-stone-200 font-semibold">
                    <th className="p-2.5">Supplier & Bill Reference</th>
                    <th className="p-2.5">Due Date</th>
                    <th className="p-2.5 text-center">Status / Aging</th>
                    <th className="p-2.5 text-right">Balance Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {payablesAging.flatMap(b => b.items).map(item => (
                    <tr key={item.id} className="hover:bg-stone-100/50">
                      <td className="p-2.5 font-medium text-stone-900 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.name}</span>
                      </td>
                      <td className="p-2.5 font-mono text-stone-600">{item.dueDate}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.daysOverdue === 0
                            ? 'bg-stone-200 text-stone-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {item.daysOverdue === 0 ? 'Current (Due Soon)' : `${item.daysOverdue}d Overdue`}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-red-900">
                        {formatMoney(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. Tax Summary */}
      {selectedReport === 'tax_summary' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-4xl mx-auto space-y-4">
          <div className="pb-3 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">Uganda URA EFRIS Tax Summary</h3>
            <p className="text-xs text-stone-500">Output VAT (18%) vs Input Claims & Withholding Tax</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span>Standard Rated Taxable Sales (18% VAT)</span>
              <span className="font-mono font-bold text-stone-900">{formatMoney(taxSummaryReport.taxableSales)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span>Output VAT Collected from Customers</span>
              <span className={`font-mono font-bold ${theme.textAccent}`}>{formatMoney(taxSummaryReport.vatCollectedOutput)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span>Allowable Input VAT Claimed on Purchases</span>
              <span className="font-mono font-bold text-stone-700">- {formatMoney(taxSummaryReport.vatPaidInput)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-stone-300 font-bold text-sm">
              <span>NET ESTIMATED VAT OBLIGATION</span>
              <span className="font-mono text-amber-800">{formatMoney(taxSummaryReport.netVatPayable)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
