import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Coins,
  PackageCheck
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { aiInsights, resolveInsight, setCurrentView, formatMoney, theme } = useApp();

  const businessHealthMetrics = [
    { label: 'Gross Margin Health', value: '59.5%', status: 'Optimal', sub: '+3.2% vs industry average' },
    { label: 'Debtor Days (DSO)', value: '14.2 Days', status: 'Good', sub: 'Fast collection cycle' },
    { label: 'Operating Runway', value: '4.8 Months', status: 'Low Risk', sub: 'Liquid reserves: UGX 22.84M' },
    { label: 'Burn Rate (Monthly)', value: 'UGX 5,300,000', status: 'Controlled', sub: 'OpEx minus gross margin' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Financial Health & Strategic Insights
            </h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${theme.badge}`}>
              {theme.name}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational alerts, working capital runway, and margin optimization
          </p>
        </div>

        <button
          onClick={() => setCurrentView('forecasting')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 ${theme.btnPrimary} rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer`}
        >
          <span>View Cash Flow Forecast</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Business Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessHealthMetrics.map(m => (
          <div key={m.label} className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
            <span className="text-xs font-semibold text-stone-500">{m.label}</span>
            <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">{m.value}</p>
            <div className="flex items-center justify-between mt-3 text-[11px] border-t border-stone-100 pt-2">
              <span className="text-emerald-800 font-semibold">{m.status}</span>
              <span className="text-stone-400">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Recommendations Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Strategic Action Queue ({aiInsights.length} Findings)
        </h3>

        <div className="space-y-3">
          {aiInsights.map(insight => (
            <div
              key={insight.id}
              className={`p-5 rounded-xl border transition-all ${
                insight.resolved
                  ? 'bg-stone-50/60 border-stone-200 opacity-60'
                  : insight.severity === 'high'
                  ? 'bg-red-50/40 border-red-200'
                  : insight.severity === 'medium'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        insight.severity === 'high'
                          ? 'bg-red-800 text-white'
                          : insight.severity === 'medium'
                          ? 'bg-amber-800 text-white'
                          : 'bg-stone-800 text-white'
                      }`}
                    >
                      {insight.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">{insight.title}</h4>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{insight.description}</p>
                  <p className="text-xs font-semibold text-stone-900 bg-white p-2.5 rounded-lg border border-stone-200 mt-2">
                    Suggested Action: {insight.suggestedAction}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0">
                  {insight.impactAmount && (
                    <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2 py-1 rounded border border-stone-200">
                      {formatMoney(insight.impactAmount)}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {!insight.resolved && (
                      <button
                        onClick={() => resolveInsight(insight.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-stone-100 border border-stone-300 rounded-md text-stone-700 cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {insight.actionRoute && (
                      <button
                        onClick={() => setCurrentView(insight.actionRoute as any)}
                        className="px-3 py-1 text-[11px] font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-md flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <span>Review</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
