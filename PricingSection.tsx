import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { setCurrentView } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      priceMonthly: 30000,
      priceAnnual: 25000,
      target: 'Sole proprietors & small traders',
      features: [
        'Double-entry general ledger & chart of accounts',
        'Mobile money & cash receipts logging',
        'EFRIS electronic sales invoicing',
        'Financial Copilot query analysis',
        'Standard P&L, Balance Sheet, and Trial Balance',
        'Single user workspace',
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: false,
    },
    {
      name: 'Growth',
      priceMonthly: 75000,
      priceAnnual: 60000,
      target: 'Agribusinesses, distributors & wholesale',
      badge: 'Most Popular for SMEs',
      features: [
        'Everything in Starter, plus:',
        'Airtel MoneyPay & M-Pesa STK Push checkouts',
        'Direct Stanbic, Centenary & MoMo bank feed sync',
        'AI Receipt & Bill OCR scanning',
        'Side-by-side statement reconciliation',
        'Custom domain setup with SSL',
        'URA VAT 18% & WHT 6% tax filing reports',
        'Up to 5 team members with role controls',
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: true,
    },
    {
      name: 'Business',
      priceMonthly: 200000,
      priceAnnual: 160000,
      target: 'Multi-branch operations & distributors',
      features: [
        'Everything in Growth, plus:',
        'Multi-entity company switching',
        'Cash runway forecasting (30d to 12mo)',
        'Accountant Mode & CPA review workspace',
        'Multi-currency FX gain/loss revaluations',
        'Immutable audit logs & change history',
        'Priority phone & WhatsApp support',
        'Unlimited team seats',
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      priceMonthly: null,
      priceAnnual: null,
      target: 'Corporations & franchise networks',
      features: [
        'Custom ERP & banking core API hooks',
        'Dedicated cloud tenant deployment',
        'Regional tax rules (URA, KRA, TRA, RRA)',
        'Dedicated SLA & uptime guarantee',
        'On-site CPA team training & onboarding',
        'Custom SSO & role-based security',
      ],
      cta: 'Contact Sales Team',
      highlighted: false,
    },
  ];

  return (
    <div className="py-20 relative z-10 border-t border-white/10" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct Local Currency Billing
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Transparent Pricing for African Enterprises
          </h2>
          <p className="text-sm sm:text-base text-stone-400 mt-2">
            14-day free trial on all plans. Pay in local currency via Airtel MoneyPay, MTN MoMo, M-Pesa, or Bank EFT.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center mt-6">
            <div className="bg-stone-900/90 p-1 rounded-xl flex items-center gap-1 border border-white/15 backdrop-blur-xl shadow-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-bold text-amber-950 bg-amber-300 px-1.5 py-0.2 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const isMonthly = billingCycle === 'monthly';
            const price = isMonthly ? plan.priceMonthly : plan.priceAnnual;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl flex flex-col justify-between p-6 transition-all backdrop-blur-xl ${
                  plan.highlighted
                    ? 'bg-stone-900/90 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 ring-2 ring-emerald-500/20'
                    : 'bg-stone-900/70 border border-white/10 shadow-lg hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-emerald-600 to-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-lg border border-emerald-400/30">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-stone-400 mt-1">{plan.target}</p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    {price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-stone-400">UGX</span>
                        <span className="text-3xl font-bold text-white tabular-nums font-mono">
                          {price.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-400">/ mo</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-white">Custom Contract</div>
                    )}
                    <p className="text-[11px] text-stone-400 mt-1">
                      {price !== null ? (isMonthly ? 'Billed monthly' : 'Billed annually') : 'Tailored enterprise SLAs'}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-stone-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setCurrentView('onboarding')}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    plan.highlighted
                      ? 'bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/40'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
