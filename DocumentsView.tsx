import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';
import {
  FolderLock,
  Search,
  Plus,
  Upload,
  FileText,
  Tag,
  Download,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, deleteDocument, formatMoney } = useApp();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentItem['type']>('receipt');
  const [tagsInput, setTagsInput] = useState('Fuel, Tax Deductible');

  // Semantic AI query search demonstration
  const filteredDocs = documents.filter(doc => {
    if (selectedTag !== 'all' && !doc.tags.includes(selectedTag)) return false;
    if (search) {
      const q = search.toLowerCase();
      // Handle semantic keywords like "supplier", "1m", "july", "receipt"
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.tags.some(t => t.toLowerCase().includes(q)) ||
        doc.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const allTags = Array.from(new Set(documents.flatMap(d => d.tags)));

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    addDocument({
      name: docName,
      type: docType,
      fileSize: '1.8 MB',
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      ocrStatus: 'processed',
      currency: 'UGX',
    });

    setIsUploadOpen(false);
    setDocName('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Document Vault & Search
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Encrypted storage for receipts, supplier contracts, bank statements, and tax filings
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Semantic Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents by filename, tag, or content (e.g. 'Fuel', 'URA', 'Lease')..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {/* Tag filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              selectedTag === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Tags
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedTag === tag ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-800 border border-stone-200">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 truncate max-w-[170px]">{doc.name}</h3>
                    <p className="text-[10px] text-stone-400">{doc.uploadDate} · {doc.fileSize}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                  {doc.ocrStatus}
                </span>
              </div>

              {doc.extractedTotal && (
                <div className="mt-3 p-2 bg-stone-50 rounded-lg border border-stone-200/80 flex justify-between items-center text-xs">
                  <span className="text-stone-500">OCR Extracted:</span>
                  <span className="font-mono font-bold text-stone-900">{formatMoney(doc.extractedTotal)}</span>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1">
                {doc.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-stone-400 font-mono">AES-256 Vault</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-stone-400 hover:text-red-700 rounded-md cursor-pointer"
                  title="Delete document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">Upload to Document Vault</h2>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Warehouse_Lease_2026.pdf"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                >
                  <option value="receipt">Receipt (Scanned)</option>
                  <option value="bill">Supplier Bill</option>
                  <option value="invoice">Sales Invoice</option>
                  <option value="contract">Legal Contract</option>
                  <option value="tax_document">URA Tax Document</option>
                  <option value="bank_statement">Bank Statement</option>
                </select>
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. Fuel, Fleet, Deductible"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Archive Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
