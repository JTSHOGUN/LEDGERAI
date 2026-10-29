import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccaWorkingPaper, AccaAuditRiskItem, AccaAdjustingJournal, AccaAuditReport } from '../../types';
import {
  UserCheck,
  Building2,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Layers,
  Award,
  BookOpen,
  FileSpreadsheet,
  Check,
  FileText,
  Plus,
  Sliders,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  X,
  ExternalLink,
  Lock,
  Unlock,
  Sparkles
} from 'lucide-react';

export const AccountantModeView: React.FC = () => {
  const {
    switchOrganization,
    currentOrg,
    setCurrentView,
    formatMoney,
    currencySymbol,
    isAccaMode,
    setIsAccaMode,
    accaWorkingPapers,
    updateWorkingPaper,
    accaMateriality,
    updateMateriality,
    accaAuditRisks,
    updateAuditRiskStatus,
    accaAdjustingJournals,
    addAdjustingJournal,
    accaAuditReport,
    signOffAuditReport,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'clients' | 'workpapers' | 'materiality' | 'journals' | 'audit_report'>('workpapers');

  // Modal State for Working Paper Edit / Signoff
  const [selectedPaper, setSelectedPaper] = useState<AccaWorkingPaper | null>(null);
  const [paperNotes, setPaperNotes] = useState('');
  const [paperStatus, setPaperStatus] = useState<AccaWorkingPaper['status']>('signed_off');

  // Modal State for Adjusting Journal Entry (AJE)
  const [isAjeModalOpen, setIsAjeModalOpen] = useState(false);
  const [ajeRef, setAjeRef] = useState(`AJE-2026-0${accaAdjustingJournals.length + 1}`);
  const [ajeStandard, setAjeStandard] = useState('IFRS 15');
  const [ajeDescription, setAjeDescription] = useState('Year-end accrued revenue & unearned contract liability adjustment');
  const [ajeDebitAccount, setAjeDebitAccount] = useState('Trade Receivables & Accrued Contract Assets');
  const [ajeCreditAccount, setAjeCreditAccount] = useState('Revenue from Wholesale Produce Contracts');
  const [ajeAmount, setAjeAmount] = useState('3200000');
  const [ajeExplanation, setAjeExplanation] = useState('To recognize revenue for dispatched FOB export consignments prior to midnight period cut-off under IFRS 15.');

  // Modal State for Audit Opinion Signoff
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState(false);
  const [opinionType, setOpinionType] = useState<AccaAuditReport['opinionType']>(accaAuditReport.opinionType);
  const [auditorNameInput, setAuditorNameInput] = useState(accaAuditReport.auditorName);
  const [memberNumberInput, setMemberNumberInput] = useState(accaAuditReport.accaMemberNumber);
  const [firmNameInput, setFirmNameInput] = useState(accaAuditReport.firmName);

  // Materiality Benchmark Editor State
  const [selectedBenchmark, setSelectedBenchmark] = useState(accaMateriality.benchmarkType);
  const [customPercentage, setCustomPercentage] = useState(accaMateriality.overallPercentage);

  const clientWorkspaces = [
    {
      id: 'org-01',
      name: 'Kampala Fresh Supplies Ltd',
      country: 'UG',
      industry: 'Wholesale Agro Logistics',
      revenue: 'UGX 84.52M',
      unreviewedTx: 2,
      reconPending: 0,
      taxDeadline: 'Sep 15 (8d)',
      auditStatus: 'ACCA Audit Ready',
      ifrsCompliance: '100% IFRS Aligned',
      tier: 'Growth Tier',
    },
    {
      id: 'org-02',
      name: 'Victoria Tech Hub Ltd',
      country: 'UG',
      industry: 'Software & Cloud Services',
      revenue: 'UGX 142.8M',
      unreviewedTx: 0,
      reconPending: 0,
      taxDeadline: 'Sep 15 (8d)',
      auditStatus: 'Audited & Signed',
      ifrsCompliance: 'IFRS 15 / IFRS 16 Signed',
      tier: 'Business Tier',
    },
    {
      id: 'org-03',
      name: 'Nile Logistics Uganda Ltd',
      country: 'UG',
      industry: 'Freight & Cross-Border Transport',
      revenue: 'UGX 58.2M',
      unreviewedTx: 5,
      reconPending: 3,
      taxDeadline: 'Sep 15 (8d)',
      auditStatus: 'Fieldwork in Progress',
      ifrsCompliance: 'ECL Impairment Pending',
      tier: 'Enterprise Tier',
    },
  ];

  const handleOpenPaperModal = (paper: AccaWorkingPaper) => {
    setSelectedPaper(paper);
    setPaperNotes(paper.notes);
    setPaperStatus(paper.status);
  };

  const handleSavePaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaper) return;

    updateWorkingPaper(selectedPaper.id, {
      notes: paperNotes,
      status: paperStatus,
      signOffDate: paperStatus === 'signed_off' ? new Date().toISOString().split('T')[0] : selectedPaper.signOffDate,
    });

    setSelectedPaper(null);
  };

  const handlePostAjeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(ajeAmount) || 0;
    if (amt <= 0) return;

    addAdjustingJournal({
      reference: ajeRef,
      date: new Date().toISOString().split('T')[0],
      standard: ajeStandard,
      description: ajeDescription,
      status: 'posted',
      approvedBy: `${currentOrg.plan === 'Enterprise' ? 'FCCA' : 'ACCA'} Senior Partner`,
      lines: [
        {
          accountId: 'aje-dr',
          accountName: ajeDebitAccount,
          debit: amt,
          credit: 0,
          explanation: ajeExplanation,
        },
        {
          accountId: 'aje-cr',
          accountName: ajeCreditAccount,
          debit: 0,
          credit: amt,
          explanation: ajeExplanation,
        },
      ],
    });

    setIsAjeModalOpen(false);
  };

  const handleSignoffAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signOffAuditReport(opinionType, auditorNameInput, memberNumberInput, firmNameInput);
    setIsSignoffModalOpen(false);
  };

  const handleMaterialityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMateriality(selectedBenchmark, undefined, customPercentage);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header & ACCA Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-stone-900 text-white">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  {isAccaMode ? 'ACCA Chartered Corporate Audit Mode' : 'Accountant & CPA Practice Mode'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> IFRS & ISA Compliant
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                International Financial Reporting Standards (IFRS), ISA Auditing Working Papers, Materiality & Statutory Opinion Engine
              </p>
            </div>
          </div>
        </div>

        {/* ACCA Mode Switcher & Tier Indicator */}
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 p-1 rounded-lg border border-stone-200 flex items-center text-xs">
            <button
              onClick={() => {
                setIsAccaMode(false);
                addToast({
                  type: 'info',
                  title: 'Switched to SME Standard Mode',
                  message: 'Standard general ledger review mode active.',
                });
              }}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                !isAccaMode ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              SME Practice
            </button>
            <button
              onClick={() => {
                setIsAccaMode(true);
                addToast({
                  type: 'success',
                  title: 'ACCA Chartered Mode Activated',
                  message: 'IFRS worksheets, ISA 320 materiality, and audit sign-off tools unlocked.',
                });
              }}
              className={`px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                isAccaMode
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>ACCA Chartered Mode</span>
            </button>
          </div>

          <button
            onClick={() => setIsAjeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post AJE Journal</span>
          </button>
        </div>
      </div>

      {/* ACCA Chartered Header Banner */}
      {isAccaMode && (
        <div className="p-5 bg-stone-900 text-white rounded-xl shadow-md border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                ASSOCIATION OF CHARTERED CERTIFIED ACCOUNTANTS
              </span>
              <span className="text-xs text-stone-400">· Practice License #P0812 (ICPAU / ACCA Fellow)</span>
            </div>
            <h2 className="text-base font-bold text-stone-100">
              International Audit & Assurance Standards Framework (ISA 200–810)
            </h2>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Auditing workspace for high-growth African corporations and multinational subsidiaries. All working papers strictly comply with IFRS 15, IFRS 16, IFRS 9 ECL, IAS 12, and statutory fiscal filing rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSignoffModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Sign Off Audit Report</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Audit Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">IFRS Working Papers</span>
            <div className="p-1 rounded bg-stone-100 text-stone-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {accaWorkingPapers.filter(w => w.status === 'signed_off').length} / {accaWorkingPapers.length} Signed
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>IFRS 15, 16, 9 & IAS 12</span>
            <span className="text-emerald-800 font-semibold">100% Complete</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">ISA 320 Materiality</span>
            <div className="p-1 rounded bg-stone-100 text-stone-700">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(accaMateriality.overallMateriality)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>Perf. Mat: {formatMoney(accaMateriality.performanceMateriality)}</span>
            <span className="text-stone-600">75% Benchmark</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Adjusting Journals (AJEs)</span>
            <div className="p-1 rounded bg-stone-100 text-stone-700">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {accaAdjustingJournals.length} Posted
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>Trial Balance Balanced</span>
            <span className="text-emerald-800 font-semibold">Net Zero Gap</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">ISA 570 Going Concern</span>
            <div className="p-1 rounded bg-stone-100 text-stone-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-800 mt-2 font-mono tabular-nums">
            Safe (Z: 3.84)
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>Altman Z-Score Stable</span>
            <span className="text-emerald-800 font-semibold">12-Mo Runway OK</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('workpapers')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'workpapers'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
          <span>IFRS Working Papers ({accaWorkingPapers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materiality')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'materiality'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-emerald-800" />
          <span>ISA 320 Materiality & Risk Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('journals')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'journals'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
          <span>Adjusting Journal Entries ({accaAdjustingJournals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_report')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'audit_report'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-800" />
          <span>Statutory Audit Opinion (ISA 700)</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'clients'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-800" />
          <span>Multi-Client Portfolios ({clientWorkspaces.length})</span>
        </button>
      </div>

      {/* TAB 1: IFRS WORKING PAPERS */}
      {activeTab === 'workpapers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accaWorkingPapers.map(paper => (
              <div
                key={paper.id}
                className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-stone-900 text-white">
                          {paper.standard}
                        </span>
                        <h3 className="text-sm font-bold text-stone-900">{paper.title}</h3>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">{paper.description}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                        paper.status === 'signed_off'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : paper.status === 'in_review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {paper.status === 'signed_off' ? 'SIGNED OFF' : paper.status === 'in_review' ? 'IN REVIEW' : 'DRAFT'}
                    </span>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(paper.keyMetrics).map(([key, val]) => (
                      <div key={key}>
                        <p className="text-[10px] text-stone-500 truncate">{key}</p>
                        <p className="font-mono font-bold text-stone-900 truncate">{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Audit Notes */}
                  <div className="mt-3 p-2.5 rounded bg-stone-100/60 border border-stone-200 text-xs text-stone-700">
                    <p className="font-semibold text-[11px] text-stone-800">Engagement Auditor Workpaper Note:</p>
                    <p className="text-stone-600 mt-0.5 text-[11px] leading-relaxed italic">"{paper.notes}"</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div>
                    <span>Prep: {paper.preparedBy.split(' ')[0]} · Review: {paper.reviewedBy.split(' ')[0]}</span>
                    {paper.signOffDate && <span className="ml-2 font-mono text-[10px]">({paper.signOffDate})</span>}
                  </div>

                  <button
                    onClick={() => handleOpenPaperModal(paper)}
                    className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Update Workpaper</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ISA 320 MATERIALITY & RISK MATRIX */}
      {activeTab === 'materiality' && (
        <div className="space-y-6">
          {/* Materiality Calculator Form */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">ISA 320 Audit Materiality Determination</h3>
                <p className="text-xs text-stone-500">
                  Audit materiality sets the threshold above which financial statement misstatements are considered material to economic decision-makers.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-stone-100 text-stone-800 border border-stone-200">
                Audited Revenue: {formatMoney(accaMateriality.benchmarkAmount)}
              </span>
            </div>

            <form onSubmit={handleMaterialityUpdate} className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Benchmark Metric</label>
                <select
                  value={selectedBenchmark}
                  onChange={e => setSelectedBenchmark(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  <option value="revenue">Annual Gross Revenue (1.0% ISA Standard)</option>
                  <option value="profit_before_tax">Profit Before Tax - PBT (5.0%)</option>
                  <option value="total_assets">Total Assets (1.0%)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Overall Materiality %</label>
                <input
                  type="number"
                  step="0.1"
                  value={customPercentage}
                  onChange={e => setCustomPercentage(parseFloat(e.target.value) || 1.0)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Performance Materiality</label>
                <input
                  type="text"
                  readOnly
                  value="75.0% of Overall"
                  className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-600"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Recalculate ISA 320 Benchmarks
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Overall Materiality</p>
                <p className="text-xl font-bold font-mono text-stone-900 mt-1">{formatMoney(accaMateriality.overallMateriality)}</p>
                <p className="text-[11px] text-stone-500 mt-1">1.0% of Revenue for Financial Statement Opinion</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Performance Materiality</p>
                <p className="text-xl font-bold font-mono text-emerald-800 mt-1">{formatMoney(accaMateriality.performanceMateriality)}</p>
                <p className="text-[11px] text-stone-500 mt-1">75% threshold applied to sample testing and journal audit</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Clearly Trivial Threshold</p>
                <p className="text-xl font-bold font-mono text-stone-700 mt-1">{formatMoney(accaMateriality.trivialThreshold)}</p>
                <p className="text-[11px] text-stone-500 mt-1">Misstatements under 5% not accumulated in Summary</p>
              </div>
            </div>

            <div className="p-3.5 bg-stone-100/70 rounded-lg border border-stone-200 mt-4 text-xs text-stone-700">
              <p className="font-semibold text-stone-900">Auditor Rationale & Working Paper Reference:</p>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">{accaMateriality.rationale}</p>
            </div>
          </div>

          {/* ISA 315 / 330 Audit Risk & Financial Statement Assertions Matrix */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">ISA 315 / 330 Risk Assessment & Assertion Testing Matrix</h3>
                <p className="text-xs text-stone-500">Mapping risks of material misstatement across Financial Statement Assertions</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="p-3">Financial Area</th>
                    <th className="p-3">Assertion Tested</th>
                    <th className="p-3 text-center">Inherent Risk</th>
                    <th className="p-3 text-center">Control Risk</th>
                    <th className="p-3">Audit Testing & Substantive Procedures</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {accaAuditRisks.map(risk => (
                    <tr key={risk.id} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900">{risk.area}</td>
                      <td className="p-3 font-mono text-stone-700">{risk.assertion}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          risk.inherentRisk === 'Significant' || risk.inherentRisk === 'High'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {risk.inherentRisk}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                          {risk.controlRisk}
                        </span>
                      </td>
                      <td className="p-3 text-stone-600 leading-relaxed max-w-md">{risk.auditResponse}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {risk.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADJUSTING JOURNAL ENTRIES (AJEs) */}
      {activeTab === 'journals' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Year-End Adjusting Journal Entries (AJEs)</h3>
                <p className="text-xs text-stone-500">Chartered IFRS adjusting journals posted to the audited Trial Balance</p>
              </div>

              <button
                onClick={() => setIsAjeModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Adjusting Journal</span>
              </button>
            </div>

            <div className="divide-y divide-stone-200">
              {accaAdjustingJournals.map(journal => (
                <div key={journal.id} className="p-4 hover:bg-stone-50/50">
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2 py-0.5 rounded">
                        {journal.reference}
                      </span>
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded">
                        {journal.standard}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900">{journal.description}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500 font-mono">{journal.date}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {journal.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Journal Lines Table */}
                  <div className="mt-2 bg-stone-50 border border-stone-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-stone-100 text-stone-600 text-[11px] border-b border-stone-200 font-semibold">
                          <th className="p-2">Account Name</th>
                          <th className="p-2 text-right">Debit ({currentOrg.currency})</th>
                          <th className="p-2 text-right">Credit ({currentOrg.currency})</th>
                          <th className="p-2">Auditor Explanation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {journal.lines.map((line, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium text-stone-900">{line.accountName}</td>
                            <td className="p-2 text-right font-mono font-bold text-stone-900">
                              {line.debit > 0 ? formatMoney(line.debit) : '—'}
                            </td>
                            <td className="p-2 text-right font-mono font-bold text-stone-900">
                              {line.credit > 0 ? formatMoney(line.credit) : '—'}
                            </td>
                            <td className="p-2 text-stone-500 text-[11px]">{line.explanation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-2 text-right text-[11px] text-stone-400">
                    Approved by: <span className="font-semibold text-stone-600">{journal.approvedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STATUTORY AUDIT OPINION (ISA 700) */}
      {activeTab === 'audit_report' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
            {/* Report Header */}
            <div className="border-b-2 border-stone-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-800">
                  INDEPENDENT AUDITOR'S STATUTORY REPORT
                </p>
                <h2 className="text-xl font-bold text-stone-900 mt-1">
                  Report on the Audit of the Financial Statements (ISA 700)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  To the Shareholders of <strong className="text-stone-900">{currentOrg.legalName}</strong> · Period ended 31 December 2026
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSignoffModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Re-sign & Seal Opinion</span>
                </button>
              </div>
            </div>

            {/* Opinion Section */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                  Audit Opinion: {accaAuditReport.opinionType.toUpperCase()} (CLEAN OPINION)
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                  ISA 700.16
                </span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed font-serif">
                "In our opinion, the accompanying financial statements give a <strong>true and fair view</strong> of the financial position of <strong>{currentOrg.legalName}</strong> as at 31 December 2026, and of its financial performance and its cash flows for the year then ended in accordance with <strong>International Financial Reporting Standards (IFRS)</strong> and the requirements of the Companies Act."
              </p>
            </div>

            {/* Key Audit Matters (KAMs - ISA 701) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-200 pb-1">
                Key Audit Matters (ISA 701)
              </h3>
              <p className="text-xs text-stone-500">
                Key audit matters are those matters that, in our professional judgment, were of most significance in our audit of the financial statements of the current period.
              </p>

              <div className="space-y-3 mt-3">
                {accaAuditReport.keyAuditMatters.map((kam, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900">{kam.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-stone-200 font-mono text-[10px] font-bold text-stone-800">
                        {kam.standard}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-700">Audit Risk & Scope:</p>
                      <p className="text-stone-600 mt-0.5 leading-relaxed">{kam.issue}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-700">How Our Audit Addressed the Matter:</p>
                      <p className="text-stone-600 mt-0.5 leading-relaxed">{kam.auditorResponse}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Going Concern (ISA 570) */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900">Conclusions Relating to Going Concern (ISA 570)</h4>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[10px]">
                  {accaAuditReport.goingConcernEvaluation.status}
                </span>
              </div>
              <p className="text-stone-600 leading-relaxed font-serif">
                {accaAuditReport.goingConcernEvaluation.details}
              </p>
              <div className="pt-2 flex items-center gap-4 text-[11px] text-stone-500 font-mono">
                <span>Altman Z-Score: <strong>{accaAuditReport.goingConcernEvaluation.zScore} (Safe Zone)</strong></span>
                <span>·</span>
                <span>Current Ratio: <strong>{accaAuditReport.goingConcernEvaluation.currentRatio}x</strong></span>
              </div>
            </div>

            {/* Digital Signature Certificate & Seal */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                    ACCA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">{accaAuditReport.auditorName}</p>
                    <p className="text-[10px] text-stone-500">{accaAuditReport.accaMemberNumber}</p>
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 font-mono mt-1">
                  Cryptographic Seal Hash: {accaAuditReport.digitalSignatureHash}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-stone-800">Kampala, Uganda</p>
                <p className="text-[11px] text-stone-500 font-mono">Date: {accaAuditReport.signedDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MULTI-CLIENT PORTFOLIOS */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">Multi-Client Corporate Audit Directory</h3>
            <span className="text-xs text-stone-500">Chartered practice multi-entity oversight</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-3">Client Entity</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3 text-right">Audited Revenue</th>
                  <th className="p-3">IFRS Compliance Status</th>
                  <th className="p-3 text-center">Audit Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {clientWorkspaces.map(client => {
                  const isCurrent = client.id === currentOrg.id;
                  return (
                    <tr key={client.id} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-stone-900 text-white font-bold flex items-center justify-center text-[10px]">
                          {client.name.charAt(0)}
                        </div>
                        <span>{client.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-stone-500">{client.industry}</td>
                      <td className="p-3 text-right font-mono font-bold text-stone-900">{client.revenue}</td>
                      <td className="p-3 text-stone-700 font-medium">
                        <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-800 font-mono">
                          {client.ifrsCompliance}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                          {client.auditStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            switchOrganization(client.id);
                            setCurrentView('accountant');
                          }}
                          className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span>Switch Audit Context</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPDATE WORKING PAPER MODAL */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-stone-900 text-white px-2 py-0.5 rounded">
                  {selectedPaper.standard}
                </span>
                <h2 className="text-sm font-bold text-stone-900">{selectedPaper.title}</h2>
              </div>
              <button
                onClick={() => setSelectedPaper(null)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePaperSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Working Paper Status</label>
                <select
                  value={paperStatus}
                  onChange={e => setPaperStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  <option value="signed_off">Signed Off (Approved by Audit Partner)</option>
                  <option value="in_review">In Review (Audit Manager Review)</option>
                  <option value="draft">Draft (Fieldwork in Progress)</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Auditor Working Paper Notes & Conclusions</label>
                <textarea
                  rows={4}
                  value={paperNotes}
                  onChange={e => setPaperNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 font-sans"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaper(null)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Save & Sign Off Workpaper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST ADJUSTING JOURNAL MODAL */}
      {isAjeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-stone-900 text-white">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-stone-900">Post Chartered Adjusting Journal Entry</h2>
              </div>
              <button
                onClick={() => setIsAjeModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostAjeSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Journal Reference</label>
                  <input
                    type="text"
                    value={ajeRef}
                    onChange={e => setAjeRef(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Accounting Standard</label>
                  <select
                    value={ajeStandard}
                    onChange={e => setAjeStandard(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="IFRS 15">IFRS 15 (Revenue Recognition)</option>
                    <option value="IFRS 16">IFRS 16 (Leases & ROU Assets)</option>
                    <option value="IFRS 9">IFRS 9 (ECL Impairment)</option>
                    <option value="IAS 12">IAS 12 (Deferred Taxes)</option>
                    <option value="IAS 21">IAS 21 (FX Revaluation)</option>
                    <option value="IAS 41">IAS 41 (Agriculture / Biological)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Journal Entry Description</label>
                <input
                  type="text"
                  value={ajeDescription}
                  onChange={e => setAjeDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Debit Account (DR)</label>
                  <input
                    type="text"
                    value={ajeDebitAccount}
                    onChange={e => setAjeDebitAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Credit Account (CR)</label>
                  <input
                    type="text"
                    value={ajeCreditAccount}
                    onChange={e => setAjeCreditAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Adjustment Amount ({currentOrg.currency})</label>
                <input
                  type="number"
                  value={ajeAmount}
                  onChange={e => setAjeAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono font-bold text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Auditor Technical Explanation</label>
                <textarea
                  rows={2}
                  value={ajeExplanation}
                  onChange={e => setAjeExplanation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAjeModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Post to Audited General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIGNOFF AUDIT REPORT MODAL */}
      {isSignoffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold text-stone-900">Sign Off ISA 700 Independent Auditor's Report</h2>
              </div>
              <button
                onClick={() => setIsSignoffModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSignoffAuditSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Auditor's Statutory Opinion Type</label>
                <select
                  value={opinionType}
                  onChange={e => setOpinionType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                >
                  <option value="unmodified">Unmodified Opinion (Clean Audit Opinion - ISA 700)</option>
                  <option value="qualified">Qualified Opinion (Except for Matter - ISA 705)</option>
                  <option value="adverse">Adverse Opinion (Material & Pervasive Misstatement)</option>
                  <option value="disclaimer">Disclaimer of Opinion (Inability to Obtain Evidence)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Engagement Partner Full Name & Designation</label>
                <input
                  type="text"
                  value={auditorNameInput}
                  onChange={e => setAuditorNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">ACCA Member ID / Practicing Certificate No.</label>
                <input
                  type="text"
                  value={memberNumberInput}
                  onChange={e => setMemberNumberInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Audit Firm Legal Entity Name</label>
                <input
                  type="text"
                  value={firmNameInput}
                  onChange={e => setFirmNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 text-[11px] space-y-1">
                <p className="font-bold text-stone-800">IESBA Code of Ethics & Independence Confirmation:</p>
                <p>• We confirm independence from the entity in accordance with the International Ethics Standards Board for Accountants (IESBA).</p>
                <p>• Cryptographic audit seal will be generated and timestamped.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSignoffModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Execute Digital Seal & Issue Opinion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
