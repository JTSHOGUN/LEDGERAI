import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PricingSection } from './PricingSection';
import {
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Scale,
  Bot,
  Camera,
  BarChart3,
  CheckCircle2,
  Lock,
  ChevronDown,
  Globe,
  Receipt,
  FileText,
  CreditCard,
  Building2,
  TrendingUp,
  LineChart,
  Zap,
  Check,
  UserCheck,
  FolderLock,
  Landmark,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Server,
  Workflow
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'banking' | 'momo' | 'efris' | 'copilot'>('banking');

  const faqs = [
    {
      q: 'Which African commercial banks are compatible with LedgerAI?',
      a: 'LedgerAI connects with commercial banks across Uganda (Stanbic, Centenary, DFCU, Absa, Equity, Standard Chartered, I&M Bank), Kenya (Equity Bank, KCB, NCBA, Co-op Bank, Absa, Stanbic), Tanzania (CRDB, NMB, Stanbic, NBC), Rwanda (Bank of Kigali, I&M Bank, Equity), Nigeria (GTBank, Zenith, Access, UBA, First Bank), Ghana (GCB, Ecobank, Stanbic, Absa), South Africa (Standard Bank, FNB, Absa, Nedbank, Capitec), Zambia (Zanaco, Stanbic, Absa), and Ethiopia (Commercial Bank of Ethiopia, Awash Bank). We support direct Open Banking APIs, SWIFT MT940 statement parsing, OFX, CAMT.053 ISO 20022 XML, and CSV statements.',
    },
    {
      q: 'How does LedgerAI handle Airtel MoneyPay, MTN MoMo, and M-Pesa?',
      a: 'Airtel MoneyPay, MTN MoMo, and Safaricom / Vodacom M-Pesa are treated as first-class financial accounts alongside standard commercial bank accounts. You can trigger live STK Push payment prompts directly from customer invoices, log till cash-ins, receive real-time webhook callbacks, and automatically isolate business revenue from personal director drawings for tax compliance.',
    },
    {
      q: 'Is the system compliant with Uganda Revenue Authority (URA) EFRIS?',
      a: 'Yes. Invoices, tax rates (18% Standard VAT, Zero-Rated, Exempt), and Withholding Tax (WHT 6%) are generated with URA EFRIS-compliant line items, buyer TINs, and verifiable reference numbers.',
    },
    {
      q: 'Can our accountant or auditor access our books?',
      a: 'Yes. LedgerAI includes a dedicated Accountant Mode allowing certified accountants to manage and review multiple client ledgers, review reconciliation queues, verify Trial Balance debits and credits, and export statutory audit schedules.',
    },
    {
      q: 'Can I connect a custom domain to our organization?',
      a: 'Yes. Organizations on Growth and Business plans can connect their custom domain (e.g. books.yourcompany.ug) with automated DNS verification and TLS/SSL encryption certificates.',
    },
    {
      q: 'How does the financial copilot ensure numbers are accurate?',
      a: 'LedgerAI uses a deterministic calculation architecture. When you ask questions like "How much profit did I make this month?", the query engine computes exact numerical values directly from your double-entry database before generating structured explanations. The system never fabricates or hallucinates financial data.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Navigation Header with Frosted Glass */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-stone-950/80 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-md shadow-emerald-950/50 ring-1 ring-white/20">
              <span className="font-mono">L</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">LedgerAI</span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wide shadow-xs">
                Africa
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-stone-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Platform</a>
            <a href="#gateways" className="hover:text-emerald-400 transition-colors">Bank & Mobile Rails</a>
            <a href="#demo-preview" className="hover:text-emerald-400 transition-colors">Live Architecture</a>
            <a href="#sectors" className="hover:text-emerald-400 transition-colors">African SMEs</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs font-semibold text-stone-200 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all cursor-pointer"
            >
              Open Workspace Demo
            </button>
            <button
              onClick={() => setCurrentView('onboarding')}
              className="text-xs font-semibold bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/30"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Glass Outlook & High-Resolution Background */}
      <section className="relative pt-16 pb-24 border-b border-white/10 z-10 overflow-hidden">
        {/* Architectural Glass Overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
          <img
            src="/images/bg-glass-tower.jpg"
            alt="Modern African financial skyscraper"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Uganda · Kenya · Tanzania · Rwanda · Nigeria · Ghana · South Africa · Zambia · Ethiopia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                Your African business books, <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-amber-300">understood.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-normal">
                Double-entry accounting built natively for African commercial banks (Stanbic, Equity, KCB, Absa, GTBank, CRDB) and mobile money rails (Airtel MoneyPay, MTN MoMo, M-Pesa Daraja 2.0). Complete with URA EFRIS e-invoicing compliance and automated statement ingestion.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('onboarding')}
                  className="px-6 py-3.5 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all ring-1 ring-emerald-400/40 cursor-pointer"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-stone-100 rounded-xl text-sm font-semibold border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <span>Explore Live App Workspace</span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>

              {/* Concrete Capabilities */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-stone-300">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>40+ African Banks</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>URA EFRIS e-Invoices</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Airtel & M-Pesa Rails</span>
                </div>
              </div>
            </div>

            {/* Right Column: Glass Outlook Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl bg-stone-900/85 ring-1 ring-emerald-500/20">
                {/* Visual Header Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src="/images/hero-business.jpg"
                    alt="East African business owner reviewing financial statements"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Ledger Feed</span>
                  </div>
                </div>

                {/* Glass Account Summary Overlay */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Kampala Fresh Supplies Ltd</h3>
                      <p className="text-xs text-stone-400">Plot 42, 7th Street Industrial Area · TIN: 1009845214</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-semibold">
                      URA EFRIS Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Total Revenue (Sep)</p>
                      <p className="text-lg font-mono font-bold text-white mt-0.5">UGX 84,520,000</p>
                      <p className="text-[10px] text-emerald-400 mt-0.5">Stanbic + Airtel + M-Pesa</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Net Profit (33.3%)</p>
                      <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">UGX 28,180,000</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">100% Balanced Ledger</p>
                    </div>
                  </div>

                  {/* Real Bank & MoMo Connectors */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-300">
                      <span className="flex items-center gap-2">
                        <Landmark className="w-3.5 h-3.5 text-blue-400" /> Stanbic Bank Uganda
                      </span>
                      <span className="font-mono text-white font-semibold">UGX 14,250,000</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-300">
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-red-400" /> Airtel MoneyPay Till
                      </span>
                      <span className="font-mono text-white font-semibold">UGX 1,850,000</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-300">
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Safaricom M-Pesa Till
                      </span>
                      <span className="font-mono text-white font-semibold">UGX 2,450,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Architecture Tabs (Glass Container) */}
      <section className="py-20 relative z-10 border-b border-white/10" id="demo-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enterprise African Accounting Rails
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              Explore how direct bank connections, mobile money checkout STK pushes, and URA tax schedules work inside the platform
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center justify-center mb-8">
            <div className="p-1 rounded-xl bg-stone-900/90 border border-white/15 backdrop-blur-xl flex flex-wrap gap-1 shadow-lg">
              <button
                onClick={() => setActiveTab('banking')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'banking'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>40+ African Bank Feeds</span>
              </button>
              <button
                onClick={() => setActiveTab('momo')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'momo'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile Money STK Push</span>
              </button>
              <button
                onClick={() => setActiveTab('efris')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'efris'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>URA EFRIS Compliance</span>
              </button>
              <button
                onClick={() => setActiveTab('copilot')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'copilot'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Financial Copilot</span>
              </button>
            </div>
          </div>

          {/* Tab Interactive Glass Card */}
          <div className="rounded-2xl border border-white/15 bg-stone-900/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
            {activeTab === 'banking' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
                    <Server className="w-3.5 h-3.5" /> Open Banking & MT940 Parser
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Direct Commercial Bank Feeds & Multi-Format Statements
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Connect Stanbic, Centenary, Equity Bank, KCB, Absa, GTBank, CRDB, and Standard Bank accounts. Ingest electronic statement files in SWIFT MT940, OFX, CAMT.053 ISO 20022 XML, and CSV formats with automated ledger mapping.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Bank-to-MoMo internal float transfer journal entries
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Custom feed rules to auto-categorize recurring vendor debits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Side-by-side reconciliation with General Ledger double-entry verification
                    </li>
                  </ul>
                  <button
                    onClick={() => setCurrentView('banking')}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Test Bank Connection In Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 p-4 rounded-xl bg-stone-950/80 border border-white/10 font-mono text-xs text-stone-300 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-stone-400">
                    <span>MT940 STATEMENT PARSER ENGINE</span>
                    <span className="text-emerald-400 font-semibold">VALIDATED</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <p className="text-stone-400">:20:STB-UG-20260907-88491028</p>
                    <p className="text-stone-400">:25:9030018829410 (Stanbic Bank Uganda)</p>
                    <p className="text-stone-400">:60F:C260907UGX13050000,00</p>
                    <p className="text-emerald-400">:61:2609070907CR1200000,00NTRFEFT//JINJA VALLEY RESORT</p>
                    <p className="text-stone-300">:86:INW EFT/JINJA VALLEY RESORT/INV-2026-088 PARTIAL</p>
                    <p className="text-stone-400">:62F:C260907UGX14250000,00</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px]">
                    Automatic match found: Invoice #INV-2026-088 (Jinja Valley Eco Resort). 1-click ledger clearance.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'momo' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/80 text-red-300 border border-red-500/30 text-[11px] font-semibold">
                    <Smartphone className="w-3.5 h-3.5" /> Airtel MoneyPay & M-Pesa STK Push
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Instant Mobile Money Customer Checkouts
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Trigger payment requests straight to your customer's handset. They enter their secure PIN, and your general ledger updates in real time with exact transaction reference IDs.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Automated STK push on invoice generation
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Webhook callbacks automatically mark invoice as Paid
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Separate personal withdrawals from commercial till earnings
                    </li>
                  </ul>
                  <button
                    onClick={() => setCurrentView('invoices')}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>View Interactive Invoices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 p-5 rounded-xl bg-stone-950/80 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                    <span className="font-semibold text-white">Live STK Push Simulation</span>
                    <span className="text-emerald-400 font-mono text-[11px]">STATUS: 200 OK</span>
                  </div>
                  <div className="p-4 rounded-lg bg-stone-900 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Customer:</span>
                      <span className="font-semibold text-white">Entebbe Grand Hotel (+256 702 991 430)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Invoice Amount:</span>
                      <span className="font-bold text-emerald-400 font-mono">UGX 4,756,200</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Channel:</span>
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-semibold">
                        Airtel MoneyPay #887211
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-stone-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>STK Prompt Received on handset · PIN authenticated · Reference: ARTL-UG-99214</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'efris' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Uganda URA EFRIS Compliant
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Automated URA Tax Filings & Fiscal Invoicing
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Generate compliant e-invoices with Buyer TIN verification, standard 18% VAT calculations, and Withholding Tax (WHT 6%) schedules ready for direct export.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Automatic monthly VAT Output & Input schedules
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Withholding Tax (WHT 6%) credit certificates
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Pre-filing audit checklist with anomaly flags
                    </li>
                  </ul>
                  <button
                    onClick={() => setCurrentView('taxes')}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Open Tax Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 p-5 rounded-xl bg-stone-950/80 border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-stone-400">
                    <span>URA EFRIS VAT COMPUTATION (AUG - SEP)</span>
                    <span className="text-amber-400 font-semibold">DUE SEP 15</span>
                  </div>
                  <div className="space-y-2 text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Total Output VAT (18% on Sales):</span>
                      <span className="text-white font-bold">UGX 5,240,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Less Input VAT (Purchases/Fuel):</span>
                      <span className="text-emerald-400 font-bold">- UGX 2,400,000</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between text-sm">
                      <span className="font-bold text-white">Net VAT Payable:</span>
                      <span className="font-bold text-amber-400">UGX 2,840,000</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px]">
                    All line items verified against supplier TINs and OCR-scanned receipts.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'copilot' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                    <Bot className="w-3.5 h-3.5" /> Deterministic Financial Copilot
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Ask LedgerAI in Natural Language
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    Ask questions like "Who is my largest overdue debtor?", "How much did we spend on diesel this quarter?", or "Draft my monthly URA tax return". The copilot computes real database queries without hallucinations.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-300 pt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Zero math hallucination: calculations execute directly in SQL/TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Detects spending anomalies and collection opportunities
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> Export answers as structured CSV or PDF audit attachments
                    </li>
                  </ul>
                  <button
                    onClick={() => setCurrentView('ai-assistant')}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Try Copilot Query</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 p-5 rounded-xl bg-stone-950/80 border border-white/10 space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-stone-900 border border-white/10 text-stone-200">
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">User Query</p>
                    <p className="mt-1 font-medium">"What is our liquid cash position across Stanbic and Mobile Money?"</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-stone-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-bold">
                      <Bot className="w-4 h-4" /> LedgerAI Verified Response
                    </div>
                    <p className="text-xs leading-relaxed text-stone-300">
                      Your total liquid funds stand at <strong className="text-white font-mono">UGX 22,840,000</strong> across 5 active accounts: Stanbic Bank (UGX 14.25M), Centenary (UGX 4.80M), MTN MoMo (UGX 3.24M), Safaricom M-Pesa (UGX 2.45M), and Airtel MoneyPay (UGX 1.85M).
                    </p>
                    <p className="text-[11px] text-stone-400">
                      At your current monthly net burn of UGX 4.75M, your working capital runway is <strong>4.8 months</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 40+ African Commercial Banks & Mobile Money Grid */}
      <section className="py-20 bg-stone-900/50 border-b border-white/10 relative z-10" id="gateways">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              African Banking & Mobile Money Integrations
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              Sync feeds automatically from 40+ major commercial banks or collect directly via Mobile Money
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* African Commercial Banks */}
            <div className="p-6 bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                    Open Banking API
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">40+ African Bank Feeds</h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Direct connection with Stanbic, Equity Bank, KCB, Absa, Centenary, DFCU, GTBank, Zenith, CRDB, Bank of Kigali, and Standard Bank via Open Banking & MT940 SWIFT.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                <span>9 Countries Supported</span>
                <span className="text-emerald-400 font-semibold">Daily Auto-Sync</span>
              </div>
            </div>

            {/* Airtel MoneyPay */}
            <div className="p-6 bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-red-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold font-mono text-xs">
                    AIR
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                    Instant STK Push
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Airtel MoneyPay Gateway</h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Collect payments from customer accounts across Uganda, Kenya, Tanzania, Rwanda, Nigeria, and Zambia. Webhook receipts automatically reconcile accounts receivable.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                <span>Till #887211</span>
                <span className="text-emerald-400 font-semibold">Auto-Reconciled</span>
              </div>
            </div>

            {/* M-Pesa Daraja */}
            <div className="p-6 bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-emerald-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-xs">
                    M
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Daraja 2.0 API
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Safaricom & Vodacom M-Pesa</h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Lipa na M-Pesa Online STK Push and Buy Goods Till settlements. Customers approve the payment with their PIN and funds clear into your ledger.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                <span>Till #904210</span>
                <span className="text-emerald-400 font-semibold">Auto-Reconciled</span>
              </div>
            </div>

            {/* MTN MoMo */}
            <div className="p-6 bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-mono text-xs">
                    MTN
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    Open API
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">MTN Mobile Money Tills</h3>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Sync merchant till cash-ins, excise tax deductions, and B2B disbursements with automatic bank feed matching and balance tracking.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                <span>Till #654210</span>
                <span className="text-emerald-400 font-semibold">Auto-Reconciled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Sector Stories & Photography (Agribusiness, Logistics, Certified CPAs) */}
      <section className="py-20 relative z-10 border-b border-white/10" id="sectors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Built for African SME Workflows
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              From wholesale fresh produce depots and coffee cooperatives to certified accounting practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wholesale Agriculture Card */}
            <div className="rounded-2xl border border-white/15 overflow-hidden bg-stone-900/80 backdrop-blur-xl flex flex-col shadow-xl group hover:border-emerald-500/40 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/wholesale-market.jpg"
                  alt="Kampala fresh produce wholesale warehouse"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded border border-emerald-700/50 backdrop-blur-md">
                  Wholesale & Produce
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Agricultural Logistics & Distribution</h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    Track wholesale produce lots, generate delivery invoices with buyer TINs, and manage fleet diesel fuel receipts with OCR scanning.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-stone-400">
                  <span>Batch lot tracking · Fuel expense OCR</span>
                </div>
              </div>
            </div>

            {/* Retail & Mobile Commerce Card */}
            <div className="rounded-2xl border border-white/15 overflow-hidden bg-stone-900/80 backdrop-blur-xl flex flex-col shadow-xl group hover:border-amber-500/40 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/mobile-payment.jpg"
                  alt="Shop merchant checking mobile money payment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded border border-amber-700/50 backdrop-blur-md">
                  Retail & Commerce
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Retail Tills & Mobile Payments</h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    Reconcile high-volume daily till collections from Airtel MoneyPay, MTN MoMo, and M-Pesa. Isolate personal drawings from business income.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-stone-400">
                  <span>Till reconciliation · Fee tracking</span>
                </div>
              </div>
            </div>

            {/* Accounting & Audit Practices */}
            <div className="rounded-2xl border border-white/15 overflow-hidden bg-stone-900/80 backdrop-blur-xl flex flex-col shadow-xl group hover:border-blue-500/40 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/images/accountant-review.jpg"
                  alt="Certified accountant reviewing audit reports"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/90 px-2.5 py-0.5 rounded border border-blue-700/50 backdrop-blur-md">
                  Accounting Practices
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Accountant Multi-Client Hub</h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    Certified accountants manage multiple client entities, review reconciliation queues, post adjusting journals, and generate audit schedules.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-stone-400">
                  <span>Multi-client view · Trial balance check</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules Grid */}
      <section className="py-20 bg-stone-900/40 border-b border-white/10 relative z-10" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Double-Entry Accounting Built for Africa
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              Every transaction balances across Assets, Liabilities, Equity, Revenue, and Expenses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-stone-900/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Double-Entry Ledger</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Automated balanced journals with Chart of Accounts, General Ledger, Trial Balance, and verified Balance Sheet schedules.
              </p>
            </div>

            <div className="p-6 bg-stone-900/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Receipt & Bill OCR</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Scan fuel receipts, utility bills, or vendor invoices. OCR extracts merchant name, TIN, line items, VAT, and maps directly to the chart of accounts.
              </p>
            </div>

            <div className="p-6 bg-stone-900/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Financial Copilot</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Ask in plain English: "Where am I spending the most?", "Who owes me money?", or "What is my Stanbic Bank balance?".
              </p>
            </div>

            <div className="p-6 bg-stone-900/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">URA EFRIS Tax Center</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Pre-calculate monthly VAT 18% output and input claims, Withholding Tax (WHT 6%), and corporation tax provisions before deadlines.
              </p>
            </div>

            <div className="p-6 bg-stone-900/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Custom Domain & SSL</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Connect your custom domain (e.g. books.yourcompany.ug) with verified CNAME/TXT records and automated SSL certificates.
              </p>
            </div>

            <div className="p-6 bg-stone-900/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Cash Runway Forecasting</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Simulate 30-day, 90-day, and 12-month working capital runways across base, optimistic, and conservative revenue scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Frosted Glass */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="py-20 relative z-10 border-t border-white/10" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-stone-400 mt-2">
              Implementation details, tax compliance, and commercial banking rails
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-stone-900/70 backdrop-blur-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isOpen ? 'transform rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-white/5 bg-stone-950/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-white/10 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono shadow-md shadow-emerald-950/50">
                  L
                </div>
                <span className="font-bold text-sm text-white tracking-tight">LedgerAI Africa</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Double-entry accounting and financial intelligence platform for African SMEs and certified accountants.
              </p>
            </div>

            <div>
              <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">Product</p>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-emerald-400">Dashboard</button></li>
                <li><button onClick={() => setCurrentView('transactions')} className="hover:text-emerald-400">General Ledger</button></li>
                <li><button onClick={() => setCurrentView('scanner')} className="hover:text-emerald-400">Receipt OCR Scanner</button></li>
                <li><button onClick={() => setCurrentView('banking')} className="hover:text-emerald-400">Bank & MoMo Accounts</button></li>
                <li><button onClick={() => setCurrentView('reports')} className="hover:text-emerald-400">Financial Reports</button></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">Compliance & Taxes</p>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => setCurrentView('taxes')} className="hover:text-emerald-400">Uganda URA EFRIS</button></li>
                <li><button onClick={() => setCurrentView('accountant')} className="hover:text-emerald-400">Accountant Mode</button></li>
                <li><button onClick={() => setCurrentView('audit')} className="hover:text-emerald-400">Audit Log</button></li>
                <li><button onClick={() => setCurrentView('settings')} className="hover:text-emerald-400">Custom Domain DNS</button></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white uppercase text-[10px] tracking-wider mb-3">Legal & Security</p>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => setCurrentView('privacy')} className="hover:text-emerald-400">Privacy Policy (DPPA / GDPR)</button></li>
                <li><button onClick={() => setCurrentView('terms')} className="hover:text-emerald-400">Terms and Conditions</button></li>
                <li><span className="text-stone-400">Data Center: Africa ISO 27001</span></li>
                <li><span className="text-stone-400">Encryption: AES-256 / TLS 1.3</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <p>© 2026 LedgerAI Africa Ltd. All rights reserved. Registered in Kampala, Uganda.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('privacy')} className="hover:text-stone-200">Privacy</button>
              <button onClick={() => setCurrentView('terms')} className="hover:text-stone-200">Terms</button>
              <button onClick={() => setCurrentView('settings')} className="hover:text-stone-200">Custom Domain</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
