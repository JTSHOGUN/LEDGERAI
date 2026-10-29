import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Bot,
  User,
  ShieldCheck,
  Filter,
  Download
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [filterAiOnly, setFilterAiOnly] = useState(false);

  const filteredLogs = auditLogs.filter(log => {
    if (filterAiOnly && !log.isAiAction) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q) ||
        (log.newValue && log.newValue.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Immutable Audit Trail & Ledger History
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Cryptographically timestamped log of all user modifications and system adjustments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
            Audit Level: STRICT / WORM
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search action, user, or entity..."
            className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filterAiOnly}
            onChange={e => setFilterAiOnly(e.target.checked)}
            className="rounded text-emerald-800 focus:ring-emerald-800"
          />
          <span className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-stone-600" /> Automated Actions Only
          </span>
        </label>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">Actor / User</th>
                <th className="p-3">Action Performed</th>
                <th className="p-3">Entity Type</th>
                <th className="p-3">Audit Delta (Before → After)</th>
                <th className="p-3">IP / Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono text-stone-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                      {log.isAiAction ? (
                        <Bot className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      )}
                      <span>{log.userName}</span>
                    </div>
                    <span className="text-[10px] text-stone-400">{log.userRole}</span>
                  </td>
                  <td className="p-3 font-medium text-stone-900">{log.action}</td>
                  <td className="p-3 text-stone-600">{log.entityType}</td>
                  <td className="p-3 max-w-xs text-stone-700 font-mono text-[11px]">
                    {log.previousValue && (
                      <span className="text-stone-400 block line-through">{log.previousValue}</span>
                    )}
                    <span className="text-stone-900 font-semibold">{log.newValue || 'Recorded'}</span>
                  </td>
                  <td className="p-3 font-mono text-stone-500 text-[11px] whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
