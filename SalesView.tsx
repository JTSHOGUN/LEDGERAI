import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Smartphone,
  Landmark,
  Plus,
  ArrowUpRight,
  FileText,
  Users,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const SalesView: React.FC = () => {
  const { invoices, customers, setCurrentView, currencySymbol, formatMoney } = useApp();

  const totalSalesRevenue = 84520000;
  const paidInvoicesTotal = invoices
    .filter(i => i.status === 'paid' || i.status === 'partially_paid')
    .reduce((sum, i) => sum + i.amountPaid, 0);

  const channelData = [
    { name: 'MTN MoMo Merchant Till', value: 40569600, percent: '48%', color: '#D97706' },
    { name: 'Stanbic Bank EFT Transfer', value: 27046400, percent: '32%', color: '#1C1917' },
    { name: 'Airtel Money Merchant', value: 11832800, percent: '14%', color: '#991B1B' },
    { name: 'Petty Cash Counter Float', value: 5071200, percent: '6%', color: '#047857' },
  ];

  const productSales = [
    { product: 'Bugisu Arabica AA', revenue: 38400000, volume: '80 Bags', share: '45.4%' },
    { product: 'Cold Storage Rental', revenue: 26120000, volume: '217 Pallet-Wks', share: '30.9%' },
    { product: 'Export Hass Avocados', revenue: 12400000, volume: '145 Crates', share: '14.7%' },
    { product: 'Bourbon Vanilla Beans', revenue: 7600000, volume: '11.6 Kg', share: '9.0%' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Sales & Revenue Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Channel breakdown across Mobile Money, Bank EFT, and direct client contracts
          </p>
        </div>

        <button
          onClick={() => setCurrentView('invoices')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Sales Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Gross Sales Realized</span>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            UGX 84,520,000
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-emerald-800 border-t border-stone-100 pt-2 font-medium">
            <span className="flex items-center"><ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM</span>
            <span className="text-stone-400">YTD 2026</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Mobile Money Share</span>
          <p className="text-2xl font-bold text-amber-800 mt-2 font-mono tabular-nums">
            62.0%
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2">
            <span>MTN + Airtel Merchant</span>
            <span className="text-stone-400">UGX 52.4M</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Active Billed Clients</span>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {customers.length} Accounts
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2">
            <span>100% Retained</span>
            <span className="text-emerald-800 font-medium">0 Churn</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500">Average Order Value</span>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            UGX 3,450,000
          </p>
          <div className="flex items-center justify-between mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2">
            <span>Wholesale Batches</span>
            <span className="text-stone-400">High Ticket</span>
          </div>
        </div>
      </div>

      {/* Payment Channel Breakdown & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Channel Breakdown */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="pb-3 mb-4 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Revenue by Payment Channel</h3>
            <p className="text-xs text-stone-500">Customer settlement methods across East Africa</p>
          </div>

          <div className="space-y-4">
            {channelData.map(ch => (
              <div key={ch.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ch.color }}></span>
                    {ch.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{formatMoney(ch.value)}</span>
                    <span className="text-stone-500 text-[11px]">({ch.percent})</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{ width: ch.percent, backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product / Service Performance */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="pb-3 mb-4 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Revenue by Product & Service</h3>
            <p className="text-xs text-stone-500">Produce sales vs cold storage logistics</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-2">Product Line</th>
                  <th className="pb-2">Volume</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {productSales.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 font-semibold text-stone-900">{p.product}</td>
                    <td className="py-2.5 text-stone-600">{p.volume}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-stone-900">
                      {formatMoney(p.revenue)}
                    </td>
                    <td className="py-2.5 text-right font-medium text-emerald-800 font-mono">{p.share}</td>
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
