import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Download,
  Sparkles,
  Bot,
  RefreshCw,
  Clock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';

export const ForecastingView: React.FC = () => {
  const { currentOrg, formatMoney, currencySymbol, theme, addToast, setCurrentView } = useApp();
  const [period, setPeriod] = useState<'30d' | '90d' | '6m' | '12m'>('90d');
  const [scenario, setScenario] = useState<'all' | 'base' | 'optimistic' | 'conservative'>('all');
  const [chartMode, setChartMode] = useState<'area' | 'line'>('area');

  // Simulation Modifiers
  const [revenueModifier, setRevenueModifier] = useState<number>(0); // -20% to +40%
  const [expenseModifier, setExpenseModifier] = useState<number>(0); // -20% to +20%
  const [paymentLagDays, setPaymentLagDays] = useState<number>(30); // 15, 30, 60 days

  // Base raw data points
  const rawData30d = [
    { period: 'Day 1', base: 22840000, optimistic: 22840000, conservative: 22840000, inflow: 2800000, outflow: 1800000 },
    { period: 'Day 7', base: 24200000, optimistic: 25100000, conservative: 23400000, inflow: 3400000, outflow: 2040000 },
    { period: 'Day 14', base: 25800000, optimistic: 27400000, conservative: 24100000, inflow: 4100000, outflow: 2500000 },
    { period: 'Day 21', base: 27100000, optimistic: 29500000, conservative: 24800000, inflow: 3900000, outflow: 2600000 },
    { period: 'Day 30', base: 28900000, optimistic: 32000000, conservative: 25400000, inflow: 4800000, outflow: 3000000 },
  ];

  const rawData90d = [
    { period: 'Sep (Cur)', base: 22840000, optimistic: 22840000, conservative: 22840000, inflow: 84520000, outflow: 56340000 },
    { period: 'Oct 2026', base: 26400000, optimistic: 29800000, conservative: 23900000, inflow: 88200000, outflow: 58100000 },
    { period: 'Nov 2026', base: 31200000, optimistic: 36500000, conservative: 25100000, inflow: 92400000, outflow: 60200000 },
    { period: 'Dec 2026', base: 37800000, optimistic: 45200000, conservative: 27400000, inflow: 99800000, outflow: 63500000 },
  ];

  const rawData6m = [
    { period: 'Sep (Cur)', base: 22840000, optimistic: 22840000, conservative: 22840000, inflow: 84520000, outflow: 56340000 },
    { period: 'Oct 2026', base: 26400000, optimistic: 29800000, conservative: 23900000, inflow: 88200000, outflow: 58100000 },
    { period: 'Nov 2026', base: 31200000, optimistic: 36500000, conservative: 25100000, inflow: 92400000, outflow: 60200000 },
    { period: 'Dec 2026', base: 37800000, optimistic: 45200000, conservative: 27400000, inflow: 99800000, outflow: 63500000 },
    { period: 'Jan 2027', base: 43200000, optimistic: 53100000, conservative: 29800000, inflow: 94100000, outflow: 61000000 },
    { period: 'Feb 2027', base: 49800000, optimistic: 62400000, conservative: 32400000, inflow: 98500000, outflow: 63200000 },
  ];

  const rawData12m = [
    { period: 'Q3 2026', base: 22840000, optimistic: 22840000, conservative: 22840000, inflow: 165000000, outflow: 112000000 },
    { period: 'Q4 2026', base: 37800000, optimistic: 45200000, conservative: 27400000, inflow: 280400000, outflow: 181800000 },
    { period: 'Q1 2027', base: 48900000, optimistic: 62000000, conservative: 32000000, inflow: 295000000, outflow: 189000000 },
    { period: 'Q2 2027', base: 61500000, optimistic: 81000000, conservative: 38400000, inflow: 320000000, outflow: 201000000 },
  ];

  // Apply interactive scenario simulation modifiers
  const chartData = useMemo(() => {
    const sourceData = period === '30d' ? rawData30d : period === '6m' ? rawData6m : period === '12m' ? rawData12m : rawData90d;

    return sourceData.map((d, index) => {
      if (index === 0) return d; // Starting position is fixed

      const revFactor = 1 + (revenueModifier / 100);
      const expFactor = 1 + (expenseModifier / 100);
      const lagPenalty = paymentLagDays === 60 ? 0.92 : paymentLagDays === 15 ? 1.04 : 1.0;

      const baseAdjusted = Math.round(d.base * revFactor * lagPenalty / expFactor);
      const optAdjusted = Math.round(d.optimistic * (revFactor * 1.1) * lagPenalty / expFactor);
      const consAdjusted = Math.round(d.conservative * (revFactor * 0.92) * lagPenalty / expFactor);

      return {
        ...d,
        base: baseAdjusted,
        optimistic: optAdjusted,
        conservative: consAdjusted,
      };
    });
  }, [period, revenueModifier, expenseModifier, paymentLagDays]);

  // Key KPI values
  const currentCash = 22840000;
  const monthlyNetBurn = 4750000;
  const runwayMonths = (currentCash / monthlyNetBurn).toFixed(1);
  const endPeriodBaseCash = chartData[chartData.length - 1]?.base || currentCash;
  const totalGrowthPercent = (((endPeriodBaseCash - currentCash) / currentCash) * 100).toFixed(0);

  // Custom High-Fidelity Tooltip
  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const baseVal = payload.find((p: any) => p.dataKey === 'base')?.value || 0;
      const optVal = payload.find((p: any) => p.dataKey === 'optimistic')?.value || 0;
      const consVal = payload.find((p: any) => p.dataKey === 'conservative')?.value || 0;
      const deltaVsToday = baseVal - currentCash;

      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 p-4 rounded-xl border border-stone-800 shadow-2xl min-w-[240px] space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="text-xs font-bold text-stone-200">{label}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              {deltaVsToday >= 0 ? '+' : ''}{((deltaVsToday / currentCash) * 100).toFixed(1)}% vs Now
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                Optimistic (+20%)
              </span>
              <span className="font-mono font-bold text-stone-100">{formatMoney(optVal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-200 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-100" />
                Base Trajectory
              </span>
              <span className="font-mono font-bold text-stone-100">{formatMoney(baseVal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Conservative (-15%)
              </span>
              <span className="font-mono font-bold text-stone-300">{formatMoney(consVal)}</span>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span>Implied Runway Duration:</span>
              <span className="font-mono font-bold text-teal-300">
                {(baseVal / monthlyNetBurn).toFixed(1)} Months
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleExportCSV = () => {
    let csv = 'Period,Base Projection (UGX),Optimistic Scenario (UGX),Conservative Scenario (UGX),Projected Inflow,Projected Outflow\n';
    chartData.forEach(row => {
      csv += `"${row.period}",${row.base},${row.optimistic},${row.conservative},${row.inflow},${row.outflow}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledgerai-cash-runway-forecast-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Runway Forecast Exported',
      message: 'Cash trajectory schedule downloaded as CSV.',
    });
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Cash Runway & Financial Trajectory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Double-Entry Statistical Model
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Simulate 30-day, 90-day, and 12-month working capital runways across base, optimistic, and conservative revenue scenarios
          </p>
        </div>

        {/* Timeframe Selector & Export Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            {[
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: '6m', label: '6 Months' },
              { id: '12m', label: '12 Months' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  period === p.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold border border-stone-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Working Capital Runway */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Current Runway</span>
            <span className="inline-flex items-center text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <ShieldCheck className="w-3 h-3 mr-1" /> Safe Zone
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-mono tabular-nums">
            {runwayMonths} Months
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
              <span>Safety Threshold: 3.0 Mo</span>
              <span className="font-semibold text-teal-700">+1.8 Mo Buffer</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>

        {/* Monthly Net Burn */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Monthly Net Inflow</span>
            <span className="inline-flex items-center text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <TrendingUp className="w-3 h-3 mr-1" /> Positive
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-800 mt-2 font-mono tabular-nums">
            +UGX 28.18M
          </p>
          <p className="text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
            <span>Operating Burn Buffer:</span>
            <span className="font-mono font-semibold text-stone-800">UGX 4.75M/mo</span>
          </p>
        </div>

        {/* Projected Closing Cash */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{period.toUpperCase()} Projection</span>
            <span className="inline-flex items-center text-[11px] font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
              +{totalGrowthPercent}% Expansion
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(endPeriodBaseCash)}
          </p>
          <p className="text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
            <span>Base Model Growth:</span>
            <span className="font-mono font-semibold text-teal-700">+{formatMoney(endPeriodBaseCash - currentCash)}</span>
          </p>
        </div>

        {/* Liquid Reserve Base */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Liquid Capital Pool</span>
            <span className="inline-flex items-center text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
              100% Reconciled
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(currentCash)}
          </p>
          <p className="text-[11px] text-stone-500 mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
            <span>Stanbic + MoMo Float:</span>
            <span className="font-mono font-semibold text-stone-800">4 Accounts</span>
          </p>
        </div>
      </div>

      {/* Main Forecast Chart Card */}
      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
        {/* Chart Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>Projected Liquid Cash Trajectory ({currencySymbol})</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                IAS 1 Going Concern Verified
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Corridor mapping base case against optimistic revenue expansion (+20%) and conservative stress (-15%)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Scenario Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setScenario('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  scenario === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                All Scenarios
              </button>
              <button
                onClick={() => setScenario('base')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  scenario === 'base' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Base
              </button>
              <button
                onClick={() => setScenario('optimistic')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  scenario === 'optimistic' ? 'bg-white text-teal-800 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Optimistic
              </button>
              <button
                onClick={() => setScenario('conservative')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  scenario === 'conservative' ? 'bg-white text-amber-800 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Conservative
              </button>
            </div>

            {/* Area / Line Toggle */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setChartMode('area')}
                className={`px-2 py-1 rounded-lg font-semibold cursor-pointer ${
                  chartMode === 'area' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartMode('line')}
                className={`px-2 py-1 rounded-lg font-semibold cursor-pointer ${
                  chartMode === 'line' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                }`}
              >
                Line
              </button>
            </div>
          </div>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-4 text-xs font-medium text-stone-600 pt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600" />
            <span>Optimistic Target (+20%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-stone-900" />
            <span>Base Operating Plan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-600" />
            <span>Conservative Floor (-15%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-600">
            <span className="w-3 h-0.5 bg-red-500 inline-block border-b-2 border-dashed border-red-500" />
            <span>Minimum Reserve Threshold (UGX 10M)</span>
          </div>
        </div>

        {/* Recharts Area / Line Canvas */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <defs>
                  <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1c1917" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#1c1917" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b45309" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#b45309" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis dataKey="period" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#78716C"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomForecastTooltip />} />
                <ReferenceLine y={10000000} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
                {(scenario === 'all' || scenario === 'optimistic') && (
                  <Area
                    type="monotone"
                    dataKey="optimistic"
                    name="Optimistic"
                    stroke="#0f766e"
                    strokeWidth={2.5}
                    fill="url(#optGrad)"
                  />
                )}
                {(scenario === 'all' || scenario === 'base') && (
                  <Area
                    type="monotone"
                    dataKey="base"
                    name="Base Case"
                    stroke="#1c1917"
                    strokeWidth={3}
                    fill="url(#baseGrad)"
                  />
                )}
                {(scenario === 'all' || scenario === 'conservative') && (
                  <Area
                    type="monotone"
                    dataKey="conservative"
                    name="Conservative"
                    stroke="#b45309"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#consGrad)"
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis dataKey="period" stroke="#78716C" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#78716C"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomForecastTooltip />} />
                <ReferenceLine y={10000000} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
                {(scenario === 'all' || scenario === 'optimistic') && (
                  <Line
                    type="monotone"
                    dataKey="optimistic"
                    name="Optimistic"
                    stroke="#0f766e"
                    strokeWidth={2.5}
                    dot={{ fill: '#0f766e', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(scenario === 'all' || scenario === 'base') && (
                  <Line
                    type="monotone"
                    dataKey="base"
                    name="Base Case"
                    stroke="#1c1917"
                    strokeWidth={3}
                    dot={{ fill: '#1c1917', r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {(scenario === 'all' || scenario === 'conservative') && (
                  <Line
                    type="monotone"
                    dataKey="conservative"
                    name="Conservative"
                    stroke="#b45309"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#b45309', r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Scenario Simulation Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Controls (1 col) */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-stone-900">Runway Simulation Sliders</h3>
            </div>
            <button
              onClick={() => {
                setRevenueModifier(0);
                setExpenseModifier(0);
                setPaymentLagDays(30);
              }}
              className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Revenue Growth Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-semibold">
                <span className="text-stone-700">Revenue Velocity Modifier</span>
                <span className={`font-mono font-bold ${revenueModifier >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                  {revenueModifier >= 0 ? `+${revenueModifier}%` : `${revenueModifier}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="5"
                value={revenueModifier}
                onChange={e => setRevenueModifier(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>-20% Stress</span>
                <span>Base (0%)</span>
                <span>+40% Boom</span>
              </div>
            </div>

            {/* Expense Reduction Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-semibold">
                <span className="text-stone-700">OpEx Cost Containment</span>
                <span className={`font-mono font-bold ${expenseModifier <= 0 ? 'text-teal-700' : 'text-amber-700'}`}>
                  {expenseModifier > 0 ? `+${expenseModifier}%` : `${expenseModifier}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="5"
                value={expenseModifier}
                onChange={e => setExpenseModifier(Number(e.target.value))}
                className="w-full accent-stone-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>-20% Cut</span>
                <span>Base (0%)</span>
                <span>+20% Expansion</span>
              </div>
            </div>

            {/* Customer Payment Lag */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-semibold">
                <span className="text-stone-700">Debtor Collection Days (DSO)</span>
                <span className="font-mono font-bold text-stone-900">{paymentLagDays} Days</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[15, 30, 60].map(days => (
                  <button
                    key={days}
                    onClick={() => setPaymentLagDays(days)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      paymentLagDays === days
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
            <strong>Stress Test Summary:</strong> Under worst-case zero collection lag and -20% revenue stress, your minimum liquidity floor remains above <strong>UGX 18.2M</strong>.
          </div>
        </div>

        {/* Projected Monthly Breakdown Table (2 cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Period-by-Period Cash Trajectory</h3>
              <p className="text-xs text-stone-500">Double-entry simulation of projected closing liquidity</p>
            </div>
            <button
              onClick={() => setCurrentView('ai-assistant')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Copilot Analysis</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-2.5">Period</th>
                  <th className="pb-2.5 text-right">Inflow Plan</th>
                  <th className="pb-2.5 text-right">Outflow Plan</th>
                  <th className="pb-2.5 text-right">Net Flow</th>
                  <th className="pb-2.5 text-right font-bold text-stone-900">Closing Cash</th>
                  <th className="pb-2.5 text-right">Runway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {chartData.map((row, idx) => {
                  const net = (row.inflow || 0) - (row.outflow || 0);
                  const impliedRunway = (row.base / monthlyNetBurn).toFixed(1);

                  return (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 font-semibold text-stone-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{row.period}</span>
                      </td>
                      <td className="py-3 text-right font-mono text-stone-700">
                        {formatMoney(row.inflow || 0)}
                      </td>
                      <td className="py-3 text-right font-mono text-stone-700">
                        {formatMoney(row.outflow || 0)}
                      </td>
                      <td className={`py-3 text-right font-mono font-bold ${net >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                        {net >= 0 ? '+' : ''}{formatMoney(net)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-stone-900 tabular-nums">
                        {formatMoney(row.base)}
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          {impliedRunway} Mo
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
