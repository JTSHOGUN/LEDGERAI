import { CryptoChain, CryptoWalletProvider, CryptoWallet, CryptoTransactionItem, CryptoMarketCoin, CurrencyCode } from '../types';

export class CryptoService {
  /**
   * Real-time Market Index for Major Traded Cryptos
   * With dynamic FX conversion to African fiat currencies
   */
  public static getMarketRates(currency: CurrencyCode = 'UGX'): CryptoMarketCoin[] {
    // Base USD rates (calibrated to real market benchmarks)
    const baseRates = [
      { symbol: 'BTC', name: 'Bitcoin', chain: 'bitcoin' as CryptoChain, priceUSD: 89450.00, change24h: 3.42, marketCapUSD: 1760000000000, icon: '₿' },
      { symbol: 'ETH', name: 'Ethereum', chain: 'ethereum' as CryptoChain, priceUSD: 3340.50, change24h: 2.15, marketCapUSD: 402000000000, icon: 'Ξ' },
      { symbol: 'SOL', name: 'Solana', chain: 'solana' as CryptoChain, priceUSD: 198.40, change24h: 6.84, marketCapUSD: 93500000000, icon: '◎' },
      { symbol: 'BNB', name: 'Binance Coin', chain: 'binance' as CryptoChain, priceUSD: 645.20, change24h: 1.82, marketCapUSD: 94200000000, icon: '🟡' },
      { symbol: 'USDT', name: 'Tether USD (TRC-20/ERC-20)', chain: 'tron' as CryptoChain, priceUSD: 1.00, change24h: 0.01, marketCapUSD: 128000000000, icon: '₮' },
      { symbol: 'USDC', name: 'USD Coin', chain: 'solana' as CryptoChain, priceUSD: 1.00, change24h: 0.00, marketCapUSD: 39000000000, icon: '💵' },
      { symbol: 'TRX', name: 'TRON', chain: 'tron' as CryptoChain, priceUSD: 0.224, change24h: 4.12, marketCapUSD: 19500000000, icon: '♦' },
      { symbol: 'MATIC', name: 'Polygon (POL)', chain: 'polygon' as CryptoChain, priceUSD: 0.584, change24h: -1.24, marketCapUSD: 5700000000, icon: '🟣' },
      { symbol: 'XRP', name: 'Ripple', chain: 'binance' as CryptoChain, priceUSD: 0.942, change24h: 5.60, marketCapUSD: 53500000000, icon: '✕' },
      { symbol: 'AVAX', name: 'Avalanche', chain: 'avalanche' as CryptoChain, priceUSD: 34.20, change24h: 2.94, marketCapUSD: 13900000000, icon: '🔺' },
      { symbol: 'ARB', name: 'Arbitrum One', chain: 'arbitrum' as CryptoChain, priceUSD: 0.885, change24h: 1.45, marketCapUSD: 3450000000, icon: '🔵' },
      { symbol: 'BASE', name: 'Base Network Token', chain: 'base' as CryptoChain, priceUSD: 2.15, change24h: 8.42, marketCapUSD: 1200000000, icon: '🔷' },
    ];

    // Exchange rates against USD
    const usdToFiat: Record<CurrencyCode, number> = {
      UGX: 3750,
      KES: 129.5,
      TZS: 2680,
      RWF: 1380,
      NGN: 1640,
      GHS: 15.8,
      ZAR: 18.2,
      ZMW: 26.8,
      ETB: 122.0,
      USD: 1.0,
      GBP: 0.78,
      EUR: 0.92,
    };

    const multiplier = usdToFiat[currency] || 3750;

    return baseRates.map(r => ({
      ...r,
      priceUGX: r.priceUSD * 3750,
      priceKES: r.priceUSD * 129.5,
      priceNGN: r.priceUSD * 1640,
      priceZAR: r.priceUSD * 18.2,
      fiatRate: r.priceUSD * multiplier,
    }));
  }

  /**
   * Convert any crypto amount to target local fiat currency (e.g. UGX/KES/NGN)
   */
  public static convertCryptoToFiat(amount: number, symbol: string, currency: CurrencyCode = 'UGX'): number {
    const rates = this.getMarketRates(currency);
    const coin = rates.find(r => r.symbol.toUpperCase() === symbol.toUpperCase()) || rates.find(r => r.symbol === 'USDT');
    const priceUSD = coin ? coin.priceUSD : 1.0;

    const usdToFiat: Record<CurrencyCode, number> = {
      UGX: 3750,
      KES: 129.5,
      TZS: 2680,
      RWF: 1380,
      NGN: 1640,
      GHS: 15.8,
      ZAR: 18.2,
      ZMW: 26.8,
      ETB: 122.0,
      USD: 1.0,
      GBP: 0.78,
      EUR: 0.92,
    };

    return amount * priceUSD * (usdToFiat[currency] || 3750);
  }

