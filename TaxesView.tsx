import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Download,
  Info,
  Clock,
  CheckCircle2,
  FileText,
  Building2
} from 'lucide-react';

export const TaxesView: React.FC = () => {
  const { currentOrg, taxSummaryReport, formatMoney } = useApp();
  const [activeCountry, setActiveCountry] = useState(currentOrg.country);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Tax Center & Statutory Compliance
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Uganda Revenue Authority (URA EFRIS) & East African tax schedule preparation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export URA EFRIS Return (CSV)</span>
          </button>
        </div>
      </div>

      {/* Official Legal Disclaimer Required by Spec */}
      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-950">Statutory Tax Disclaimer:</p>
          <p className="text-amber-800 mt-0.5">
            "Tax estimates are informational. Review filings with a qualified tax professional or certified tax agent before submitting to the Uganda Revenue Authority (URA) or regional revenue authorities."
          </p>
        </div>
      </div>

      {/* Tax Obligation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Net Estimated VAT (18%)</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Due in 8 Days
            </span>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(taxSummaryReport.netVatPayable)}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Output ({formatMoney(taxSummaryReport.vatCollectedOutput)}) - Input ({formatMoney(taxSummaryReport.vatPaidInput)})
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Withholding Tax (WHT 6%)</span>
            <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
              Contractor Withheld
            </span>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(taxSummaryReport.withholdingTaxPayable)}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            URA Section 119 compliance
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Corporation Tax Estimate</span>
            <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
              30% Standard Rate
            </span>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(taxSummaryReport.estimatedCorporationTax)}
          </p>
          <p className="text-[11px] text-stone-500 mt-2">
            Based on realized net operating profit
          </p>
        </div>
      </div>

      {/* Tax Schedules & Filing Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Breakdown */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="pb-3 mb-4 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Taxable Sales & Purchases Breakdown</h3>
            <p className="text-xs text-stone-500">Reconciled against EFRIS e-receipts and supplier bills</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="flex justify-between font-semibold text-stone-800">
                <span>Total Taxable Wholesale Sales (18%)</span>
                <span className="font-mono text-stone-900">{formatMoney(taxSummaryReport.taxableSales)}</span>
              </div>
              <div className="flex justify-between text-stone-600 pl-2">
                <span>Output VAT Generated</span>
                <span className="font-mono text-emerald-800 font-bold">{formatMoney(taxSummaryReport.vatCollectedOutput)}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="flex justify-between font-semibold text-stone-800">
                <span>Exempt / Zero-Rated Agricultural Sales (0%)</span>
                <span className="font-mono text-stone-900">{formatMoney(taxSummaryReport.exemptSales)}</span>
              </div>
              <p className="text-[10px] text-stone-500 pl-2">Unprocessed produce exempt under URA 2nd Schedule</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <div className="flex justify-between font-semibold text-stone-800">
                <span>Taxable Allowable Purchases & Fuel</span>
                <span className="font-mono text-stone-900">{formatMoney(taxSummaryReport.taxablePurchases)}</span>
              </div>
              <div className="flex justify-between text-stone-600 pl-2">
                <span>Allowable Input Tax Credit</span>
                <span className="font-mono text-stone-800 font-bold">{formatMoney(taxSummaryReport.vatPaidInput)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filing Deadlines Countdown */}
        <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Statutory Filing Deadlines (URA)</h3>
            <p className="text-xs text-stone-500">Upcoming tax returns and withholding dates</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <p className="font-bold text-amber-950">August Monthly VAT Return</p>
                  <p className="text-[11px] text-amber-800">Due September 15, 2026 (in 8 days)</p>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-900">{formatMoney(taxSummaryReport.netVatPayable)}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-stone-600 shrink-0" />
                <div>
                  <p className="font-bold text-stone-900">Withholding Tax (WHT) Filing</p>
                  <p className="text-[11px] text-stone-500">Due September 15, 2026</p>
                </div>
              </div>
              <span className="font-mono font-bold text-stone-700">{formatMoney(taxSummaryReport.withholdingTaxPayable)}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-stone-600 shrink-0" />
                <div>
                  <p className="font-bold text-stone-900">PAYE Staff Wages Return</p>
                  <p className="text-[11px] text-stone-500">Due September 15, 2026</p>
                </div>
              </div>
              <span className="font-mono font-bold text-stone-700">UGX 940,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
