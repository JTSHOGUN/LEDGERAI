import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_COUNTRIES, SUPPORTED_CURRENCIES } from '../../data/initialData';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Globe,
  Coins,
  Calendar,
  Smartphone,
  Upload,
  Camera,
  Bot,
  ShieldCheck,
  Check
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { setCurrentView, updateOrganization, addToast } = useApp();
  const [step, setStep] = useState(1);

  // Form state
  const [businessName, setBusinessName] = useState('Kampala Fresh Supplies Ltd');
  const [tin, setTin] = useState('1009845214');
  const [industry, setIndustry] = useState('Wholesale & Agro Logistics');
  const [country, setCountry] = useState('UG');
  const [currency, setCurrency] = useState('UGX');
  const [fiscalYearEnd, setFiscalYearEnd] = useState('December 31');
  const [efrisRegistered, setEfrisRegistered] = useState(true);
  const [momoProvider, setMomoProvider] = useState('Airtel Money Uganda');
  const [tillNumber, setTillNumber] = useState('887211');

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);

  const totalSteps = 10;

  const handleNext = () => {
    if (step === 9 && !aiAnalysisComplete) {
      setIsAiAnalyzing(true);
      setTimeout(() => {
        setIsAiAnalyzing(false);
        setAiAnalysisComplete(true);
        setStep(10);
      }, 1200);
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Finalize onboarding
      updateOrganization({
        name: businessName,
        legalName: `${businessName} Limited`,
        country: country as any,
        currency: currency as any,
        tin,
        efrisRegistered,
        industry,
        fiscalYearEnd,
      });
      addToast({
        type: 'success',
        title: 'Setup Complete',
        message: `Welcome to LedgerAI Africa, ${businessName}!`,
      });
      setCurrentView('dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Bar */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold font-mono text-sm">
            L
          </div>
          <div>
            <p className="font-bold text-sm text-stone-900 leading-tight">LedgerAI Africa</p>
            <p className="text-[10px] text-stone-500">10-Step Setup Wizard</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          Skip to Demo Dashboard
        </button>
      </header>

      {/* Main Wizard Card */}
      <div className="max-w-2xl mx-auto w-full bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden my-auto">
        {/* Progress Bar */}
        <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700">
            Step {step} of {totalSteps}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx + 1 === step
                    ? 'w-6 bg-emerald-800'
                    : idx + 1 < step
                    ? 'w-2 bg-emerald-600'
                    : 'w-2 bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-4 text-center py-2">
              <div className="rounded-xl overflow-hidden max-w-sm mx-auto border border-stone-200 mb-4">
                <img
                  src="/images/hero-business.jpg"
                  alt="East African business owner"
                  className="w-full h-36 object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-stone-900">Welcome to LedgerAI Africa</h2>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Set up your double-entry chart of accounts, local tax preferences, and mobile money connections in under 2 minutes.
              </p>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-left text-xs text-stone-700 space-y-1.5 max-w-md mx-auto mt-4">
                <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> Double-entry financial general ledger</p>
                <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> Airtel MoneyPay, M-Pesa & MTN MoMo reconciliation</p>
                <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-700" /> URA EFRIS & VAT 18% filing assistance</p>
              </div>
            </div>
          )}

          {/* Step 2: Business details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">What is your business name?</h2>
              <p className="text-xs text-stone-500">This will appear on your e-invoices and tax schedules.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    placeholder="e.g. Kampala Fresh Supplies Ltd"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tax Identification Number (TIN)</label>
                  <input
                    type="text"
                    value={tin}
                    onChange={e => setTin(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    placeholder="10-digit URA TIN"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Industry</label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="Wholesale & Agro Logistics">Wholesale & Agro Logistics</option>
                    <option value="Retail & Supermarkets">Retail & Supermarkets</option>
                    <option value="Restaurant & Hospitality">Restaurant & Hospitality</option>
                    <option value="Professional Services & Tech">Professional Services & Tech</option>
                    <option value="Manufacturing & Packaging">Manufacturing & Packaging</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Country */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Select Operating Country</h2>
              <p className="text-xs text-stone-500">Determines tax authority rules, statutory VAT rates, and mobile money rails.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {SUPPORTED_COUNTRIES.map(c => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCountry(c.code);
                      setCurrency(c.defaultCurrency);
                    }}
                    className={`p-3 rounded-lg border text-left text-xs font-medium flex items-center justify-between transition-all ${
                      country === c.code
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-[10px] text-stone-500">{c.taxAuthority}</p>
                    </div>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white border border-stone-200">
                      {c.defaultCurrency}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Currency */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Base Accounting Currency</h2>
              <p className="text-xs text-stone-500">All General Ledger reports will convert into this primary functional currency.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.values(SUPPORTED_CURRENCIES).map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all ${
                      currency === curr.code
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <p className="font-mono font-bold text-sm">{curr.code}</p>
                    <p className="text-[10px] text-stone-500 truncate">{curr.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Tax & Fiscal Year */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Financial Year & Tax Setup</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Fiscal Year End</label>
                  <select
                    value={fiscalYearEnd}
                    onChange={e => setFiscalYearEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                  >
                    <option value="December 31">December 31 (Calendar Year)</option>
                    <option value="June 30">June 30 (Uganda / EA Statutory Year)</option>
                    <option value="March 31">March 31</option>
                  </select>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={efrisRegistered}
                      onChange={e => setEfrisRegistered(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Registered for URA EFRIS (Electronic Fiscal Receipting)</span>
                  </label>
                  <p className="text-[11px] text-stone-500 mt-1 pl-6">
                    Enables automatic VAT (18%) line breakdown and Buyer TIN verification on invoices.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Connect Bank / MoMo */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Connect Bank or Mobile Money</h2>
              <p className="text-xs text-stone-500">Link your primary collection account for automatic reconciliation.</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  {['Airtel Money Uganda', 'MTN MoMo Uganda', 'Safaricom M-Pesa', 'Stanbic Bank'].map(prov => (
                    <button
                      key={prov}
                      onClick={() => setMomoProvider(prov)}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        momoProvider === prov
                          ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Merchant Till / Account Number</label>
                  <input
                    type="text"
                    value={tillNumber}
                    onChange={e => setTillNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    placeholder="e.g. 887211 or 9030018829410"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Import Transactions */}
          {step === 7 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">Import Opening Transactions</h2>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Realistic Ugandan SME transactions, chart accounts, and sample clients are ready for {businessName}.
              </p>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 text-left max-w-sm mx-auto font-mono">
                <p className="font-bold text-stone-900 font-sans">Opening Liquid Balances:</p>
                <p className="mt-0.5">Stanbic Operating Bank: UGX 14.25M</p>
                <p>MTN MoMo Till #654210: UGX 3.24M</p>
                <p>Airtel MoneyPay Till #887211: UGX 1.85M</p>
                <p>M-Pesa Till #904210: UGX 2.45M</p>
              </div>
            </div>
          )}

          {/* Step 8: Upload receipt */}
          {step === 8 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center mx-auto border border-stone-200">
                <Camera className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">Receipt & Bill OCR Ready</h2>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                OCR pipeline initialized to extract merchants, line items, and VAT amounts from photos and PDFs.
              </p>
              <div className="p-4 bg-stone-50 rounded-lg border border-dashed border-stone-300 text-xs text-stone-500 max-w-sm mx-auto">
                TotalEnergies Diesel Receipt & Umeme Bill loaded for instant testing in the scanner.
              </div>
            </div>
          )}

          {/* Step 9: AI analyzes books */}
          {step === 9 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                {isAiAnalyzing ? 'Verifying General Ledger & Reconciliations...' : 'Ready to Run Baseline Audit'}
              </h2>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Verifying double-entry balance, calculating initial Gross Margin, and checking tax calendar deadlines.
              </p>
            </div>
          )}

          {/* Step 10: Dashboard Ready */}
          {step === 10 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-stone-900">Your Books Are Ready</h2>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {businessName} is configured with UGX double-entry accounting, Airtel MoneyPay, MTN MoMo, M-Pesa, and URA EFRIS compliance.
              </p>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 max-w-xs mx-auto">
                <p className="font-bold text-stone-900">Launch Checklist Verified:</p>
                <p className="text-stone-500 mt-1 font-mono">Domain: books.kampalafresh.ug</p>
                <p className="text-stone-500">Security: AES-256 / TLS 1.3 Active</p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Navigation Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              step === 1
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : 'text-stone-700 hover:bg-stone-200 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>{step === totalSteps ? 'Launch Dashboard' : step === 9 ? 'Run Ledger Audit' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="text-center pt-6 text-[11px] text-stone-400">
        LedgerAI Africa · Production Double-Entry Accounting
      </footer>
    </div>
  );
};
