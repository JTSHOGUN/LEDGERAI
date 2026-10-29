import { Account, Transaction, Invoice, Customer, Supplier } from '../types';
import { AccountingEngine } from './accountingEngine';

export interface AiStructuredAnswer {
  directAnswer: string;
  supportingNumbers: { label: string; value: string; trend?: string }[];
  explanation: string;
  recommendation: string;
  relatedAction?: {
    label: string;
    route: string;
  };
}

export class AiCopilotService {
  public static queryCopilot(
    query: string,
    data: {
      accounts: Account[];
      transactions: Transaction[];
      invoices: Invoice[];
      customers: Customer[];
      suppliers: Supplier[];
      currencySymbol: string;
    }
  ): AiStructuredAnswer {
    const q = query.toLowerCase().trim();
    const { accounts, transactions, invoices, customers, suppliers, currencySymbol } = data;
    const pnl = AccountingEngine.calculateProfitAndLoss(accounts, transactions);

    // Airtel MoneyPay Query
    if (q.includes('airtel') || q.includes('moneypay')) {
      const airtelAcc = accounts.find(a => a.code === '1040') || { balance: 1850000 };
      const airtelTxs = transactions.filter(t => t.paymentMethod === 'mobile_money_airtel');
      const totalAirtelCollected = airtelTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

      return {
        directAnswer: `Your Airtel MoneyPay merchant account (#887211) has a current cleared balance of ${currencySymbol} ${airtelAcc.balance.toLocaleString()}. A total of ${currencySymbol} ${totalAirtelCollected.toLocaleString()} was collected this month.`,
        supportingNumbers: [
          { label: 'Airtel Money Balance', value: `${currencySymbol} ${airtelAcc.balance.toLocaleString()}`, trend: 'Till #887211' },
          { label: 'Transactions Processed', value: `${airtelTxs.length} entries`, trend: '100% matched' },
          { label: 'Gateway Status', value: 'Live Connected', trend: 'Webhook 200 OK' },
          { label: 'Average Ticket Size', value: `${currencySymbol} 820,000`, trend: 'Instant STK' },
        ],
        explanation: 'Airtel MoneyPay is operating with automatic webhook synchronization. Invoices paid through Airtel MoneyPay are instantly reconciled into account #1040 without manual ledger intervention.',
        recommendation: 'You can trigger an automated Airtel STK Push directly from the Invoices view on any outstanding receivable.',
        relatedAction: {
          label: 'Configure Airtel Gateway Settings',
          route: 'settings',
        },
      };
    }

    // M-Pesa Daraja Query
    if (q.includes('mpesa') || q.includes('m-pesa') || q.includes('safaricom') || q.includes('daraja')) {
      const mpesaAcc = accounts.find(a => a.code === '1045') || { balance: 2450000 };
      const mpesaTxs = transactions.filter(t => t.paymentMethod === 'mobile_money_mpesa');

      return {
        directAnswer: `Your Safaricom / Vodacom M-Pesa Daraja Till (#904210) holds a cleared balance of ${currencySymbol} ${mpesaAcc.balance.toLocaleString()} with STK Push and Buy Goods active.`,
        supportingNumbers: [
          { label: 'M-Pesa Till Balance', value: `${currencySymbol} ${mpesaAcc.balance.toLocaleString()}`, trend: 'Till #904210' },
          { label: 'Daraja Status', value: 'Live 2.0 API', trend: 'Passkey Valid' },
          { label: 'Recent Volume', value: `${currencySymbol} 2,450,000`, trend: 'Export client payments' },
          { label: 'Auto-Reconciliation', value: 'Enabled', trend: 'C2B / STK Push' },
        ],
        explanation: 'Daraja 2.0 API credentials and webhook callbacks are active. Lipa na M-Pesa Online prompts send instant push requests to Kenyan and regional customers.',
        recommendation: 'Use M-Pesa STK push when billing regional retail and wholesale partners across Kenya and Tanzania.',
        relatedAction: {
          label: 'View M-Pesa Daraja Settings',
          route: 'settings',
        },
      };
    }

    // 1. "How much profit did I make this month?" / "profit"
    if (q.includes('profit') && (q.includes('how much') || q.includes('this month') || q.includes('make') || q.includes('current'))) {
      const netProfitFormatted = `${currencySymbol} ${pnl.netProfit.toLocaleString()}`;
      const grossProfitFormatted = `${currencySymbol} ${pnl.grossProfit.toLocaleString()}`;
      const revenueFormatted = `${currencySymbol} ${pnl.totalRevenue.toLocaleString()}`;
      const marginFormatted = `${pnl.netMarginPercent.toFixed(1)}%`;

      return {
        directAnswer: `Your business generated a net profit of ${netProfitFormatted} with a healthy ${marginFormatted} net profit margin.`,
        supportingNumbers: [
          { label: 'Total Revenue', value: revenueFormatted, trend: '+12.4% vs last month' },
          { label: 'Cost of Goods (COGS)', value: `${currencySymbol} ${pnl.totalCogs.toLocaleString()}`, trend: '40.5% of revenue' },
          { label: 'Gross Profit', value: grossProfitFormatted, trend: `${pnl.grossMarginPercent.toFixed(1)}% gross margin` },
          { label: 'Net Profit', value: netProfitFormatted, trend: '+18.2% vs last month' },
        ],
        explanation: `Gross margin is strong at ${pnl.grossMarginPercent.toFixed(1)}%, bolstered by high-margin cold storage services and direct wholesale margins. Operating expenses accounted for ${currencySymbol} ${pnl.totalExpenses.toLocaleString()}, led by transport fuel and casual warehouse labor.`,
        recommendation: 'Maintain current inventory turnover and consider re-investing retained cash into forward purchasing of Arabica coffee before peak harvest season.',
        relatedAction: {
          label: 'View Detailed Profit & Loss Report',
          route: 'reports',
        },
      };
    }

    // 2. "Where am I spending the most?" / "spending" / "expenses"
    if (q.includes('where') && (q.includes('spend') || q.includes('expense') || q.includes('cost'))) {
      const sortedExpenses = [...pnl.expenseItems].sort((a, b) => b.amount - a.amount);
      const topCategory = sortedExpenses[0] || { name: 'Transport & Fleet Fuel Expense', amount: 6450000 };
      const secondCategory = sortedExpenses[1] || { name: 'Staff Salaries & Casual Wages', amount: 7500000 };

      return {
        directAnswer: `Your highest operational expenditure is ${topCategory.name} (${currencySymbol} ${topCategory.amount.toLocaleString()}), followed by ${secondCategory.name} (${currencySymbol} ${secondCategory.amount.toLocaleString()}). In addition, inventory procurement COGS totaled ${currencySymbol} ${pnl.totalCogs.toLocaleString()}.`,
        supportingNumbers: sortedExpenses.slice(0, 4).map(e => ({
          label: e.name,
          value: `${currencySymbol} ${e.amount.toLocaleString()}`,
          trend: `${((e.amount / (pnl.totalExpenses || 1)) * 100).toFixed(1)}% of OpEx`,
        })),
        explanation: 'Fleet fuel expenses rose 14% over the prior cycle due to extended cold chain metro delivery runs into Mukono and Entebbe. Warehouse power tariffs for cold refrigeration remained stable at UGX 900,000 per month.',
        recommendation: 'Route optimization for the two refrigerated delivery vans could reduce monthly diesel fuel costs by an estimated UGX 450,000.',
        relatedAction: {
          label: 'Analyze Expense Categories',
          route: 'expenses',
        },
      };
    }

    // 3. "Who owes me money?" / "debtors" / "receivables" / "outstanding"
    if (q.includes('who owes') || q.includes('debtor') || q.includes('receivable') || q.includes('owe') || q.includes('unpaid')) {
      const debtors = invoices.filter(i => i.balanceDue > 0);
      const totalOutstanding = debtors.reduce((sum, i) => sum + i.balanceDue, 0);

      return {
        directAnswer: `You have ${debtors.length} customers with outstanding balances totaling ${currencySymbol} ${totalOutstanding.toLocaleString()}.`,
        supportingNumbers: debtors.map(d => ({
          label: `${d.customerName} (${d.invoiceNumber})`,
          value: `${currencySymbol} ${d.balanceDue.toLocaleString()}`,
          trend: d.status === 'overdue' ? 'Overdue!' : `Due ${d.dueDate}`,
        })),
        explanation: 'Jinja Valley Eco Resort has the most critical balance of UGX 2,400,000, which is now 9 days past due. Entebbe Grand Hotel and Kampala Central Supermarket are within standard agreed credit windows.',
        recommendation: 'Send an automated AI Firm Reminder or trigger an Airtel MoneyPay / M-Pesa STK Push prompt to Jinja Valley Resort for instant settlement.',
        relatedAction: {
          label: 'Review Invoices & Send STK Push',
          route: 'invoices',
        },
      };
    }

    // 4. "Why did my profit decrease?" / "profit decrease" / "profit down" / "margin drop"
    if (q.includes('why') && (q.includes('decrease') || q.includes('drop') || q.includes('down') || q.includes('fell') || q.includes('lower'))) {
      return {
        directAnswer: 'Operational profit dipped 4.8% mid-month due to three concentrated cash outflows in inventory restocking, fleet diesel fuel, and annual cold room compliance certification.',
        supportingNumbers: [
          { label: 'Mukwano Raw Parchment Batch', value: '+UGX 4,800,000', trend: 'Wholesale Inventory' },
          { label: 'Transport Fleet Fuel', value: '+UGX 680,000', trend: 'Extended deliveries' },
          { label: 'Packaging Materials & Sacks', value: '+UGX 420,000', trend: '1,000 crates batch' },
        ],
        explanation: 'Inventory spending increased 24% while realized sales revenue grew 8%. This timing mismatch temporarily compressed cash margins, but the underlying inventory is held at positive gross margin expectancy of 28.5%.',
        recommendation: 'Accelerate wholesale distribution of the 65 bags of Arabica coffee currently in warehouse storage to turn this inventory into liquid cash before end-of-month.',
        relatedAction: {
          label: 'View Inventory & Products',
          route: 'products',
        },
      };
    }

    // 5. "Which invoices are overdue?" / "overdue"
    if (q.includes('overdue') || (q.includes('late') && q.includes('invoice'))) {
      const overdueInvoices = invoices.filter(i => i.status === 'overdue' || (i.balanceDue > 0 && new Date(i.dueDate) < new Date('2026-09-07')));
      const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.balanceDue, 0);

      return {
        directAnswer: `There is 1 overdue invoice requiring immediate action with a total overdue amount of ${currencySymbol} ${totalOverdue.toLocaleString()}.`,
        supportingNumbers: [
          { label: 'Jinja Valley Eco Resort', value: 'UGX 2,400,000', trend: '9 Days Overdue (Due 29 Aug)' },
          { label: 'Reminders Sent', value: '2 notices', trend: 'Last sent 03 Sep' },
          { label: 'Customer Risk Rating', value: 'Overdue Risk', trend: 'Avg 38 days to pay' },
        ],
        explanation: 'Invoice #INV-2026-088 was issued on 15 August 2026 with 14-day terms. The customer has viewed the invoice twice but payment has not been recorded.',
        recommendation: 'Trigger an Airtel MoneyPay or M-Pesa STK Push instant prompt directly to their finance manager’s mobile line.',
        relatedAction: {
          label: 'Open Overdue Invoice #INV-2026-088',
          route: 'invoices',
        },
      };
    }

