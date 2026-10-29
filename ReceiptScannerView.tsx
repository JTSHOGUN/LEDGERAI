import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OcrExtractedData } from '../../types';
import { OcrService } from '../../services/ocrService';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Building2,
  Trash2,
  Plus,
  RefreshCw,
  Check,
  Smartphone,
  Landmark
} from 'lucide-react';

export const ReceiptScannerView: React.FC = () => {
  const { ocrReceipts, convertOcrToExpense, currentOrg, addOcrReceipt, formatMoney } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [selectedOcr, setSelectedOcr] = useState<OcrExtractedData | null>(ocrReceipts[0] || null);

  // Editable fields for confirmation before posting
  const [merchantName, setMerchantName] = useState(selectedOcr?.merchantName || '');
  const [category, setCategory] = useState(selectedOcr?.suggestedCategory || 'Transport & Fleet Fuel Expense');
  const [totalAmount, setTotalAmount] = useState(selectedOcr?.totalAmount.toString() || '');
  const [targetAccount, setTargetAccount] = useState('acc-1010'); // Stanbic

  const handleSelectOcr = (item: OcrExtractedData) => {
    setSelectedOcr(item);
    setMerchantName(item.merchantName);
    setCategory(item.suggestedCategory);
    setTotalAmount(item.totalAmount.toString());
  };

  const handleSimulateScan = async (sampleType: string) => {
    setIsScanning(true);
    const mockFile = {
      name: sampleType === 'fuel' ? 'TotalEnergies_Fuel_0907.jpg' : sampleType === 'power' ? 'Umeme_Electricity_Bill.pdf' : 'Kampala_Packaging_Slip.png',
      size: 1450000,
    };
    const extracted = await OcrService.simulateOcrScan(mockFile, currentOrg.id);
    addOcrReceipt(extracted);
    setSelectedOcr(extracted);
    setMerchantName(extracted.merchantName);
    setCategory(extracted.suggestedCategory);
    setTotalAmount(extracted.totalAmount.toString());
    setIsScanning(false);
  };

  const handleConfirmAndPost = () => {
    if (!selectedOcr) return;
    convertOcrToExpense(selectedOcr.id, category, targetAccount);
    setSelectedOcr(ocrReceipts.find(o => o.id !== selectedOcr.id) || null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Receipt & Invoice OCR Scanner
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Extract merchant, line items, VAT & map to chart of accounts
          </p>
        </div>

        {/* Test Scanners */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 hidden sm:inline">Try Sample:</span>
          <button
            onClick={() => handleSimulateScan('fuel')}
            disabled={isScanning}
            className="px-2.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer"
          >
            Total Fuel
          </button>
          <button
            onClick={() => handleSimulateScan('power')}
            disabled={isScanning}
            className="px-2.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer"
          >
            Umeme Power
          </button>
          <button
            onClick={() => handleSimulateScan('telecom')}
            disabled={isScanning}
            className="px-2.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer"
          >
            Airtel Data
          </button>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload & Ingestion Dropzone (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload Drop Area */}
          <div
            onClick={() => handleSimulateScan('fuel')}
            className={`p-6 bg-white rounded-xl border-2 border-dashed transition-all text-center cursor-pointer ${
              isScanning
                ? 'border-emerald-700 bg-emerald-50/40'
                : 'border-stone-300 hover:border-emerald-700 hover:bg-stone-50'
            }`}
          >
            {isScanning ? (
              <div className="py-8 space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-800 animate-spin mx-auto" />
                <p className="text-xs font-bold text-stone-900">OCR Processing Document...</p>
                <p className="text-[11px] text-stone-500">Detecting merchant TIN, line totals, and VAT schedule</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mx-auto border border-stone-200">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Drag & Drop Receipt or Invoice</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Supports PNG, JPG, PDF (Up to 15 MB)</p>
                </div>
                <button className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold shadow-xs">
                  Upload Scanned File
                </button>
              </div>
            )}
          </div>

          {/* Extracted Ingestion Queue */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Extracted Receipts ({ocrReceipts.length})
              </span>
              <span className="text-[10px] text-stone-500">Click to verify</span>
            </div>

            <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
              {ocrReceipts.length === 0 ? (
                <div className="p-6 text-center text-stone-400 text-xs">
                  No pending extracted receipts. Upload or test demo receipts above.
                </div>
              ) : (
                ocrReceipts.map(item => {
                  const isSelected = selectedOcr?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectOcr(item)}
                      className={`p-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-800' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 truncate">{item.merchantName}</p>
                        <p className="text-[10px] text-stone-500">{item.date} · {item.referenceNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-stone-900">{formatMoney(item.totalAmount)}</p>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          OCR Matched
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Verification & Human-in-the-Loop Confirmation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs p-6 flex flex-col justify-between">
          {selectedOcr ? (
            <div className="space-y-5 text-xs">
              {/* Header with status badge */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Verification & Ledger Posting</h3>
                  <p className="text-[11px] text-stone-500">Review parsed values before posting to expense ledger</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Fields Extracted & Verifiable</span>
                </div>
              </div>

              {/* Merchant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Extracted Merchant Name</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={e => setMerchantName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Receipt Reference #</label>
                  <input
                    type="text"
                    value={selectedOcr.referenceNumber}
                    readOnly
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-xs font-mono text-stone-700"
                  />
                </div>
              </div>

              {/* Line items table */}
              <div>
                <p className="font-bold text-stone-900 uppercase text-[10px] tracking-wider mb-2">
                  Extracted Line Items ({selectedOcr.lineItems.length})
                </p>
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 text-right">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono">
                      {selectedOcr.lineItems.map((li, lIdx) => (
                        <tr key={lIdx}>
                          <td className="p-2.5 font-sans font-medium text-stone-800">{li.description}</td>
                          <td className="p-2.5 text-right text-stone-600">{li.quantity}</td>
                          <td className="p-2.5 text-right text-stone-600">{formatMoney(li.unitPrice)}</td>
                          <td className="p-2.5 text-right font-bold text-stone-900">{formatMoney(li.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Account & Category assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Suggested Expense Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Transport & Fleet Fuel Expense">Transport & Fleet Fuel Expense</option>
                    <option value="Packaging Bags & Wooden Crates">Packaging Bags & Wooden Crates</option>
                    <option value="Warehouse Rent & Electricity (Umeme)">Warehouse Rent & Electricity</option>
                    <option value="Cost of Produce Purchased">Cost of Produce Purchased</option>
                    <option value="Internet & Telecom Data Bundles">Internet & Telecom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Paid From Account</label>
                  <select
                    value={targetAccount}
                    onChange={e => setTargetAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="acc-1010">Stanbic Operating Bank (UGX)</option>
                    <option value="acc-1040">Airtel MoneyPay (#887211)</option>
                    <option value="acc-1045">M-Pesa Till (#904210)</option>
                    <option value="acc-1030">MTN Mobile Money (#654210)</option>
                    <option value="acc-1050">Office Petty Cash Float</option>
                  </select>
                </div>
              </div>

              {/* Tax breakdown */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between font-mono">
                <span className="text-stone-600 font-sans">VAT Amount (18%): {formatMoney(selectedOcr.taxAmount)}</span>
                <span className="font-bold text-stone-900 font-sans text-sm">
                  Total Payable: <strong className="font-mono text-emerald-800">{formatMoney(selectedOcr.totalAmount)}</strong>
                </span>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  onClick={handleConfirmAndPost}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Post to Expenses</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center text-stone-400">
              <Camera className="w-10 h-10 text-stone-300 mb-2" />
              <p className="font-semibold text-stone-700">No receipt selected</p>
              <p className="text-xs text-stone-400 mt-1">Upload a receipt or pick one from the queue to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
