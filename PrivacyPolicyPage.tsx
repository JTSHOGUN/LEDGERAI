import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ArrowLeft, Lock, FileText, Globe, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16 font-sans">
      {/* Top Bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to App
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-800 text-white font-bold text-xs flex items-center justify-center font-mono">
                L
              </div>
              <span className="font-bold text-sm tracking-tight">LedgerAI Africa</span>
            </div>
          </div>
          <span className="text-xs text-stone-500 font-medium">Effective Date: September 7, 2026</span>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-stone-100 text-stone-800 rounded-lg border border-stone-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Privacy Policy</h1>
              <p className="text-sm text-stone-500">
                Data protection compliance for African small and medium-sized enterprises
              </p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none space-y-6 text-sm text-stone-700 leading-relaxed">
            <section className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <p className="font-semibold text-stone-800 mb-1">Regulatory Alignment Notice:</p>
              <p className="text-stone-600">
                This Privacy Policy complies with the Uganda Data Protection and Privacy Act 2019 (DPPA), Kenya Data Protection Act 2019, Nigeria Data Protection Regulation (NDPR), Ghana Data Protection Act (Act 843), Rwanda Law No. 058/2021 on the Protection of Personal Data, and international ISO/IEC 27001 data security standards.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3">
                1. Information We Collect
              </h2>
              <p className="mb-2">
                When you use LedgerAI Africa, we collect information necessary to deliver accurate double-entry accounting and financial copilot services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Organization & Profile Data:</strong> Company legal name, Tax Identification Number (TIN/PIN), physical address, phone numbers, and designated authorized users.</li>
                <li><strong>Financial & Transactional Records:</strong> Chart of accounts, journal entries, sales invoices, supplier bills, receipts, bank statements, and mobile money transaction identifiers.</li>
                <li><strong>Scanned Documents & OCR Data:</strong> Digital images and PDF uploads of paper receipts and invoices processed through our Optical Character Recognition (OCR) pipeline.</li>
                <li><strong>Audit Logs:</strong> Timestamped records of user actions, ledger modifications, IP addresses, and session activities to maintain audit integrity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3">
                2. How We Use Financial & Business Data
              </h2>
              <p className="mb-2">We process financial data exclusively for the following operational purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Generating double-entry accounting records, Trial Balances, P&L statements, and Balance Sheets.</li>
                <li>Executing deterministic queries and calculating business insights without data leaking across organization boundaries.</li>
                <li>Facilitating automated Airtel MoneyPay, M-Pesa, MTN MoMo, and banking reconciliation feeds.</li>
                <li>Preparing country-specific tax return schedules (e.g. Uganda URA EFRIS VAT and WHT).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3">
                3. Strict Multi-Tenant Isolation & Zero Data Selling
              </h2>
              <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 mb-3">
                <div className="flex items-center gap-2 font-semibold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  We Never Sell Your Financial Data
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  LedgerAI Africa operates on a subscription model. We do not monetize, broker, or license customer transaction data or merchant lists to third parties or advertising networks.
                </p>
              </div>
              <p className="text-stone-600">
                Every organization operates in an isolated tenant schema with cryptographically segmented access controls. Users from Organization A cannot view, query, or infer data from Organization B under any circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3">
                4. Data Encryption & Security Standards
              </h2>
              <p className="mb-2">We employ industry-leading cybersecurity controls:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Encryption in Transit:</strong> All HTTP communications are forced over TLS 1.3 with HSTS.</li>
                <li><strong>Encryption at Rest:</strong> Database volumes, file attachments, and audit logs are encrypted using AES-256.</li>
                <li><strong>Mobile Money Security:</strong> We do not store mobile money PINs. Integrations connect via secure merchant API tokens and OAuth2 flows.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3">
                5. AI Processing & Privacy Boundaries
              </h2>
              <p className="text-stone-600">
                When you query LedgerAI Copilot, calculations are computed deterministically against your live tenant database before structured explanations are generated. Proprietary financial data is never used to train public or foundational AI models.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3">
                6. Data Retention & Right to Erasure
              </h2>
              <p className="text-stone-600">
                Organizations retain full ownership of their financial records. Upon subscription termination, you can export all General Ledger history, invoices, and documents in standard CSV/PDF formats. Requests for permanent data deletion are fulfilled within 30 days in compliance with applicable statutory record-keeping regulations.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2 mb-3">
                7. Contact the Data Protection Officer
              </h2>
              <p className="text-stone-600">
                For questions regarding data privacy, contact our Data Protection Officer at:
                <br />
                <strong>Email:</strong> privacy@ledgerai.africa
                <br />
                <strong>Address:</strong> Plot 42, 7th Street Industrial Area, Kampala, Uganda
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