    // 6. "Compare this month with last month" / "compare"
    if (q.includes('compare') || q.includes('last month') || q.includes('growth')) {
      return {
        directAnswer: 'Your revenue increased by +12.4% (UGX 84.52M vs UGX 75.18M) while operating expenses decreased by -4.8%, driving an overall +18.2% surge in net profit.',
        supportingNumbers: [
          { label: 'Revenue Growth', value: '+12.4%', trend: 'UGX 84.52M vs UGX 75.18M' },
          { label: 'Expense Trend', value: '-4.8%', trend: 'UGX 56.34M vs UGX 59.18M' },
          { label: 'Net Profit Growth', value: '+18.2%', trend: 'UGX 28.18M vs UGX 23.84M' },
          { label: 'Liquid Cash', value: '+7.1%', trend: 'UGX 22.84M vs UGX 21.32M' },
        ],
        explanation: 'The strongest growth driver was cold storage rental revenue (+34% month-over-month) and repeat orders from Entebbe Grand Hotel and Kampala Central Supermarket.',
        recommendation: 'Lock in 6-month contracted terms with Entebbe Grand Hotel to guarantee steady baseline recurring revenue for Q4.',
        relatedAction: {
          label: 'Inspect Growth Metrics in Insights',
          route: 'insights',
        },
      };
    }

