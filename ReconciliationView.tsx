import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scale,
  Check,
  X,
  ArrowRightLeft,
  Plus,
  Landmark,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';

export const ReconciliationView: React.FC = () => {
  const {
    bankFeed,
    transactions,
    invoices,
    bills,
    matchBankFeedItem,
    ignoreBankFeedItem,
    addTransaction,
    formatMoney,
  } = useApp();

  const [selectedFeedId, setSelectedFeedId] = useState<string>(bankFeed[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'pending' | 'reconciled'>('pending');

  const pendingFeeds = bankFeed.filter(f => f.reconciliationStatus === 'unmatched');
  const matchedFeeds = bankFeed.filter(f => f.reconciliationStatus === 'matched');

  const activeFeedItem = bankFeed.find(f => f.id === selectedFeedId) || pendingFeeds[0];

  // Find suggested match record
  const suggestedInvoice = invoices.find(i => i.id === activeFeedItem?.suggestedMatchId);
  const suggestedTransaction = transactions.find(t => t.id === activeFeedItem?.suggestedMatchId);

  const handleCreateAndMatch = () => {
    if (!activeFeedItem) return;

    addTransaction({
      date: activeFeedItem.date,
      description: `Reconciled from statement: ${activeFeedItem.description}`,
      amount: Math.abs(activeFeedItem.amount),
      currency: 'UGX',
      type: activeFeedItem.amount > 0 ? 'income' : 'expense',
      debitAccountId: activeFeedItem.amount > 0 ? 'acc-1030' : 'acc-5100',
      creditAccountId: activeFeedItem.amount > 0 ? 'acc-4010' : 'acc-1010',
      category: activeFeedItem.amount > 0 ? 'Fresh Produce Wholesale Sales' : 'Operating Expenses',
      paymentMethod: activeFeedItem.accountId === 'bank-03' ? 'mobile_money_mtn' : 'bank_transfer',
      status: 'reconciled',
      referenceNumber: activeFeedItem.reference,
    });

    matchBankFeedItem(activeFeedItem.id, `tx-auto-${Date.now()}`, 'transaction');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Bank & Mobile Money Reconciliation
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Two-column matching engine: Bank & MoMo Statements ↔ Accounting Ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
            {pendingFeeds.length} Unreconciled Statements
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            {matchedFeeds.length} Matched
          </span>
        </div>
      </div>

      {/* Split-Screen 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bank / MoMo Feed Items (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Bank / MoMo Statements ({pendingFeeds.length})
            </h3>
            <span className="text-[10px] text-stone-500">Live Statements</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 space-y-1">
            {pendingFeeds.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-700">All statements reconciled</p>
                <p className="text-xs text-stone-400 mt-0.5">No pending feed entries awaiting matching.</p>
              </div>
            ) : (
              pendingFeeds.map(feed => {
                const isSelected = activeFeedItem?.id === feed.id;
                return (
                  <div
                    key={feed.id}
                    onClick={() => setSelectedFeedId(feed.id)}
                    className={`p-3 rounded-lg transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-700 shadow-2xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {feed.accountId === 'bank-03' || feed.accountId === 'bank-04' || feed.accountId === 'bank-05' ? (
                          <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <Landmark className="w-4 h-4 text-stone-700 shrink-0" />
                        )}
                        <span className="font-mono text-xs font-semibold text-stone-900 truncate">
                          {feed.reference}
                        </span>
                      </div>
                      <span className={`font-mono text-xs font-bold tabular-nums ${
                        feed.amount > 0 ? 'text-emerald-800' : 'text-stone-900'
                      }`}>
                        {feed.amount > 0 ? '+' : ''} {formatMoney(feed.amount)}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-stone-600 mt-1 line-clamp-2">
                      {feed.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
                      <span>{feed.date}</span>
                      {feed.matchConfidence && (
                        <span className="font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded">
                          {feed.matchConfidence}% Match
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Match Proposal & Action Pane (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs p-5 flex flex-col justify-between h-[650px] overflow-y-auto">
          {activeFeedItem ? (
            <div className="space-y-6">
              {/* Selected Statement Info */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Target Statement Entry
                </span>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs font-semibold text-stone-800">{activeFeedItem.description}</p>
                  <p className="font-mono text-base font-bold text-stone-900">
                    {formatMoney(activeFeedItem.amount)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span>Date: <strong>{activeFeedItem.date}</strong></span>
                  <span>Ref: <strong>{activeFeedItem.reference}</strong></span>
                </div>
              </div>

              {/* Match Recommendation Card */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-900 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900">
                    Suggested Ledger Match ({activeFeedItem.matchConfidence || 95}% Confidence)
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-800 text-white">
                    VERIFIED
                  </span>
                </div>

                {suggestedInvoice && (
                  <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>{suggestedInvoice.invoiceNumber} - {suggestedInvoice.customerName}</span>
                      <span className="font-mono text-emerald-800">{formatMoney(suggestedInvoice.total)}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Issue Date: {suggestedInvoice.issueDate} · Due Date: {suggestedInvoice.dueDate}
                    </p>
                    <p className="text-[11px] text-stone-600">
                      Match reason: Customer reference and settled amount align with outstanding balance.
                    </p>
                  </div>
                )}

                {suggestedTransaction && (
                  <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-stone-900">
                      <span>{suggestedTransaction.description}</span>
                      <span className="font-mono text-stone-900">{formatMoney(suggestedTransaction.amount)}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Ledger Category: {suggestedTransaction.category}
                    </p>
                  </div>
                )}

                {!suggestedInvoice && !suggestedTransaction && (
                  <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs text-stone-600">
                    No preexisting invoice with exact reference found. System recommends generating a reconciled transaction.
                  </div>
                )}
              </div>

              {/* Actions Grid */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">Reconciliation Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => matchBankFeedItem(activeFeedItem.id, suggestedInvoice?.id || 'tx-001', 'invoice')}
                    className="p-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Match Record</span>
                  </button>

                  <button
                    onClick={handleCreateAndMatch}
                    className="p-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex flex-col items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Post</span>
                  </button>

                  <button
                    onClick={() => matchBankFeedItem(activeFeedItem.id, 'split', 'transaction')}
                    className="p-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-stone-200 transition-colors cursor-pointer"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Split Tx</span>
                  </button>

                  <button
                    onClick={() => ignoreBankFeedItem(activeFeedItem.id)}
                    className="p-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex flex-col items-center justify-center gap-1 border border-stone-200 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-stone-500" />
                    <span>Ignore Item</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-stone-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mb-2" />
              <p className="font-semibold text-stone-700 text-sm">Select a statement to begin reconciliation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