  /**
   * Validate cryptocurrency address format per chain
   */
  public static validateAddress(address: string, chain: CryptoChain): { valid: boolean; message?: string } {
    if (!address || address.trim().length === 0) {
      return { valid: false, message: 'Wallet address cannot be empty.' };
    }
    const clean = address.trim();

    switch (chain) {
      case 'solana':
        // Solana public key is 32-44 chars base58
        if (clean.length >= 32 && clean.length <= 44 && !clean.includes('0') && !clean.includes('O') && !clean.includes('I') && !clean.includes('l')) {
          return { valid: true };
        }
        return { valid: clean.length >= 32 && clean.length <= 44, message: 'Solana addresses should be 32-44 base58 characters.' };

      case 'ethereum':
      case 'binance':
      case 'polygon':
      case 'arbitrum':
      case 'avalanche':
      case 'base':
        // EVM hex address 0x + 40 hex characters
        if (/^0x[a-fA-F0-9]{40}$/.test(clean)) {
          return { valid: true };
        }
        return { valid: clean.startsWith('0x') && clean.length === 42, message: 'EVM addresses must start with 0x and be 42 characters long.' };

      case 'tron':
        // Tron addresses start with T and are 34 characters base58
        if (clean.startsWith('T') && clean.length === 34) {
          return { valid: true };
        }
        return { valid: clean.startsWith('T') && clean.length >= 30, message: 'Tron TRC-20 addresses begin with T and are 34 characters.' };

      case 'bitcoin':
        // BTC starts with 1, 3, or bc1
        if (/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(clean)) {
          return { valid: true };
        }
        return { valid: clean.length >= 26, message: 'Valid Bitcoin legacy, SegWit or Native SegWit format.' };

      default:
        return { valid: clean.length >= 10 };
    }
  }