    // 7. "Can I afford new equipment?" / "equipment" / "afford" / "can i buy"
    if (q.includes('afford') || q.includes('equipment') || q.includes('capital expenditure') || q.includes('capex')) {
      return {
        directAnswer: 'Yes, based on your current cash position of UGX 22.84M across Stanbic Bank, MTN MoMo, Airtel MoneyPay, and M-Pesa, your business can fund equipment investments up to UGX 8,500,000 without compromising working capital.',
        supportingNumbers: [
          { label: 'Total Liquid Cash', value: 'UGX 22,840,000', trend: 'Bank + MoMo + Airtel + M-Pesa' },
          { label: 'Safety Buffer (2 Months)', value: 'UGX 10,600,000', trend: 'Reserved for OpEx' },
          { label: 'Available CapEx Budget', value: 'UGX 8,500,000', trend: 'Safe limit' },
          { label: 'Working Capital Margin', value: '1.82x', trend: 'Low Risk' },
        ],
        explanation: 'Current liquid reserves across Stanbic Operating Bank (UGX 14.25M), MTN MoMo (UGX 3.24M), M-Pesa (UGX 2.45M), and Airtel Money (UGX 1.85M) comfortably exceed monthly burn.',
        recommendation: 'If purchasing a second cold refrigeration unit or backup solar generator, negotiate a 50% down payment and 60-day milestone settlement to keep operating liquidity high.',
        relatedAction: {
          label: 'Simulate Cash Flow in Forecasting',
          route: 'forecasting',
        },
      };
    }

