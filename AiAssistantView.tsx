import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  ArrowRight,
  HelpCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const {
    aiMessages,
    sendAiQuery,
    setCurrentView,
    currentOrg,
    currencySymbol,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'How much profit did I make this month?',
    'Where am I spending the most?',
    'Who owes me money?',
    'What is my Airtel Money balance?',
    'Which invoices are overdue?',
    'Compare this month with last month.',
    'Can I afford new equipment?',
    'Show transactions above UGX 1M.',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    sendAiQuery(inputQuery);
    setInputQuery('');
  };

  const handlePromptClick = (prompt: string) => {
    sendAiQuery(prompt);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              LedgerAI Financial Copilot
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Deterministic double-entry natural language reasoning · Zero hallucination
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="flex items-center gap-1 font-medium text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Live DB Grounded
          </span>
          <span>·</span>
          <span>{currentOrg.name}</span>
        </div>
      </div>

      {/* Suggested Quick Prompts Grid */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
          Suggested Financial Queries
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="p-2.5 rounded-lg bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-left text-xs font-semibold text-stone-700 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
            >
              <span className="group-hover:text-stone-900 leading-snug">"{prompt}"</span>
              <span className="text-[10px] text-stone-400 group-hover:text-stone-600 mt-1 flex items-center gap-0.5">
                Run query <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {aiMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none shadow-xs font-medium'
                    : 'bg-stone-50 text-stone-800 border border-stone-200 rounded-tl-none space-y-3'
                }`}
              >
                {/* User Message */}
                {msg.sender === 'user' && <p>{msg.text}</p>}

                {/* Assistant Structured Message */}
                {msg.sender === 'assistant' && (
                  <>
                    {/* 1. Direct Answer */}
                    <div className="font-semibold text-stone-900 text-sm border-b border-stone-200 pb-2">
                      {msg.structuredData ? msg.structuredData.directAnswer : msg.text}
                    </div>

                    {/* 2. Supporting Numbers Grid */}
                    {msg.structuredData?.supportingNumbers && (
                      <div className="grid grid-cols-2 gap-2 my-2">
                        {msg.structuredData.supportingNumbers.map((num, nIdx) => (
                          <div key={nIdx} className="p-2.5 bg-white rounded-lg border border-stone-200">
                            <p className="text-[10px] text-stone-500">{num.label}</p>
                            <p className="text-sm font-bold font-mono text-stone-900 mt-0.5 tabular-nums">
                              {num.value}
                            </p>
                            {num.trend && (
                              <p className="text-[10px] text-emerald-800 font-medium mt-0.5">{num.trend}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3. Root Cause Explanation */}
                    {msg.structuredData?.explanation && (
                      <div className="text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                        <strong className="text-stone-900 block mb-0.5 text-[11px] uppercase tracking-wider">
                          Ledger Analysis & Details
                        </strong>
                        <p>{msg.structuredData.explanation}</p>
                      </div>
                    )}

                    {/* 4. Actionable Recommendation */}
                    {msg.structuredData?.recommendation && (
                      <div className="text-stone-900 bg-stone-100 p-3 rounded-lg border border-stone-200">
                        <strong className="text-stone-950 block mb-0.5 text-[11px] uppercase tracking-wider">
                          Action Recommendation
                        </strong>
                        <p>{msg.structuredData.recommendation}</p>
                      </div>
                    )}

                    {/* 5. Deep-Link Action */}
                    {msg.structuredData?.relatedAction && (
                      <div className="pt-2 border-t border-stone-200 flex justify-end">
                        <button
                          onClick={() => setCurrentView(msg.structuredData!.relatedAction!.route as any)}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          <span>{msg.structuredData.relatedAction.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-stone-50 border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask LedgerAI anything about your revenue, expenses, or cash flow..."
            className="flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800 shadow-2xs"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Safety Disclaimer */}
      <div className="text-center text-[11px] text-stone-400">
        LedgerAI queries actual database entries and double-entry records. It does not replace licensed CPAs or tax authorities.
      </div>
    </div>
  );
};