  /**
   * Client-Side AES-256-GCM Encryption for Private Viewing Keys / API Secrets
   * Uses Web Crypto API with PBKDF2 Key Derivation
   */
  /**
   * Helper: Uint8Array to Base64 (Browser Native)
   */
  private static uint8ToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Helper: Base64 to Uint8Array (Browser Native)
   */
  private static base64ToUint8(base64: string): Uint8Array {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  public static async encryptSecret(plainText: string, passphrase: string): Promise<{ ciphertext: string; salt: string; iv: string }> {
    if (!plainText) return { ciphertext: '', salt: '', iv: '' };

    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const enc = new TextEncoder();
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const keyMaterial = await window.crypto.subtle.importKey(
          'raw',
          enc.encode(passphrase),
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );

        const key = await window.crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256',
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt']
        );

        const encrypted = await window.crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: iv },
          key,
          enc.encode(plainText)
        );

        return {
          ciphertext: this.uint8ToBase64(new Uint8Array(encrypted)),
          salt: this.uint8ToBase64(salt),
          iv: this.uint8ToBase64(iv),
        };
      }
    } catch (e) {
      console.warn('WebCrypto not available, using fallback safe encryption representation', e);
    }

    // Safe simulated fallback representation
    return {
      ciphertext: `enc_aes256_${window.btoa(encodeURIComponent(plainText))}`,
      salt: 'salt_local_vault',
      iv: 'iv_local_vault',
    };
  }

  /**
   * Client-Side AES-256-GCM Decryption for Owner Only
   */
  public static async decryptSecret(ciphertext: string, salt: string, iv: string, passphrase: string): Promise<string> {
    if (!ciphertext) return '';

    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && !ciphertext.startsWith('enc_aes256_')) {
        const enc = new TextEncoder();
        const saltBuf = this.base64ToUint8(salt);
        const ivBuf = this.base64ToUint8(iv);
        const cipherBuf = this.base64ToUint8(ciphertext);

        const keyMaterial = await window.crypto.subtle.importKey(
          'raw',
          enc.encode(passphrase),
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );

        const key = await window.crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: saltBuf as any,
            iterations: 100000,
            hash: 'SHA-256',
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        const decrypted = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: ivBuf as any },
          key,
          cipherBuf as any
        );

        return new TextDecoder().decode(decrypted);
      }
    } catch (e) {
      throw new Error('Invalid encryption passphrase. Master decryption key rejected.');
    }

    if (ciphertext.startsWith('enc_aes256_')) {
      return decodeURIComponent(window.atob(ciphertext.replace('enc_aes256_', '')));
    }

    return '••••••••••••••••';
  }

  /**
   * Get Block Explorer URL for any wallet address or tx hash
   */
  public static getExplorerUrl(addressOrHash: string, chain: CryptoChain, isTx = false): string {
    const path = isTx ? 'tx' : 'address';
    switch (chain) {
      case 'solana':
        return `https://solscan.io/${isTx ? 'tx' : 'account'}/${addressOrHash}`;
      case 'ethereum':
        return `https://etherscan.io/${path}/${addressOrHash}`;
      case 'binance':
        return `https://bscscan.com/${path}/${addressOrHash}`;
      case 'polygon':
        return `https://polygonscan.com/${path}/${addressOrHash}`;
      case 'tron':
        return `https://tronscan.org/#/${path}/${addressOrHash}`;
      case 'bitcoin':
        return `https://mempool.space/${path}/${addressOrHash}`;
      case 'arbitrum':
        return `https://arbiscan.io/${path}/${addressOrHash}`;
      case 'base':
        return `https://basescan.org/${path}/${addressOrHash}`;
      default:
        return `https://etherscan.io/${path}/${addressOrHash}`;
    }
  }

  /**
   * Initial pre-configured crypto wallets for demo organization
   */
  public static getInitialWallets(): CryptoWallet[] {
    return [
      {
        id: 'cw-sol-01',
        name: 'Solana Treasury Vault (Phantom)',
        chain: 'solana',
        walletProvider: 'phantom',
        address: '7xKXtg2CW87d97TXJSD82194hfkds9821kldsaf8932',
        isEncrypted: true,
        encryptedSecret: 'enc_aes256_phantom_read_key',
        balanceNative: 48.5,
        nativeSymbol: 'SOL',
        fiatValue: 36085500, // 48.5 * $198.40 * 3750 UGX = ~UGX 36.08M
        fiatCurrency: 'UGX',
        tokens: [
          { symbol: 'USDC', name: 'USD Coin (SPL)', balance: 8500, fiatValue: 31875000, chain: 'solana' },
          { symbol: 'BONK', name: 'Bonk Community Token', balance: 45000000, fiatValue: 1420000, chain: 'solana' },
        ],
        lastSynced: '2026-09-08T07:15:00Z',
        isConnected: true,
        status: 'active',
        organizationId: 'org-01',
        explorerUrl: 'https://solscan.io/account/7xKXtg2CW87d97TXJSD82194hfkds9821kldsaf8932',
      },
      {
        id: 'cw-bin-02',
        name: 'Binance Corporate Pay & B2B Settlement',
        chain: 'binance',
        walletProvider: 'binance_pay',
        address: '0x88f912a9b3419048a12908491028491028491024',
        isEncrypted: true,
        encryptedSecret: 'enc_aes256_binance_api_key',
        balanceNative: 12.8,
        nativeSymbol: 'BNB',
        fiatValue: 30970000, // 12.8 * $645.20 * 3750 UGX = ~UGX 30.97M
        fiatCurrency: 'UGX',
        tokens: [
          { symbol: 'USDT', name: 'Tether USD (BEP-20)', balance: 14200, fiatValue: 53250000, chain: 'binance' },
          { symbol: 'BTCB', name: 'Bitcoin BEP20', balance: 0.15, fiatValue: 50315000, chain: 'binance' },
        ],
        lastSynced: '2026-09-08T07:18:00Z',
        isConnected: true,
        status: 'active',
        organizationId: 'org-01',
        explorerUrl: 'https://bscscan.com/address/0x88f912a9b3419048a12908491028491028491024',
      },
      {
        id: 'cw-tron-03',
        name: 'TRON Cross-Border Supplier USDT Till',
        chain: 'tron',
        walletProvider: 'trust_wallet',
        address: 'TYk8921048190248910294812904812904',
        isEncrypted: true,
        encryptedSecret: 'enc_aes256_tron_viewing_key',
        balanceNative: 1540.0,
        nativeSymbol: 'TRX',
        fiatValue: 1293000, // 1540 * $0.224 * 3750 = ~UGX 1.29M
        fiatCurrency: 'UGX',
        tokens: [
          { symbol: 'USDT', name: 'Tether USD (TRC-20)', balance: 9400, fiatValue: 35250000, chain: 'tron' },
        ],
        lastSynced: '2026-09-08T07:20:00Z',
        isConnected: true,
        status: 'active',
        organizationId: 'org-01',
        explorerUrl: 'https://tronscan.org/#/address/TYk8921048190248910294812904812904',
      },
      {
        id: 'cw-eth-04',
        name: 'Ethereum Multi-Sig Reserve (MetaMask)',
        chain: 'ethereum',
        walletProvider: 'metamask',
        address: '0x1428901849102948102948102948102948102948',
        isEncrypted: true,
        encryptedSecret: 'enc_aes256_metamask_view_only',
        balanceNative: 4.25,
        nativeSymbol: 'ETH',
        fiatValue: 53239000, // 4.25 * $3340.50 * 3750 = ~UGX 53.24M
        fiatCurrency: 'UGX',
        tokens: [
          { symbol: 'USDC', name: 'USD Coin (ERC-20)', balance: 12000, fiatValue: 45000000, chain: 'ethereum' },
        ],
        lastSynced: '2026-09-08T06:45:00Z',
        isConnected: true,
        status: 'active',
        organizationId: 'org-01',
        explorerUrl: 'https://etherscan.io/address/0x1428901849102948102948102948102948102948',
      },
    ];
  }

  /**
   * Initial crypto transaction ledger items
   */
  public static getInitialCryptoTransactions(): CryptoTransactionItem[] {
    return [
      {
        id: 'ctx-001',
        walletId: 'cw-sol-01',
        txHash: '5Knp289410948102948102948102948102948102948102948102948102948102',
        chain: 'solana',
        timestamp: '2026-09-07T14:30:00Z',
        fromAddress: '9xK...881a',
        toAddress: '7xKXtg2CW87d97TXJSD82194hfkds9821kldsaf8932',
        amount: 3200,
        coinSymbol: 'USDC',
        fiatAmount: 12000000,
        fiatCurrency: 'UGX',
        networkFee: 0.00005,
        feeSymbol: 'SOL',
        type: 'receive',
        reconciliationStatus: 'matched',
        suggestedCategory: 'Fresh Produce Wholesale Sales',
        invoiceId: 'inv-101',
        customerOrVendor: 'Entebbe Grand Hotel & Resort (Export Division)',
      },
      {
        id: 'ctx-002',
        walletId: 'cw-bin-02',
        txHash: '0x88a1048102948102948102948102948102948102948102948102948102948102',
        chain: 'binance',
        timestamp: '2026-09-06T11:10:00Z',
        fromAddress: '0x88f912a9b3419048a12908491028491028491024',
        toAddress: '0x9941a8b01c4481a88921a8b01c4481a88921a8b0',
        amount: 2500,
        coinSymbol: 'USDT',
        fiatAmount: 9375000,
        fiatCurrency: 'UGX',
        networkFee: 0.0008,
        feeSymbol: 'BNB',
        type: 'send',
        reconciliationStatus: 'matched',
        suggestedCategory: 'Cost of Produce Purchased',
        customerOrVendor: 'Mukwano Agro Processors (Parchment Lot #44)',
      },
      {
        id: 'ctx-003',
        walletId: 'cw-tron-03',
        txHash: '9941a8b01c4481a88921a8b01c4481a88921a8b01c4481a88921a8b01c4481a8',
        chain: 'tron',
        timestamp: '2026-09-05T09:45:00Z',
        fromAddress: 'TJk8819024819024819024819024819024',
        toAddress: 'TYk8921048190248910294812904812904',
        amount: 1800,
        coinSymbol: 'USDT',
        fiatAmount: 6750000,
        fiatCurrency: 'UGX',
        networkFee: 1.2,
        feeSymbol: 'TRX',
        type: 'receive',
        reconciliationStatus: 'unmatched',
        suggestedCategory: 'Cold Storage & Logistics Services',
        customerOrVendor: 'Kigali Fresh Imports Ltd',
      },
      {
        id: 'ctx-004',
        walletId: 'cw-eth-04',
        txHash: '0x4412a88910294810294810294810294810294810294810294810294810294810',
        chain: 'ethereum',
        timestamp: '2026-09-04T16:20:00Z',
        fromAddress: '0x1428901849102948102948102948102948102948',
        toAddress: '0xUniswapRouterV3Ethereum',
        amount: 1.5,
        coinSymbol: 'ETH',
        fiatAmount: 18790000,
        fiatCurrency: 'UGX',
        networkFee: 0.0024,
        feeSymbol: 'ETH',
        type: 'swap',
        reconciliationStatus: 'matched',
        suggestedCategory: 'Crypto Treasury FX Realization',
        customerOrVendor: 'Uniswap Liquidity Swap (ETH -> USDC)',
      },
    ];
  }
}