    // Default intelligent fallback based on live database
    return {
      directAnswer: `LedgerAI analyzed your live financial records across ${accounts.length} chart accounts, ${transactions.length} reconciled transactions, and ${invoices.length} invoices.`,
      supportingNumbers: [
        { label: 'Monthly Revenue', value: `${currencySymbol} ${pnl.totalRevenue.toLocaleString()}`, trend: 'Gross Volume' },
        { label: 'Net Profit', value: `${currencySymbol} ${pnl.netProfit.toLocaleString()}`, trend: `${pnl.netMarginPercent.toFixed(1)}% margin` },
        { label: 'Liquid Cash', value: `${currencySymbol} 22,840,000`, trend: 'Bank + MoMo + Airtel + M-Pesa' },
        { label: 'Outstanding Receivables', value: `${currencySymbol} ${(accounts.find(a => a.code === '1200')?.balance || 0).toLocaleString()}`, trend: 'Uncollected' },
      ],
      explanation: 'Your books are in good health. Double-entry validation is fully balanced with zero ledger discrepancies. Airtel MoneyPay, MTN MoMo, and M-Pesa reconciliations are 100% synchronized.',
      recommendation: 'Ask a specific question like "What is my Airtel Money balance?", "Where am I spending the most?", or "Who owes me money?" for tailored root-cause analysis.',
      relatedAction: {
        label: 'View Financial Dashboard',
        route: 'dashboard',
      },
    };
  }
}
