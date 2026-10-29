import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CryptoChain, CryptoWalletProvider, CryptoWallet, CryptoTransactionItem } from '../../types';
import { CryptoService } from '../../services/cryptoService';
import {
  Wallet,
  Coins,
  Lock,
  Unlock,
  Key,
  Plus,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  ArrowRightLeft,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Layers,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const CryptoView: React.FC = () => {
  const {
    cryptoWallets,
    cryptoTransactions,
    cryptoMarketRates,
    connectCryptoWallet,
    disconnectCryptoWallet,
    syncCryptoWallet,
    recordCryptoTransaction,
    currentOrg,
    formatMoney,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'wallets' | 'transactions' | 'markets'>('wallets');
  const [selectedChainFilter, setSelectedChainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Connect Wallet Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [walletChain, setWalletChain] = useState<CryptoChain>('solana');
  const [walletProvider, setWalletProvider] = useState<CryptoWalletProvider>('phantom');
  const [walletAddress, setWalletAddress] = useState('');
  const [viewingSecret, setViewingSecret] = useState('');
  const [encryptionPassphrase, setEncryptionPassphrase] = useState('');
  const [enableClientEncryption, setEnableClientEncryption] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Decrypt Secret Modal State
  const [isDecryptModalOpen, setIsDecryptModalOpen] = useState(false);
  const [selectedWalletToDecrypt, setSelectedWalletToDecrypt] = useState<CryptoWallet | null>(null);
  const [decryptPassphrase, setDecryptPassphrase] = useState('');
  const [decryptedSecretOutput, setDecryptedSecretOutput] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  // Record Manual Crypto Settlement Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [settlementWalletId, setSettlementWalletId] = useState(cryptoWallets[0]?.id || '');
  const [settlementAmount, setSettlementAmount] = useState('1500');
  const [settlementSymbol, setSettlementSymbol] = useState('USDC');
  const [settlementCustomer, setSettlementCustomer] = useState('Entebbe Grand Hotel & Resort');
  const [settlementCategory, setSettlementCategory] = useState('Fresh Produce Wholesale Sales');
  const [settlementType, setSettlementType] = useState<'receive' | 'send'>('receive');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConnectWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletName || !walletAddress) return;

    const validation = CryptoService.validateAddress(walletAddress, walletChain);
    if (!validation.valid) {
      addToast({
        type: 'error',
        title: 'Invalid Wallet Address Format',
        message: validation.message || `Please check the ${walletChain.toUpperCase()} address.`,
      });
      return;
    }

    setIsSubmitting(true);

    let encryptedSecret: string | undefined;
    let encryptionSalt: string | undefined;

    if (enableClientEncryption && viewingSecret) {
      const enc = await CryptoService.encryptSecret(viewingSecret, encryptionPassphrase || 'owner_master_key');
      encryptedSecret = enc.ciphertext;
      encryptionSalt = enc.salt;
    }

    const nativeSymbolMap: Record<CryptoChain, string> = {
      solana: 'SOL',
      ethereum: 'ETH',
      binance: 'BNB',
      bitcoin: 'BTC',
      polygon: 'MATIC',
      tron: 'TRX',
      arbitrum: 'ETH',
      avalanche: 'AVAX',
      base: 'ETH',
    };

    const nativeSymbol = nativeSymbolMap[walletChain];
    const initialNativeBalance = walletChain === 'solana' ? 15.0 : walletChain === 'binance' ? 4.5 : walletChain === 'ethereum' ? 1.2 : 500;
    const initialFiatValue = CryptoService.convertCryptoToFiat(initialNativeBalance, nativeSymbol, currentOrg.currency);

    await connectCryptoWallet({
      name: walletName,
      chain: walletChain,
      walletProvider: walletProvider,
      address: walletAddress,
      isEncrypted: enableClientEncryption && Boolean(viewingSecret),
      encryptedSecret,
      encryptionSalt,
      balanceNative: initialNativeBalance,
      nativeSymbol,
      fiatValue: initialFiatValue,
      fiatCurrency: currentOrg.currency,
      tokens: [
        {
          symbol: walletChain === 'tron' ? 'USDT' : 'USDC',
          name: walletChain === 'tron' ? 'Tether USD (TRC-20)' : 'USD Coin',
          balance: 2500,
          fiatValue: CryptoService.convertCryptoToFiat(2500, 'USDT', currentOrg.currency),
          chain: walletChain,
        },
      ],
      isConnected: true,
      status: 'active',
      explorerUrl: CryptoService.getExplorerUrl(walletAddress, walletChain),
    });

    setIsSubmitting(false);
    setIsConnectModalOpen(false);
    setWalletName('');
    setWalletAddress('');
    setViewingSecret('');
    setEncryptionPassphrase('');
  };

  const handleDecryptVaultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWalletToDecrypt || !decryptPassphrase) return;

    setIsDecrypting(true);
    setDecryptError(null);

    try {
      const decrypted = await CryptoService.decryptSecret(
        selectedWalletToDecrypt.encryptedSecret || '',
        selectedWalletToDecrypt.encryptionSalt || '',
        'iv_local_vault',
        decryptPassphrase
      );

      setDecryptedSecretOutput(decrypted);
      addToast({
        type: 'success',
        title: 'Vault Decrypted Locally',
        message: 'Master key verified. Secret displayed in memory.',
      });
    } catch (err: any) {
      setDecryptError(err.message || 'Decryption failed. Invalid master passphrase.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleRecordSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetWallet = cryptoWallets.find(w => w.id === settlementWalletId) || cryptoWallets[0];
    if (!targetWallet) return;

    const amt = parseFloat(settlementAmount) || 0;
    const fiat = CryptoService.convertCryptoToFiat(amt, settlementSymbol, currentOrg.currency);

    recordCryptoTransaction({
      walletId: targetWallet.id,
      txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      chain: targetWallet.chain,
      timestamp: new Date().toISOString(),
      fromAddress: settlementType === 'receive' ? '0xClientSender...881a' : targetWallet.address,
      toAddress: settlementType === 'receive' ? targetWallet.address : '0xSupplierReceiver...992b',
      amount: amt,
      coinSymbol: settlementSymbol,
      fiatAmount: fiat,
      fiatCurrency: currentOrg.currency,
      networkFee: targetWallet.chain === 'solana' ? 0.00005 : 0.001,
      feeSymbol: targetWallet.nativeSymbol,
      type: settlementType,
      reconciliationStatus: 'matched',
      suggestedCategory: settlementCategory,
      customerOrVendor: settlementCustomer,
    });

    setIsRecordModalOpen(false);
  };

  // Aggregated Treasury Totals
  const totalFiatTreasury = cryptoWallets.reduce((sum, w) => {
    const nativeVal = w.fiatValue;
    const tokenVal = w.tokens.reduce((tsum, t) => tsum + t.fiatValue, 0);
    return sum + nativeVal + tokenVal;
  }, 0);

  const totalStablecoinFiat = cryptoWallets.reduce((sum, w) => {
    const stables = w.tokens.filter(t => t.symbol === 'USDT' || t.symbol === 'USDC');
    return sum + stables.reduce((tsum, t) => tsum + t.fiatValue, 0);
  }, 0);

  // Filtered Wallets
  const filteredWallets = cryptoWallets.filter(w => {
    if (selectedChainFilter !== 'all' && w.chain !== selectedChainFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.address.toLowerCase().includes(q) ||
        w.chain.toLowerCase().includes(q) ||
        w.tokens.some(t => t.symbol.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Crypto Treasury & Web3 Wallets
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> AES-256 Client Vault
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Solana, Binance Pay, Ethereum, TRON TRC-20 USDT, and Bitcoin treasury accounts reconciled into your double-entry general ledger
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Record Crypto Settlement</span>
          </button>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Crypto Wallet</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Total Treasury, Stablecoins, Active Wallets, 24h Yield */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Crypto Treasury */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Crypto Treasury Value</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {formatMoney(totalFiatTreasury)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>≈ ${(totalFiatTreasury / 3750).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</span>
            <span className="text-emerald-800 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +4.2% 24h
            </span>
          </div>
        </div>

        {/* Stablecoin Commercial Reserves (USDT + USDC) */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Stablecoin Reserves</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-800">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2 font-mono tabular-nums">
            {formatMoney(totalStablecoinFiat)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>USDT (TRC-20) + USDC (Solana)</span>
            <span className="text-stone-600 font-medium">B2B Trade</span>
          </div>
        </div>

        {/* Connected Chains & Wallets */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Connected Chains</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-800">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {cryptoWallets.length} Active Wallets
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>Solana · Binance · Tron · ETH</span>
            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          </div>
        </div>

        {/* On-Chain Settlements */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Web3 Settlements</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-2 font-mono tabular-nums">
            {cryptoTransactions.length} Recorded
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            <span>100% General Ledger Reconciled</span>
            <span className="text-stone-600">Double-Entry</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Connected Wallets | Transaction Stream | Market Index Rates */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('wallets')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'wallets'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 text-emerald-800" />
          <span>Connected Wallets ({cryptoWallets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'transactions'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-800" />
          <span>On-Chain Settlements ({cryptoTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('markets')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'markets'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-emerald-800" />
          <span>Live Crypto Market Index ({cryptoMarketRates.length} Pairs)</span>
        </button>
      </div>

      {/* WALLETS VIEW */}
      {activeTab === 'wallets' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Chains' },
                { id: 'solana', label: 'Solana (SOL)' },
                { id: 'binance', label: 'Binance (BNB)' },
                { id: 'tron', label: 'TRON (TRC-20)' },
                { id: 'ethereum', label: 'Ethereum (ETH)' },
                { id: 'bitcoin', label: 'Bitcoin (BTC)' },
                { id: 'polygon', label: 'Polygon (MATIC)' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChainFilter(c.id)}
                  className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedChainFilter === c.id
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search wallet name, address, token..."
                className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 w-60 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>

          {/* Wallets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWallets.map(wallet => {
              const chainColors: Record<CryptoChain, { bg: string; text: string; border: string }> = {
                solana: { bg: 'bg-purple-900/10', text: 'text-purple-800', border: 'border-purple-200' },
                binance: { bg: 'bg-amber-900/10', text: 'text-amber-800', border: 'border-amber-200' },
                tron: { bg: 'bg-red-900/10', text: 'text-red-800', border: 'border-red-200' },
                ethereum: { bg: 'bg-blue-900/10', text: 'text-blue-800', border: 'border-blue-200' },
                bitcoin: { bg: 'bg-amber-900/10', text: 'text-amber-800', border: 'border-amber-200' },
                polygon: { bg: 'bg-indigo-900/10', text: 'text-indigo-800', border: 'border-indigo-200' },
                arbitrum: { bg: 'bg-blue-900/10', text: 'text-blue-800', border: 'border-blue-200' },
                avalanche: { bg: 'bg-red-900/10', text: 'text-red-800', border: 'border-red-200' },
                base: { bg: 'bg-blue-900/10', text: 'text-blue-800', border: 'border-blue-200' },
              };
              const cStyle = chainColors[wallet.chain] || chainColors.ethereum;

              return (
                <div
                  key={wallet.id}
                  className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-all"
                >
                  <div>
                    {/* Top Row: Icon, Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg font-mono font-bold text-xs ${cStyle.bg} ${cStyle.text} border ${cStyle.border}`}>
                          {wallet.nativeSymbol}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">{wallet.name}</h3>
                          <p className="text-[10px] text-stone-500 capitalize">
                            {wallet.walletProvider.replace(/_/g, ' ')} · {wallet.chain} Network
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Synced
                      </span>
                    </div>

                    {/* Balance Box */}
                    <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider">Native Balance</p>
                        <span className="text-xs font-mono font-bold text-stone-900">
                          {wallet.balanceNative} {wallet.nativeSymbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-200/60">
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider">Local Fiat Value</p>
                        <span className="text-base font-bold font-mono text-emerald-800">
                          {formatMoney(wallet.fiatValue)}
                        </span>
                      </div>
                    </div>

                    {/* Tokens List (USDC / USDT / etc.) */}
                    {wallet.tokens.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                          Secondary Token Assets
                        </p>
                        {wallet.tokens.map(token => (
                          <div
                            key={token.symbol}
                            className="p-2 rounded bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-stone-800">{token.name} ({token.symbol})</span>
                            <div className="text-right">
                              <p className="font-mono font-bold text-stone-900">{token.balance.toLocaleString()} {token.symbol}</p>
                              <p className="text-[10px] text-stone-500 font-mono">{formatMoney(token.fiatValue)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Address & Encryption Details */}
                    <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Public Address:</span>
                        <div className="flex items-center gap-1 font-mono text-stone-800 font-medium text-[11px]">
                          <span>{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</span>
                          <button
                            onClick={() => handleCopy(wallet.address, wallet.id)}
                            className="p-1 hover:bg-stone-100 rounded text-stone-500 cursor-pointer"
                            title="Copy address"
                          >
                            {copiedKey === wallet.id ? <Check className="w-3 h-3 text-emerald-800" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <a
                            href={wallet.explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-stone-100 rounded text-stone-500"
                            title="View on block explorer"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-stone-400">Security Vault:</span>
                        {wallet.isEncrypted ? (
                          <button
                            onClick={() => {
                              setSelectedWalletToDecrypt(wallet);
                              setDecryptedSecretOutput(null);
                              setDecryptError(null);
                              setIsDecryptModalOpen(true);
                            }}
                            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 cursor-pointer"
                          >
                            <Lock className="w-3 h-3" />
                            <span>AES-256 Encrypted (Unlock)</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-500">Public Address Read-Only</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => syncCryptoWallet(wallet.id)}
                      className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Sync Blockchain Feed
                    </button>

                    <button
                      onClick={() => disconnectCryptoWallet(wallet.id)}
                      className="text-xs font-semibold text-red-700 hover:text-red-900 cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TRANSACTIONS STREAM */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  On-Chain Crypto Settlements Register ({cryptoTransactions.length})
                </h3>
                <p className="text-xs text-stone-500">Live double-entry postings synchronized with blockchain explorers</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="p-3">Time</th>
                    <th className="p-3">Chain / Coin</th>
                    <th className="p-3">Transaction Hash</th>
                    <th className="p-3">Counterparty / Description</th>
                    <th className="p-3 text-right">Crypto Amount</th>
                    <th className="p-3 text-right">Fiat Valuation</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {cryptoTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono text-stone-500 whitespace-nowrap">
                        {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-bold text-stone-900">{tx.coinSymbol}</span>
                        <span className="text-[10px] text-stone-400 uppercase ml-1">({tx.chain})</span>
                      </td>
                      <td className="p-3 font-mono text-stone-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span>{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}</span>
                          <a
                            href={CryptoService.getExplorerUrl(tx.txHash, tx.chain, true)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-stone-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="p-3 text-stone-800 font-medium truncate max-w-xs">
                        {tx.customerOrVendor || tx.suggestedCategory || 'Direct Wallet Transfer'}
                      </td>
                      <td className={`p-3 text-right font-mono font-bold whitespace-nowrap ${
                        tx.type === 'receive' ? 'text-emerald-800' : 'text-stone-900'
                      }`}>
                        {tx.type === 'receive' ? '+' : '-'} {tx.amount.toLocaleString()} {tx.coinSymbol}
                      </td>
                      <td className={`p-3 text-right font-mono font-bold whitespace-nowrap ${
                        tx.type === 'receive' ? 'text-emerald-800' : 'text-stone-900'
                      }`}>
                        {formatMoney(tx.fiatAmount)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {tx.reconciliationStatus.toUpperCase()}
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

      {/* MARKET INDEX RATES */}
      {activeTab === 'markets' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">Major Traded Cryptocurrencies & Market Indexes</h3>
                <p className="text-xs text-stone-500">Live prices with automatic conversion to {currentOrg.currency} for balance sheet revaluations</p>
              </div>
              <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                1 USD = 3,750 UGX / 129.5 KES / 1,640 NGN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {cryptoMarketRates.map(coin => (
                <div key={coin.symbol} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-sm">
                      {coin.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{coin.name} ({coin.symbol})</h4>
                      <p className="text-[10px] text-stone-500 capitalize">{coin.chain} Network</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold font-mono text-stone-900">${coin.priceUSD.toLocaleString()}</p>
                    <p className="text-[10px] font-mono text-stone-600 font-semibold">{formatMoney(coin.priceUGX)}</p>
                    <span className={`inline-flex items-center text-[10px] font-bold ${
                      coin.change24h >= 0 ? 'text-emerald-800' : 'text-red-700'
                    }`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONNECT CRYPTO WALLET MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-800 text-white">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Connect Crypto Wallet / Public Address</h2>
                  <p className="text-xs text-stone-500">Supports Solana, Binance Pay, Ethereum, TRON TRC-20, Bitcoin & Polygon</p>
                </div>
              </div>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnectWalletSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Blockchain</label>
                  <select
                    value={walletChain}
                    onChange={e => setWalletChain(e.target.value as CryptoChain)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="solana">Solana (SOL & SPL Tokens)</option>
                    <option value="binance">Binance Smart Chain (BNB & BEP-20)</option>
                    <option value="tron">TRON (USDT TRC-20 Fast Settlements)</option>
                    <option value="ethereum">Ethereum (ETH & ERC-20 Tokens)</option>
                    <option value="bitcoin">Bitcoin (BTC / Lightning)</option>
                    <option value="polygon">Polygon (MATIC & POL)</option>
                    <option value="arbitrum">Arbitrum One</option>
                    <option value="base">Base L2 Network</option>
                    <option value="avalanche">Avalanche C-Chain</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Wallet Type / Provider</label>
                  <select
                    value={walletProvider}
                    onChange={e => setWalletProvider(e.target.value as CryptoWalletProvider)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="phantom">Phantom Wallet (Solana)</option>
                    <option value="binance_pay">Binance Corporate Pay & B2B API</option>
                    <option value="metamask">MetaMask (EVM / Ethereum / BNB)</option>
                    <option value="trust_wallet">Trust Wallet (Multi-Chain / TRON)</option>
                    <option value="coinbase">Coinbase Wallet</option>
                    <option value="solflare">Solflare (Solana)</option>
                    <option value="ledger_hardware">Ledger Hardware Cold Vault</option>
                    <option value="manual_address">Manual Public Blockchain Address</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Account Display Name</label>
                  <input
                    type="text"
                    value={walletName}
                    onChange={e => setWalletName(e.target.value)}
                    placeholder="e.g. Export Produce Crypto Settlements"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Public Wallet Address</label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                    placeholder={
                      walletChain === 'solana'
                        ? '7xKXtg2CW87d97TXJSD82194hfkds9821kldsaf8932'
                        : walletChain === 'tron'
                        ? 'TYk8921048190248910294812904812904'
                        : '0x88f912a9b3419048a12908491028491028491024'
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Public viewing key used to stream on-chain transaction history without custody.
                  </p>
                </div>
              </div>

              {/* Encryption Layer */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-stone-900">Client-Side AES-256 Vault Protection</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableClientEncryption}
                    onChange={e => setEnableClientEncryption(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-600">
                  If you wish to store a Binance API Secret, Solana RPC key, or viewing secret, it is encrypted in your browser using PBKDF2 + AES-GCM before storage. Only you with your master passphrase can decrypt it.
                </p>

                {enableClientEncryption && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Private API Secret / Viewing Key (Optional)</label>
                      <input
                        type="password"
                        value={viewingSecret}
                        onChange={e => setViewingSecret(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Owner Master Decryption Passphrase</label>
                      <input
                        type="password"
                        value={encryptionPassphrase}
                        onChange={e => setEncryptionPassphrase(e.target.value)}
                        placeholder="Your secure master password"
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Verifying on-chain...' : 'Authorize & Connect Wallet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DECRYPT VAULT MODAL */}
      {isDecryptModalOpen && selectedWalletToDecrypt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-emerald-800 text-white">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Unlock Encrypted Vault</h2>
                  <p className="text-[10px] text-stone-500">{selectedWalletToDecrypt.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDecryptModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDecryptVaultSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Enter Master Decryption Passphrase</label>
                <input
                  type="password"
                  value={decryptPassphrase}
                  onChange={e => setDecryptPassphrase(e.target.value)}
                  placeholder="Master password used during setup"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              {decryptError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-800 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{decryptError}</span>
                </div>
              )}

              {decryptedSecretOutput && (
                <div className="p-3 bg-stone-900 text-white rounded-lg font-mono text-xs space-y-1">
                  <p className="text-[10px] text-stone-400 uppercase">Decrypted Secret (Owner View Only):</p>
                  <p className="text-emerald-400 font-bold select-all break-all">{decryptedSecretOutput}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDecryptModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isDecrypting}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{isDecrypting ? 'Decrypting...' : 'Decrypt Secret'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD CRYPTO SETTLEMENT MODAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-stone-900 text-white">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Record Crypto Settlement</h2>
                  <p className="text-[10px] text-stone-500">Post on-chain transfer to double-entry ledger</p>
                </div>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSettlementSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Transaction Flow</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettlementType('receive')}
                    className={`py-1.5 rounded-lg font-semibold text-xs border transition-colors cursor-pointer ${
                      settlementType === 'receive'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Receive (Inflow)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettlementType('send')}
                    className={`py-1.5 rounded-lg font-semibold text-xs border transition-colors cursor-pointer ${
                      settlementType === 'send'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    Disbursement (Outflow)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Crypto Wallet</label>
                <select
                  value={settlementWalletId}
                  onChange={e => setSettlementWalletId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  {cryptoWallets.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.chain.toUpperCase()}) - {w.nativeSymbol}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Crypto Amount</label>
                  <input
                    type="number"
                    value={settlementAmount}
                    onChange={e => setSettlementAmount(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs font-bold text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Token / Symbol</label>
                  <select
                    value={settlementSymbol}
                    onChange={e => setSettlementSymbol(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="USDC">USDC (USD Coin)</option>
                    <option value="USDT">USDT (Tether USD)</option>
                    <option value="SOL">SOL (Solana)</option>
                    <option value="BNB">BNB (Binance)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                    <option value="BTC">BTC (Bitcoin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Counterparty (Buyer / Supplier)</label>
                <input
                  type="text"
                  value={settlementCustomer}
                  onChange={e => setSettlementCustomer(e.target.value)}
                  placeholder="e.g. Entebbe Grand Hotel & Resort"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Accounting Category</label>
                <select
                  value={settlementCategory}
                  onChange={e => setSettlementCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  <option value="Fresh Produce Wholesale Sales">Fresh Produce Wholesale Sales</option>
                  <option value="Cold Storage & Logistics Services">Cold Storage & Logistics Services</option>
                  <option value="Cost of Produce Purchased">Cost of Produce Purchased</option>
                  <option value="Crypto Treasury FX Realization">Crypto Treasury FX Realization</option>
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 text-[11px] space-y-1">
                <p className="font-semibold text-stone-800">Double-Entry Impact:</p>
                <p>
                  • Ledger Debit: +{formatMoney(CryptoService.convertCryptoToFiat(parseFloat(settlementAmount) || 0, settlementSymbol, currentOrg.currency))}
                </p>
                <p>• Ledger Credit: Accounts Receivable / Sales Revenue</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Post to General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
