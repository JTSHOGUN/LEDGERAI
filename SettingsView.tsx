import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamMember, CryptoChain, CountryCode, CurrencyCode } from '../../types';
import {
  Building2,
  Globe,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Users,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Zap,
  Landmark,
  Lock,
  Sliders,
  ShieldAlert,
  Eye,
  EyeOff,
  Coins,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SecurityService } from '../../services/securityService';

export const SettingsView: React.FC = () => {
  const {
    currentOrg,
    organizations,
    switchOrganization,
    addBusinessOrganization,
    updateOrganization,
    verifyCustomDomain,
    updateAirtelGateway,
    updateMpesaGateway,
    updateMtnMomoGateway,
    openBankingConfig,
    updateOpenBankingConfig,
    testGatewayConnection,
    teamMembers,
    inviteTeamMember,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'openbanking' | 'mtnmomo' | 'airtel' | 'mpesa' | 'crypto' | 'multibusiness' | 'domain' | 'profile' | 'efris' | 'team'
  >('openbanking');

  // Business Profile Form State
  const [businessName, setBusinessName] = useState(currentOrg.name);
  const [legalName, setLegalName] = useState(currentOrg.legalName);
  const [tin, setTin] = useState(currentOrg.tin);
  const [address, setAddress] = useState(currentOrg.address);
  const [phone, setPhone] = useState(currentOrg.phone);
  const [email, setEmail] = useState(currentOrg.email);
  const [efrisRegistered, setEfrisRegistered] = useState(currentOrg.efrisRegistered);

  // Custom Domain State
  const [domainInput, setDomainInput] = useState(currentOrg.customDomain?.domain || 'books.kampalafresh.ug');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Open Banking State
  const [openBankingProvider, setOpenBankingProvider] = useState<'mono_africa' | 'stitch_money' | 'okra' | 'direct_bank_api'>(openBankingConfig.provider);
  const [monoAppId, setMonoAppId] = useState(openBankingConfig.monoAppId || 'app_live_ug_88921a8b');
  const [monoSecret, setMonoSecret] = useState(openBankingConfig.monoSecretKey || '••••••••••••••••••••••••••••••••');
  const [stitchClientId, setStitchClientId] = useState(openBankingConfig.stitchClientId || 'stitch_client_9941a8');
  const [stitchSecret, setStitchSecret] = useState(openBankingConfig.stitchClientSecret || '••••••••••••••••••••••••••••••••');
  const [syncFreq, setSyncFreq] = useState<'realtime' | 'every_4_hours' | 'daily' | 'manual'>(openBankingConfig.autoSyncFrequency);
  const [isTestingBank, setIsTestingBank] = useState(false);

  // MTN MoMo State
  const mtn = currentOrg.mtnMomo || {
    enabled: true,
    environment: 'production',
    apiUserId: '88a192b0-1c44-481a-8892-1a8b01c4481a',
    apiKey: '••••••••••••••••••••••••••••••••',
    primarySubscriptionKey: '••••••••••••••••••••••••••••••••',
    merchantNumber: 'Till #654210',
    country: currentOrg.country,
    currency: currentOrg.currency,
    webhookUrl: `https://${currentOrg.customDomain?.domain || 'app.ledgerai.africa'}/api/v1/webhooks/mtn-momo`,
    status: 'connected',
    lastPing: '2026-09-08T07:30:00Z',
    autoReconcile: true,
    collectionMode: 'request_to_pay',
  };
  const [mtnApiUserId, setMtnApiUserId] = useState(mtn.apiUserId);
  const [mtnApiKey, setMtnApiKey] = useState(mtn.apiKey);
  const [mtnSubKey, setMtnSubKey] = useState(mtn.primarySubscriptionKey);
  const [mtnMerchantNumber, setMtnMerchantNumber] = useState(mtn.merchantNumber);
  const [mtnEnv, setMtnEnv] = useState<'sandbox' | 'production'>(mtn.environment);
  const [mtnAutoReconcile, setMtnAutoReconcile] = useState(mtn.autoReconcile);
  const [mtnMode, setMtnMode] = useState<'request_to_pay' | 'b2b_payout' | 'open_api'>(mtn.collectionMode);
  const [isTestingMtn, setIsTestingMtn] = useState(false);

  // Airtel MoneyPay State
  const airtel = currentOrg.airtelMoneyPay || {
    enabled: true,
    environment: 'production',
    merchantId: 'AIRTEL-UG-887211',
    clientId: 'artl_live_99a8182b01c4481a',
    clientSecret: '••••••••••••••••••••••••••••••••',
    country: 'UG',
    currency: 'UGX',
    webhookUrl: 'https://books.kampalafresh.ug/api/v1/webhooks/airtel-moneypay',
    status: 'connected',
    lastPing: '2026-09-07T08:12:00Z',
    autoReconcile: true,
  };
  const [airtelMerchantId, setAirtelMerchantId] = useState(airtel.merchantId);
  const [airtelClientId, setAirtelClientId] = useState(airtel.clientId);
  const [airtelSecret, setAirtelSecret] = useState(airtel.clientSecret);
  const [airtelEnv, setAirtelEnv] = useState<'sandbox' | 'production'>(airtel.environment);
  const [airtelAutoReconcile, setAirtelAutoReconcile] = useState(airtel.autoReconcile);
  const [isTestingAirtel, setIsTestingAirtel] = useState(false);

  // M-Pesa Daraja State
  const mpesa = currentOrg.mpesaDaraja || {
    enabled: true,
    environment: 'production',
    businessShortCode: '904210',
    accountType: 'till_number',
    consumerKey: 'daraja_prod_088192a9b1c',
    consumerSecret: '••••••••••••••••••••••••••••••••',
    passkey: '••••••••••••••••••••••••••••••••••••••••',
    webhookCallbackUrl: 'https://books.kampalafresh.ug/api/v1/webhooks/mpesa-daraja',
    status: 'connected',
    lastPing: '2026-09-07T08:14:00Z',
    autoReconcile: true,
  };
  const [mpesaShortCode, setMpesaShortCode] = useState(mpesa.businessShortCode);
  const [mpesaAccountType, setMpesaAccountType] = useState<'paybill' | 'till_number'>(mpesa.accountType);
  const [mpesaKey, setMpesaKey] = useState(mpesa.consumerKey);
  const [mpesaSecret, setMpesaSecret] = useState(mpesa.consumerSecret);
  const [mpesaPasskey, setMpesaPasskey] = useState(mpesa.passkey);
  const [mpesaEnv, setMpesaEnv] = useState<'sandbox' | 'production'>(mpesa.environment);
  const [mpesaAutoReconcile, setMpesaAutoReconcile] = useState(mpesa.autoReconcile);
  const [isTestingMpesa, setIsTestingMpesa] = useState(false);

  // Crypto RPC Gateway State
  const [solanaRpcUrl, setSolanaRpcUrl] = useState('https://api.mainnet-beta.solana.com');
  const [evmRpcUrl, setEvmRpcUrl] = useState('https://eth.llamarpc.com');
  const [binancePayApiKey, setBinancePayApiKey] = useState('binance_pay_prod_889104');
  const [binanceSecret, setBinanceSecret] = useState('••••••••••••••••••••••••••••••••');
  const [isTestingCryptoRpc, setIsTestingCryptoRpc] = useState(false);

  // Multi-Business Registration State
  const [newBizName, setNewBizName] = useState('');
  const [newBizLegal, setNewBizLegal] = useState('');
  const [newBizCountry, setNewBizCountry] = useState<CountryCode>('UG');
  const [newBizCurrency, setNewBizCurrency] = useState<CurrencyCode>('UGX');
  const [newBizTin, setNewBizTin] = useState('');
  const [newBizIndustry, setNewBizIndustry] = useState('Agribusiness & Export');
  const [isRegisteringBiz, setIsRegisteringBiz] = useState(false);

  // Team Invite State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Accountant');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization({
      name: businessName,
      legalName,
      tin,
      address,
      phone,
      email,
      efrisRegistered,
    });
  };

  const handleSaveOpenBanking = (e: React.FormEvent) => {
    e.preventDefault();
    updateOpenBankingConfig({
      provider: openBankingProvider,
      monoAppId,
      monoSecretKey: monoSecret,
      stitchClientId,
      stitchClientSecret: stitchSecret,
      autoSyncFrequency: syncFreq,
      lastSyncTimestamp: new Date().toISOString(),
      status: 'connected',
    });
  };

  const handleTestOpenBanking = async () => {
    setIsTestingBank(true);
    await testGatewayConnection('open_banking');
    setIsTestingBank(false);
  };

  const handleSaveMtnMomo = (e: React.FormEvent) => {
    e.preventDefault();
    updateMtnMomoGateway({
      apiUserId: mtnApiUserId,
      apiKey: mtnApiKey,
      primarySubscriptionKey: mtnSubKey,
      merchantNumber: mtnMerchantNumber,
      environment: mtnEnv,
      autoReconcile: mtnAutoReconcile,
      collectionMode: mtnMode,
      status: 'connected',
      lastPing: new Date().toISOString(),
    });
  };

  const handleTestMtnMomo = async () => {
    setIsTestingMtn(true);
    await testGatewayConnection('mtn_momo');
    setIsTestingMtn(false);
  };

  const handleSaveAirtel = (e: React.FormEvent) => {
    e.preventDefault();
    updateAirtelGateway({
      merchantId: airtelMerchantId,
      clientId: airtelClientId,
      clientSecret: airtelSecret,
      environment: airtelEnv,
      autoReconcile: airtelAutoReconcile,
      status: 'connected',
      lastPing: new Date().toISOString(),
    });
  };

  const handleTestAirtel = async () => {
    setIsTestingAirtel(true);
    await testGatewayConnection('airtel_moneypay');
    setIsTestingAirtel(false);
  };

  const handleSaveMpesa = (e: React.FormEvent) => {
    e.preventDefault();
    updateMpesaGateway({
      businessShortCode: mpesaShortCode,
      accountType: mpesaAccountType,
      consumerKey: mpesaKey,
      consumerSecret: mpesaSecret,
      passkey: mpesaPasskey,
      environment: mpesaEnv,
      autoReconcile: mpesaAutoReconcile,
      status: 'connected',
      lastPing: new Date().toISOString(),
    });
  };

  const handleTestMpesa = async () => {
    setIsTestingMpesa(true);
    await testGatewayConnection('mpesa');
    setIsTestingMpesa(false);
  };

  const handleTestCryptoRpc = async () => {
    setIsTestingCryptoRpc(true);
    await testGatewayConnection('crypto_rpc');
    setIsTestingCryptoRpc(false);
  };

  const handleSaveCryptoRpc = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Crypto RPC Nodes Saved',
      message: 'Solana, EVM, and Binance Pay webhook listeners active.',
    });
  };

  const handleCreateBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizTin) return;

    const success = addBusinessOrganization({
      name: newBizName,
      legalName: newBizLegal || `${newBizName} Limited`,
      country: newBizCountry,
      currency: newBizCurrency,
      tin: newBizTin,
      industry: newBizIndustry,
    });

    if (success) {
      setNewBizName('');
      setNewBizLegal('');
      setNewBizTin('');
      setIsRegisteringBiz(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!domainInput) return;
    setIsVerifyingDomain(true);
    await verifyCustomDomain(domainInput);
    setIsVerifyingDomain(false);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    inviteTeamMember(inviteName, inviteEmail, inviteRole);
    setInviteName('');
    setInviteEmail('');
  };

  const maxAllowedBusinesses = currentOrg.maxBusinessesAllowed || 3;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Organization, Gateways & Crypto Settings
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure MTN MoMo, Airtel MoneyPay, M-Pesa Daraja, Crypto RPC Nodes, African Open Banking, and Multi-Business Workspaces
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('openbanking')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'openbanking'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Landmark className="w-3.5 h-3.5 text-emerald-800" />
          <span>African Bank Feeds</span>
        </button>

        <button
          onClick={() => setActiveTab('mtnmomo')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'mtnmomo'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>MTN MoMo Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab('airtel')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'airtel'
              ? 'border-red-700 text-red-800 bg-red-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-red-700" />
          <span>Airtel MoneyPay</span>
        </button>

        <button
          onClick={() => setActiveTab('mpesa')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'mpesa'
              ? 'border-emerald-800 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-800" />
          <span>M-Pesa Daraja</span>
        </button>

        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'crypto'
              ? 'border-purple-800 text-purple-900 bg-purple-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-purple-800" />
          <span>Crypto & Web3 Nodes</span>
        </button>

        <button
          onClick={() => setActiveTab('multibusiness')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'multibusiness'
              ? 'border-stone-900 text-stone-900 bg-stone-100'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Multi-Business ({organizations.length}/{maxAllowedBusinesses})</span>
        </button>

        <button
          onClick={() => setActiveTab('domain')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'domain'
              ? 'border-stone-900 text-stone-900 bg-stone-100'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Custom Domain</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-stone-900 text-stone-900 bg-stone-100'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Business Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('efris')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'efris'
              ? 'border-stone-900 text-stone-900 bg-stone-100'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>URA EFRIS</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeTab === 'team'
              ? 'border-stone-900 text-stone-900 bg-stone-100'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team & Roles</span>
        </button>
      </div>

      {/* MTN MOMO GATEWAY TAB */}
      {activeTab === 'mtnmomo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-sm font-mono">
                  MTN
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">MTN Mobile Money Open API Gateway</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                      Live Connection Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Direct C2B RequestToPay Push, B2B Vendor Disbursements & Merchant Till Webhook Ingestion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestMtnMomo}
                  disabled={isTestingMtn}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingMtn ? 'animate-spin' : ''}`} />
                  <span>{isTestingMtn ? 'Testing MTN API...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveMtnMomo} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    MTN Merchant Number / Till ID
                  </label>
                  <input
                    type="text"
                    value={mtnMerchantNumber}
                    onChange={e => setMtnMerchantNumber(e.target.value)}
                    placeholder="Till #654210"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Environment Mode</label>
                  <select
                    value={mtnEnv}
                    onChange={e => setMtnEnv(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="production">Production (Live Subscriber Payments)</option>
                    <option value="sandbox">Sandbox (MTN Open API Sandbox)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">MTN API User GUID</label>
                  <input
                    type="text"
                    value={mtnApiUserId}
                    onChange={e => setMtnApiUserId(e.target.value)}
                    placeholder="88a192b0-1c44-481a-8892-1a8b01c4481a"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Subscription Key (Ocp-Apim-Subscription-Key)</label>
                  <input
                    type="password"
                    value={mtnSubKey}
                    onChange={e => setMtnSubKey(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">API Key (Generated Secret Token)</label>
                  <input
                    type="password"
                    value={mtnApiKey}
                    onChange={e => setMtnApiKey(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Collection Mode</label>
                  <select
                    value={mtnMode}
                    onChange={e => setMtnMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="request_to_pay">RequestToPay (Direct Phone STK Push)</option>
                    <option value="b2b_payout">B2B / B2C Float & Supplier Disbursements</option>
                    <option value="open_api">Open API Hybrid Gateway</option>
                  </select>
                </div>
              </div>

              {/* Webhook Endpoint */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 mt-4">
                <label className="block font-bold text-stone-800 mb-1">MTN MoMo Callback Receiver Endpoint</label>
                <p className="text-[11px] text-stone-500 mb-2">
                  Configure this webhook URL in the MTN Developer Portal for automated callback receipting.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mtn.webhookUrl}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-mono text-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(mtn.webhookUrl, 'mtn-hook')}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'mtn-hook' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Auto Reconcile Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="mtnAutoReconcile"
                  checked={mtnAutoReconcile}
                  onChange={e => setMtnAutoReconcile(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-800"
                />
                <label htmlFor="mtnAutoReconcile" className="text-xs font-semibold text-stone-800">
                  Automatically reconcile matching invoices when MTN MoMo webhook callback arrives
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save MTN MoMo Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRYPTO & WEB3 NODES TAB */}
      {activeTab === 'crypto' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-900 text-white font-bold flex items-center justify-center text-sm">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">Crypto RPC Nodes & Web3 Settlement APIs</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                      Solana & EVM Nodes Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Connect high-throughput RPC nodes for Solana (Phantom/Solflare), Binance Pay B2B, TRON, and Ethereum
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestCryptoRpc}
                  disabled={isTestingCryptoRpc}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingCryptoRpc ? 'animate-spin' : ''}`} />
                  <span>{isTestingCryptoRpc ? 'Pinging RPC Nodes...' : 'Test RPC Latency'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveCryptoRpc} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Solana Mainnet RPC Node Endpoint
                  </label>
                  <input
                    type="text"
                    value={solanaRpcUrl}
                    onChange={e => setSolanaRpcUrl(e.target.value)}
                    placeholder="https://api.mainnet-beta.solana.com"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Supports Helius, QuickNode, Triton, or public RPC</p>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Ethereum / EVM RPC Endpoint (L1 & L2)
                  </label>
                  <input
                    type="text"
                    value={evmRpcUrl}
                    onChange={e => setEvmRpcUrl(e.target.value)}
                    placeholder="https://eth.llamarpc.com"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Ethereum, Binance Smart Chain, Polygon, Arbitrum, Base</p>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Binance Pay Corporate Merchant API Key
                  </label>
                  <input
                    type="text"
                    value={binancePayApiKey}
                    onChange={e => setBinancePayApiKey(e.target.value)}
                    placeholder="binance_pay_prod_..."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Binance Pay Secret Key (Encrypted in Local Vault)
                  </label>
                  <input
                    type="password"
                    value={binanceSecret}
                    onChange={e => setBinanceSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Lock className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Ultra-Secure Non-Custodial Architecture</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  LedgerAI operates in non-custodial viewing mode. All on-chain queries are verified on explorer nodes. Funds remain 100% in your own cold/hot hardware or multi-sig wallets.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Save Web3 Node Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MULTI-BUSINESS MANAGEMENT & PACKAGE ALLOCATION TAB */}
      {activeTab === 'multibusiness' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-base font-bold text-stone-900">Multi-Business Workspaces & Entities</h2>
                <p className="text-xs text-stone-500">
                  Manage multiple independent legal entities under your {currentOrg.plan} Package
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200">
                  {organizations.length} of {maxAllowedBusinesses} Businesses Used
                </span>
                {organizations.length < maxAllowedBusinesses && (
                  <button
                    onClick={() => setIsRegisteringBiz(true)}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Business</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-stone-700">{currentOrg.plan} Tier Quota (Minimum 3 Guaranteed)</span>
                <span className="font-bold text-emerald-800">{organizations.length} / {maxAllowedBusinesses} Allocated</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-700 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (organizations.length / maxAllowedBusinesses) * 100)}%` }}
                />
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {organizations.map(org => (
                <div
                  key={org.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    org.id === currentOrg.id
                      ? 'bg-emerald-50/40 border-emerald-800 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center ${
                          org.id === currentOrg.id ? 'bg-emerald-800' : 'bg-stone-900'
                        }`}>
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{org.name}</h4>
                          <p className="text-[10px] text-stone-500 font-mono">{org.currency} · TIN: {org.tin}</p>
                        </div>
                      </div>

                      {org.id === currentOrg.id && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-600 mt-2">{org.industry}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-stone-400">{org.country} Registered</span>
                    {org.id !== currentOrg.id && (
                      <button
                        onClick={() => switchOrganization(org.id)}
                        className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Switch Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Business Form */}
            {isRegisteringBiz && (
              <form onSubmit={handleCreateBusinessSubmit} className="mt-6 p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h3 className="font-bold text-stone-900">Provision New Business Workspace</h3>
                  <button
                    type="button"
                    onClick={() => setIsRegisteringBiz(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={newBizName}
                      onChange={e => setNewBizName(e.target.value)}
                      placeholder="e.g. Nile Agro Exporters Ltd"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Registered Legal Entity Name</label>
                    <input
                      type="text"
                      value={newBizLegal}
                      onChange={e => setNewBizLegal(e.target.value)}
                      placeholder="e.g. Nile Agro Exporters Limited"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Tax Identification Number (TIN)</label>
                    <input
                      type="text"
                      value={newBizTin}
                      onChange={e => setNewBizTin(e.target.value)}
                      placeholder="1008892104"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Operating Country & Currency</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newBizCountry}
                        onChange={e => setNewBizCountry(e.target.value as CountryCode)}
                        className="w-full px-2 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      >
                        <option value="UG">Uganda (UG)</option>
                        <option value="KE">Kenya (KE)</option>
                        <option value="TZ">Tanzania (TZ)</option>
                        <option value="RW">Rwanda (RW)</option>
                        <option value="NG">Nigeria (NG)</option>
                        <option value="GH">Ghana (GH)</option>
                        <option value="ZA">South Africa (ZA)</option>
                        <option value="ZM">Zambia (ZM)</option>
                        <option value="ET">Ethiopia (ET)</option>
                      </select>

                      <select
                        value={newBizCurrency}
                        onChange={e => setNewBizCurrency(e.target.value as CurrencyCode)}
                        className="w-full px-2 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold"
                      >
                        <option value="UGX">UGX</option>
                        <option value="KES">KES</option>
                        <option value="TZS">TZS</option>
                        <option value="RWF">RWF</option>
                        <option value="NGN">NGN</option>
                        <option value="GHS">GHS</option>
                        <option value="ZAR">ZAR</option>
                        <option value="ZMW">ZMW</option>
                        <option value="ETB">ETB</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-700 mb-1">Industry Category</label>
                    <input
                      type="text"
                      value={newBizIndustry}
                      onChange={e => setNewBizIndustry(e.target.value)}
                      placeholder="e.g. Agribusiness, Logistics, Wholesale"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisteringBiz(false)}
                    className="px-3 py-1.5 text-stone-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                  >
                    Create & Initialize Workspace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AFRICAN OPEN BANKING TAB */}
      {activeTab === 'openbanking' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">African Open Banking & Direct Bank Feeds</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                      Live Feed Engine Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Automated transaction synchronization with commercial banks across Uganda, Kenya, Tanzania, Rwanda, Nigeria, Ghana & South Africa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestOpenBanking}
                  disabled={isTestingBank}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingBank ? 'animate-spin' : ''}`} />
                  <span>{isTestingBank ? 'Testing Bank Handshake...' : 'Test Bank API'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveOpenBanking} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Primary Open Banking Aggregator
                  </label>
                  <select
                    value={openBankingProvider}
                    onChange={e => setOpenBankingProvider(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="mono_africa">Mono Africa (East & West African Commercial Banks)</option>
                    <option value="stitch_money">Stitch Money (Kenya, South Africa, Nigeria)</option>
                    <option value="direct_bank_api">Direct Bank Host-to-Host (Stanbic, Absa, Equity)</option>
                    <option value="okra">Okra Open Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Auto-Sync Schedule</label>
                  <select
                    value={syncFreq}
                    onChange={e => setSyncFreq(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="every_4_hours">Every 4 Hours (Standard)</option>
                    <option value="realtime">Real-time Webhook Push (Instant)</option>
                    <option value="daily">Daily at 06:00 UTC</option>
                    <option value="manual">Manual On-Demand Sync Only</option>
                  </select>
                </div>

                {openBankingProvider === 'mono_africa' && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Mono App ID / Public Key</label>
                      <input
                        type="text"
                        value={monoAppId}
                        onChange={e => setMonoAppId(e.target.value)}
                        placeholder="app_live_ug_..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Mono Secret Key</label>
                      <input
                        type="password"
                        value={monoSecret}
                        onChange={e => setMonoSecret(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                        required
                      />
                    </div>
                  </>
                )}

                {openBankingProvider === 'stitch_money' && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Stitch Client ID</label>
                      <input
                        type="text"
                        value={stitchClientId}
                        onChange={e => setStitchClientId(e.target.value)}
                        placeholder="stitch_client_..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Stitch Client Secret</label>
                      <input
                        type="password"
                        value={stitchSecret}
                        onChange={e => setStitchSecret(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Security Banner */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <Lock className="w-3.5 h-3.5 text-stone-700" />
                  <span>Bank Statement Encryption & Consent Management</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  All automated statements are fetched using read-only API scopes. LedgerAI never accesses credentials or initiates unauthorized withdrawals.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                >
                  Save Banking Integration Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AIRTEL MONEYPAY TAB */}
      {activeTab === 'airtel' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm">
                  AIR
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">Airtel MoneyPay Africa Gateway</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                      Live Connection Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Accept Airtel Money payments across Uganda, Kenya, Tanzania, Rwanda, Nigeria & Zambia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestAirtel}
                  disabled={isTestingAirtel}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingAirtel ? 'animate-spin' : ''}`} />
                  <span>{isTestingAirtel ? 'Testing API...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAirtel} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Airtel Merchant ID / Till Number
                  </label>
                  <input
                    type="text"
                    value={airtelMerchantId}
                    onChange={e => setAirtelMerchantId(e.target.value)}
                    placeholder="AIRTEL-UG-887211"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Found on your Airtel Business Portal profile</p>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Environment Mode</label>
                  <select
                    value={airtelEnv}
                    onChange={e => setAirtelEnv(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="production">Production (Live Payments)</option>
                    <option value="sandbox">Sandbox (Testing / UAT)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Client ID (API Key)</label>
                  <input
                    type="text"
                    value={airtelClientId}
                    onChange={e => setAirtelClientId(e.target.value)}
                    placeholder="artl_live_99a8182b..."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Client Secret</label>
                  <input
                    type="password"
                    value={airtelSecret}
                    onChange={e => setAirtelSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Webhook Endpoint */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 mt-4">
                <label className="block font-bold text-stone-800 mb-1">Instant Webhook Callback URL</label>
                <p className="text-[11px] text-stone-500 mb-2">
                  Paste this URL into your Airtel Developer Portal under Webhooks to receive real-time push notifications.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={airtel.webhookUrl}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-mono text-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(airtel.webhookUrl, 'airtel-hook')}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'airtel-hook' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Auto Reconcile Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="airtelAutoReconcile"
                  checked={airtelAutoReconcile}
                  onChange={e => setAirtelAutoReconcile(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-800"
                />
                <label htmlFor="airtelAutoReconcile" className="text-xs font-semibold text-stone-800">
                  Automatically reconcile matching invoices when Airtel Money webhook fires
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Airtel MoneyPay Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* M-PESA DARAJA TAB */}
      {activeTab === 'mpesa' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">Safaricom & Vodacom M-Pesa Daraja 2.0</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                      Live Connection Active
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Direct STK Push (Lipa na M-Pesa Online) & C2B automatic ledger synchronization
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestMpesa}
                  disabled={isTestingMpesa}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingMpesa ? 'animate-spin' : ''}`} />
                  <span>{isTestingMpesa ? 'Testing API...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveMpesa} className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Business Short Code / Till Number
                  </label>
                  <input
                    type="text"
                    value={mpesaShortCode}
                    onChange={e => setMpesaShortCode(e.target.value)}
                    placeholder="904210"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Account Type</label>
                  <select
                    value={mpesaAccountType}
                    onChange={e => setMpesaAccountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="till_number">Buy Goods (Till Number)</option>
                    <option value="paybill">Paybill Account</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Consumer Key</label>
                  <input
                    type="text"
                    value={mpesaKey}
                    onChange={e => setMpesaKey(e.target.value)}
                    placeholder="daraja_prod_..."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Consumer Secret</label>
                  <input
                    type="password"
                    value={mpesaSecret}
                    onChange={e => setMpesaSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Lipa na M-Pesa Online Passkey</label>
                  <input
                    type="password"
                    value={mpesaPasskey}
                    onChange={e => setMpesaPasskey(e.target.value)}
                    placeholder="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs text-stone-900"
                    required
                  />
                </div>
              </div>

              {/* Webhook Endpoint */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 mt-4">
                <label className="block font-bold text-stone-800 mb-1">M-Pesa STK Callback URL</label>
                <p className="text-[11px] text-stone-500 mb-2">
                  Automated callback receiver for instant STK Push authorization receipts.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mpesa.webhookCallbackUrl}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-mono text-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(mpesa.webhookCallbackUrl, 'mpesa-hook')}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'mpesa-hook' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Auto Reconcile Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="mpesaAutoReconcile"
                  checked={mpesaAutoReconcile}
                  onChange={e => setMpesaAutoReconcile(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-800"
                />
                <label htmlFor="mpesaAutoReconcile" className="text-xs font-semibold text-stone-800">
                  Automatically reconcile invoices and update bank ledger on M-Pesa webhook receipt
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save M-Pesa Daraja Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DOMAIN TAB */}
      {activeTab === 'domain' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-base font-bold text-stone-900">Custom Domain & White-label Branding</h2>
                <p className="text-xs text-stone-500">
                  Host LedgerAI on your company domain (e.g. books.yourcompany.ug) with automated TLS/SSL.
                </p>
              </div>

              {currentOrg.customDomain?.verified && (
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  SSL & DNS Active
                </span>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Custom Domain</label>
                <div className="flex gap-2 max-w-lg">
                  <input
                    type="text"
                    value={domainInput}
                    onChange={e => setDomainInput(e.target.value)}
                    placeholder="books.mycompany.ug"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyDomain}
                    disabled={isVerifyingDomain}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingDomain ? 'animate-spin' : ''}`} />
                    <span>{isVerifyingDomain ? 'Verifying DNS...' : 'Verify DNS'}</span>
                  </button>
                </div>
              </div>

              {/* DNS Instructions Table */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Required DNS Records</h3>
                <div className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-100/70 text-stone-600 text-[11px] font-semibold">
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Name / Host</th>
                        <th className="p-2.5">Value / Target</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5 text-right">Copy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-stone-900">CNAME</td>
                        <td className="p-2.5 font-mono text-stone-800">books</td>
                        <td className="p-2.5 font-mono text-stone-600">cname.ledgerai.africa</td>
                        <td className="p-2.5 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                            <Check className="w-3 h-3" /> Configured
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => handleCopy('cname.ledgerai.africa', 'cname')}
                            className="p-1 hover:bg-stone-200 rounded text-stone-600 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-stone-900">TXT</td>
                        <td className="p-2.5 font-mono text-stone-800">@</td>
                        <td className="p-2.5 font-mono text-stone-600">
                          {currentOrg.customDomain?.txtVerificationCode || 'ledgerai-verify-ug-88910294'}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() =>
                              handleCopy(currentOrg.customDomain?.txtVerificationCode || '', 'txt')
                            }
                            className="p-1 hover:bg-stone-200 rounded text-stone-600 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUSINESS PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
          <h2 className="text-base font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
            Business Profile & Legal Entity
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Trading Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Registered Legal Name</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tax Identification Number (TIN)</label>
                <input
                  type="text"
                  value={tin}
                  onChange={e => setTin(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Operating Country</label>
                <input
                  type="text"
                  readOnly
                  value="Uganda (UGX)"
                  className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Finance Department Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* URA EFRIS TAB */}
      {activeTab === 'efris' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h2 className="text-base font-bold text-stone-900">URA EFRIS e-Invoicing Compliance Engine</h2>
              <p className="text-xs text-stone-500">
                Direct API integration with Uganda Revenue Authority Electronic Fiscal Receipting & Invoicing System
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              EFRIS Device Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <p className="font-semibold text-stone-700">EFRIS Device Number</p>
              <p className="font-mono text-sm font-bold text-stone-900 mt-1">UG-EFRIS-2026-8819</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <p className="font-semibold text-stone-700">AES Encryption Key Status</p>
              <p className="font-mono text-sm font-bold text-emerald-800 mt-1">256-bit CBC Active & Synced</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <p className="font-semibold text-stone-700">Default VAT Rate</p>
              <p className="font-mono text-sm font-bold text-stone-900 mt-1">18.00% Standard Rate</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
              <p className="font-semibold text-stone-700">Withholding Tax (WHT)</p>
              <p className="font-mono text-sm font-bold text-stone-900 mt-1">6.00% Resident Standard</p>
            </div>
          </div>
        </div>
      )}

      {/* TEAM & ROLES TAB */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <h2 className="text-base font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Team Members & Role Permissions
            </h2>

            {/* Invite Form */}
            <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
              <input
                type="text"
                placeholder="Full Name"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                required
              />
              <input
                type="email"
                placeholder="work@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                required
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as TeamMember['role'])}
                className="px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
              >
                <option value="Accountant">Certified Accountant (Full Ledger)</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Viewer">Auditor / Viewer (Read Only)</option>
                <option value="Admin">Administrator</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Invite Colleague</span>
              </button>
            </form>

            {/* Team Members List */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-[11px] font-semibold">
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {teamMembers.map(member => (
                    <tr key={member.id} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900">{member.name}</td>
                      <td className="p-3 font-mono text-stone-600">{member.email}</td>
                      <td className="p-3 capitalize font-medium text-stone-800">{member.role}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                            member.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-stone-500 font-mono text-[11px]">{member.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
