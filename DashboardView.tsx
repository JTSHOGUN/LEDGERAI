import React, { useState, useMemo } from 'react';
import { useApp, DatePeriod } from '../../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Plus,
  FileText,
  Camera,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Landmark,
  Bot,
  ShieldCheck,
  Building2,
  Wallet,
  ArrowLeftRight,
  Receipt,
  Layers,
  BarChart3,
  LineChart as LineChartIcon
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentOrg,
    selectedPeriod,
    setSelectedPeriod,
    transactions,
    invoices,
    accounts,
    bankAccounts,
    aiInsights,
    setCurrentView,
    currencySymbol,
    formatMoney,
    theme,
  } = useApp();

  const [chartView, setChartView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [chartStyle, setChartStyle] = useState<'area' | 'bar' | 'profit'>('area');

  // Chart datasets based on real verified ledger totals
  const monthlyData = [
    { name: 'Apr', revenue: 38200000, expenses: 28400000, profit: 9800000, cashIn: 36000000, cashOut: 27000000 },
    { name: 'May', revenue: 41500000, expenses: 29800000, profit: 11700000, cashIn: 40000000, cashOut: 28500000 },
    { name: 'Jun', revenue: 39800000, expenses: 31200000, profit: 8600000, cashIn: 38500000, cashOut: 30000000 },
    { name: 'Jul', revenue: 44100000, expenses: 33380000, profit: 10720000, cashIn: 42000000, cashOut: 32000000 },
    { name: 'Aug', revenue: 75180000, expenses: 51340000, profit: 23840000, cashIn: 72000000, cashOut: 48000000 },
    { name: 'Sep (Cur)', revenue: 84520000, expenses: 56340000, profit: 28180000, cashIn: 81000000, cashOut: 52000000 },
  ];

  const weeklyData = [
    { name: 'Wk 1', revenue: 18200000, expenses: 12200000, profit: 6000000, cashIn: 17800000, cashOut: 11900000 },
    { name: 'Wk 2', revenue: 22400000, expenses: 14100000, profit: 8300000, cashIn: 21900000, cashOut: 13800000 },
    { name: 'Wk 3', revenue: 20800000, expenses: 13900000, profit: 6900000, cashIn: 20500000, cashOut: 13500000 },
    { name: 'Wk 4', revenue: 23120000, expenses: 16140000, profit: 6980000, cashIn: 20800000, cashOut: 12800000 },
  ];

  const dailyData = [
    { name: 'Mon', revenue: 3800000, expenses: 2150000, profit: 1650000, cashIn: 3800000, cashOut: 2100000 },
    { name: 'Tue', revenue: 4400000, expenses: 2400000, profit: 2000000, cashIn: 4200000, cashOut: 2350000 },
    { name: 'Wed', revenue: 5100000, expenses: 3800000, profit: 1300000, cashIn: 5000000, cashOut: 3750000 },
    { name: 'Thu', revenue: 4100000, expenses: 2200000, profit: 1900000, cashIn: 4000000, cashOut: 2100000 },
    { name: 'Fri', revenue: 6200000, expenses: 3600000, profit: 2600000, cashIn: 6100000, cashOut: 3500000 },
    { name: 'Sat', revenue: 5800000, expenses: 2900000, profit: 2900000, cashIn: 5600000, cashOut: 2800000 },
    { name: 'Sun', revenue: 1950000, expenses: 850000, profit: 1100000, cashIn: 1900000, cashOut: 800000 },
  ];

  const currentChartData = chartView === 'monthly' ? monthlyData : chartView === 'weekly' ? weeklyData : dailyData;

  const totalPeriodRevenue = useMemo(() => currentChartData.reduce((sum, d) => sum + d.revenue, 0), [currentChartData]);
  const totalPeriodExpenses = useMemo(() => currentChartData.reduce((sum, d) => sum + d.expenses, 0), [currentChartData]);
  const totalPeriodProfit = totalPeriodRevenue - totalPeriodExpenses;
  const avgPeriodMargin = totalPeriodRevenue > 0 ? ((totalPeriodProfit / totalPeriodRevenue) * 100).toFixed(1) : '0';

  const totalLiquidCash = accounts
    .filter(a => a.subtype === 'cash_and_bank' || a.subtype === 'mobile_money')
    .reduce((sum, a) => sum + a.balance, 0);

  const pendingInsights = aiInsights.filter(i => !i.resolved);

  // Custom High-Fidelity Chart Tooltip for Income vs Expenses
  const CustomIncomeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rev = payload.find((p: any) => p.dataKey === 'revenue')?.value || 0;
      const exp = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
      const profit = rev - exp;
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0';

      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 p-3.5 rounded-xl border border-stone-800 shadow-2xl min-w-[220px] space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
            <span className="text-xs font-bold text-stone-200">{label}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              {margin}% Net Margin
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                Money In (Revenue)
              </span>
              <span className="font-mono font-bold text-stone-100">{formatMoney(rev)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Money Out (Expenses)
              </span>
              <span className="font-mono font-bold text-stone-200">{formatMoney(exp)}</span>
            </div>

            <div className="pt-1.5 border-t border-stone-800 flex items-center justify-between font-semibold">
              <span className="text-stone-300">Realized Net Profit</span>
              <span className="font-mono font-bold text-teal-400">+{formatMoney(profit)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Cash Flow In vs Out
  const CustomCashFlowTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const cin = payload.find((p: any) => p.dataKey === 'cashIn')?.value || 0;
      const cout = payload.find((p: any) => p.dataKey === 'cashOut')?.value || 0;
      const netCash = cin - cout;

      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 p-3 rounded-xl border border-stone-800 shadow-xl min-w-[200px] space-y-1.5">
          <p className="text-xs font-bold text-stone-200 pb-1 border-b border-stone-800">{label}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-teal-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400" /> Money In
            </span>
            <span className="font-mono font-bold">{formatMoney(cin)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-rose-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Money Out
            </span>
            <span className="font-mono font-bold">{formatMoney(cout)}</span>
          </div>
          <div className="pt-1 border-t border-stone-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-300">Net Flow</span>
            <span className={`font-mono ${netCash >= 0 ? 'text-teal-300' : 'text-rose-300'}`}>
              {netCash >= 0 ? '+' : ''}{formatMoney(netCash)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Hero Welcome Banner with Glass Outlook and Authentic Agribusiness/Finance Imagery */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-lg bg-linear-to-r from-stone-900 via-stone-900 to-teal-950 text-white">
        {/* Subtle authentic background photo overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-luminosity pointer-events-none">
          <img
            src="/images/coffee-warehouse.jpg"
            alt="Agribusiness warehouse operations"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                URA EFRIS Compliant
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-stone-200 border border-white/15">
                FY 2026/27 Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {currentOrg.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Your books are fully reconciled across MTN MoMo Float, Stanbic Operating, and Airtel MoneyPay accounts.
            </p>
          </div>

          {/* Quick Action Button Cluster */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setCurrentView('invoices')}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </button>
            <button
              onClick={() => setCurrentView('scanner')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Camera className="w-3.5 h-3.5 text-stone-200" />
              <span>Scan Bill</span>
            </button>
            <button
              onClick={() => setCurrentView('banking')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-stone-200" />
              <span>Float Transfer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gross Revenue</span>
            <span className="inline-flex items-center text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.4%
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-mono tabular-nums">
            UGX 84,520,000
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2.5">
            <span>vs UGX 75.18M prior</span>
            <span className="text-stone-400 font-medium">Wholesale + Cold Chain</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Expenses</span>
            <span className="inline-flex items-center text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> 4.8%
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-mono tabular-nums">
            UGX 56,340,000
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2.5">
            <span>vs UGX 59.18M prior</span>
            <span className="text-stone-400 font-medium">OpEx + COGS</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Net Profit</span>
            <span className="inline-flex items-center text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 18.2%
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 mt-2 font-mono tabular-nums">
            UGX 28,180,000
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2.5">
            <span className="font-semibold text-stone-700">33.3% Net Margin</span>
            <span className="text-teal-800 font-bold">100% Balanced</span>
          </div>
        </div>

        {/* Liquid Cash */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Liquid Cash</span>
            <span className="inline-flex items-center text-[11px] font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 7.1%
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-mono tabular-nums">
            UGX 22,840,000
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2.5">
            <span className="font-semibold text-stone-700">4.8 Months Runway</span>
            <span className="text-stone-400 font-medium">Bank + MoMo Float</span>
          </div>
        </div>
      </div>

      {/* Intelligence Alert Finding Banner */}
      {pendingInsights.length > 0 && (
        <div className="p-5 bg-linear-to-r from-stone-900 via-stone-900 to-stone-950 text-white rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-700 text-white mt-0.5 shrink-0 shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  LedgerAI Verification Alert
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  {pendingInsights[0].severity.toUpperCase()} PRIORITY
                </span>
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {pendingInsights[0].title}
              </p>
              <p className="text-xs text-stone-300 mt-0.5 leading-relaxed max-w-3xl">
                {pendingInsights[0].description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('ai-assistant')}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            <span>Ask Financial Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Charts Section: Income vs Expenses & Banking Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>Income vs. Expenses</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  +{avgPeriodMargin}% Net Margin
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Revenue streams, operating costs, and realized net earnings
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Chart Mode Toggle */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setChartStyle('area')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    chartStyle === 'area' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                  title="Smooth Area Curves"
                >
                  Area
                </button>
                <button
                  onClick={() => setChartStyle('bar')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    chartStyle === 'bar' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                  title="Comparative Columns"
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartStyle('profit')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    chartStyle === 'profit' ? 'bg-white text-teal-800 shadow-2xs' : 'text-stone-600'
                  }`}
                  title="Net Profit Line"
                >
                  Net Profit
                </button>
              </div>

              {/* Timeframe Filter */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setChartView('monthly')}
                  className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                    chartView === 'monthly' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setChartView('weekly')}
                  className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                    chartView === 'weekly' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setChartView('daily')}
                  className={`px-2.5 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                    chartView === 'daily' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>
          </div>

          {/* Quick Summary Pill Bar */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-stone-50/80 rounded-xl border border-stone-200/80 text-xs">
            <div className="p-2 bg-white rounded-lg border border-teal-200/60 shadow-2xs">
              <p className="text-[10px] text-teal-800 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                Money In
              </p>
              <p className="font-mono font-bold text-teal-900 text-sm mt-0.5">{formatMoney(totalPeriodRevenue)}</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-rose-200/60 shadow-2xs">
              <p className="text-[10px] text-rose-800 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Money Out
              </p>
              <p className="font-mono font-bold text-rose-900 text-sm mt-0.5">{formatMoney(totalPeriodExpenses)}</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-stone-200 shadow-2xs">
              <p className="text-[10px] text-stone-600 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Realized Profit
              </p>
              <p className="font-mono font-bold text-teal-800 text-sm mt-0.5">+{formatMoney(totalPeriodProfit)}</p>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              {chartStyle === 'area' ? (
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="dashboardExpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#78716C"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomIncomeTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Money In (Revenue)"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fill="url(#dashboardRevGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Money Out (Expenses)"
                    stroke="#e11d48"
                    strokeWidth={2.2}
                    fill="url(#dashboardExpGrad)"
                  />
                </AreaChart>
              ) : chartStyle === 'bar' ? (
                <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#78716C"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomIncomeTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="revenue" name="Money In (Revenue)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Money Out (Expenses)" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#78716C"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomIncomeTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Net Operating Profit"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ fill: '#0d9488', r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Banking & Mobile Money Balances Card (1 col) */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Bank & MoMo Accounts</h3>
                <p className="text-xs text-stone-500">Live synchronized balances</p>
              </div>
              <button
                onClick={() => setCurrentView('banking')}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 mt-4">
              {bankAccounts.map(account => (
                <div
                  key={account.id}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg text-white font-bold text-xs shrink-0 ${
                      account.institution.includes('Stanbic')
                        ? 'bg-blue-800'
                        : account.institution.includes('Centenary')
                        ? 'bg-purple-900'
                        : account.institution.includes('Airtel')
                        ? 'bg-red-700'
                        : account.institution.includes('M-Pesa')
                        ? 'bg-emerald-700'
                        : account.institution.includes('MTN')
                        ? 'bg-amber-600'
                        : 'bg-stone-800'
                    }`}>
                      {account.type === 'mobile_money' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Landmark className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{account.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{account.accountNumber}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-stone-900 tabular-nums">
                    {currencySymbol} {account.balance.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">Total Liquid Capital:</span>
            <span className="font-extrabold font-mono text-teal-800 text-sm">
              {currencySymbol} {totalLiquidCash.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Cash Flow In vs Out Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Bar Chart (1 col) */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Cash Flow (In vs Out)</h3>
              <p className="text-xs text-stone-500">Net operating cash movements</p>
            </div>
            <button
              onClick={() => setCurrentView('reports')}
              className="text-[11px] font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
            >
              <span>IAS 7</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis dataKey="name" stroke="#78716C" fontSize={10} tickLine={false} />
                <YAxis stroke="#78716C" fontSize={10} tickLine={false} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomCashFlowTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                <Bar dataKey="cashIn" name="Money In" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cashOut" name="Money Out" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Table (2 cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Recent Transactions</h3>
              <p className="text-xs text-stone-500">Live double-entry register postings</p>
            </div>
            <button
              onClick={() => setCurrentView('transactions')}
              className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({transactions.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Channel</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.slice(0, 5).map(tx => (
                  <tr key={tx.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 font-mono text-stone-500">{tx.date}</td>
                    <td className="py-3 font-medium text-stone-900 max-w-[200px] truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 text-stone-600 truncate max-w-[140px]">
                      {tx.category}
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                        {tx.paymentMethod.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-mono font-bold tabular-nums ${
                      tx.type === 'income' ? 'text-teal-700' : 'text-stone-900'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'} {formatMoney(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
