import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  FileText,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { aiInsights, resolveInsight, setCurrentView, currencySymbol } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/50 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col">
          {/* Header */}
          <div className="p-4 md:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Notifications & Alerts</h2>
              <p className="text-xs text-stone-500">Live operational events requiring review</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiInsights.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-800">All clear</p>
                <p className="text-xs text-stone-500 mt-1">No pending financial anomalies or alerts.</p>
              </div>
            ) : (
              aiInsights.map(insight => (
                <div
                  key={insight.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    insight.resolved
                      ? 'bg-stone-50 border-stone-200 opacity-60'
                      : insight.severity === 'high'
                      ? 'bg-red-50/70 border-red-200'
                      : insight.severity === 'medium'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {insight.severity === 'high' && <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />}
                      {insight.severity === 'medium' && <Clock className="w-4 h-4 text-amber-700 shrink-0" />}
                      {insight.severity === 'low' && <TrendingUp className="w-4 h-4 text-stone-700 shrink-0" />}
                      <span className="text-xs font-bold text-stone-900">{insight.title}</span>
                    </div>
                    {insight.impactAmount && (
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                        {currencySymbol} {insight.impactAmount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {insight.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-stone-400">
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {!insight.resolved && (
                        <button
                          onClick={() => resolveInsight(insight.id)}
                          className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 px-2 py-1 rounded bg-white border border-stone-200 hover:bg-stone-50"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {insight.actionRoute && (
                        <button
                          onClick={() => {
                            setCurrentView(insight.actionRoute as any);
                            onClose();
                          }}
                          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
                        >
                          Open View <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer info */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
            <p className="text-[11px] text-stone-500">
              Alerts are calculated directly from your double-entry ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
