import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Layers,
  X
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, addProduct, formatMoney } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'product' | 'service'>('product');
  const [unitPrice, setUnitPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [reorderPoint, setReorderPoint] = useState('10');
  const [unit, setUnit] = useState('units');

  const filteredProducts = products.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      sku: sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      name,
      description: desc,
      type,
      unitPrice: parseFloat(unitPrice) || 0,
      costPrice: parseFloat(costPrice) || 0,
      taxRate: 18,
      inventoryQuantity: parseInt(stock) || 0,
      reorderPoint: parseInt(reorderPoint) || 0,
      unit,
      currency: 'UGX',
    });
    setIsModalOpen(false);
    setName('');
    setDesc('');
    setUnitPrice('');
    setCostPrice('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Products & Services Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Inventory stock levels, unit margins, and reorder warnings
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product / Service</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search SKU or product name..."
            className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3">SKU</th>
                <th className="p-3">Item Name & Description</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-right">Cost Price</th>
                <th className="p-3 text-right">Unit Margin</th>
                <th className="p-3 text-center">Stock Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map(prod => {
                const margin = prod.unitPrice - prod.costPrice;
                const marginPct = prod.unitPrice > 0 ? (margin / prod.unitPrice) * 100 : 0;
                const isLowStock = prod.type === 'product' && prod.inventoryQuantity <= prod.reorderPoint;

                return (
                  <tr key={prod.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-700">{prod.sku}</td>
                    <td className="p-3 max-w-[240px]">
                      <p className="font-semibold text-stone-900">{prod.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{prod.description}</p>
                    </td>
                    <td className="p-3 capitalize">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                        {prod.type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-stone-900">
                      {formatMoney(prod.unitPrice)}
                    </td>
                    <td className="p-3 text-right font-mono text-stone-600">
                      {formatMoney(prod.costPrice)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-800">
                      +{marginPct.toFixed(1)}%
                    </td>
                    <td className="p-3 text-center">
                      {prod.type === 'service' ? (
                        <span className="text-stone-400">Unlimited (Service)</span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <AlertTriangle className="w-3 h-3" /> {prod.inventoryQuantity} {prod.unit} (Low)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                          {prod.inventoryQuantity} {prod.unit}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">Add Product or Service</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="PROD-001"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Item Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="product">Physical Product</option>
                    <option value="service">Service / Rental</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Arabica Bugisu AA"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Specifications, origin, grade"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Unit Selling Price</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={e => setUnitPrice(e.target.value)}
                    placeholder="480000"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Cost Price</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={e => setCostPrice(e.target.value)}
                    placeholder="350000"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
              </div>
              {type === 'product' && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Stock Qty</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={e => setStock(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Reorder Point</label>
                    <input
                      type="number"
                      value={reorderPoint}
                      onChange={e => setReorderPoint(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Unit Label</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      placeholder="bags, kg, pcs"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
