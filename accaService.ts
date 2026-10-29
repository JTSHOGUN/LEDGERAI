import {
  AccaWorkingPaper,
  AccaMateriality,
  AccaAuditRiskItem,
  AccaAdjustingJournal,
  AccaAuditReport,
  Account,
  Transaction,
  Organization
} from '../types';

export class AccaService {
  /**
   * Generates default IFRS Working Papers for corporate audits
   */
  public static getDefaultWorkingPapers(org: Organization, revenue: number): AccaWorkingPaper[] {
    return [
      {
        id: 'wp-ifrs-15',
        standard: 'IFRS 15',
        title: 'Revenue from Contracts with Customers - 5-Step Model',
        description: 'Verification of contract identification, distinct performance obligations, transaction price allocation, and point-in-time vs over-time revenue recognition.',
        status: 'signed_off',
        preparedBy: 'Senior Audit Senior (ACCA Affiliate)',
        reviewedBy: 'Engagement Partner (FCCA #28419)',
        signOffDate: '2026-09-08',
        notes: 'Wholesale produce exports recognize revenue at port handover (FOB Mombasa / Entebbe). Cold chain logistics contracts recognized over time as performance obligations are fulfilled.',
        keyMetrics: {
          'Total Contract Revenue': `${org.currency} ${(revenue).toLocaleString()}`,
          'Performance Obligations Identified': 3,
          'Unearned Contract Liabilities': `${org.currency} 0`,
          'Variable Consideration Risk': 'Low (< 1.5% returns)',
        },
      },
      {
        id: 'wp-ifrs-16',
        standard: 'IFRS 16',
        title: 'Leases & Right-of-Use (ROU) Assets Schedule',
        description: 'Assessment of warehouse and cold storage lease liabilities, incremental borrowing rates, and depreciation of ROU assets.',
        status: 'in_review',
        preparedBy: 'Audit Senior (ACCA)',
        reviewedBy: 'Audit Manager (ACCA)',
        signOffDate: undefined,
        notes: 'Kampala Central Warehouse 5-year lease discounted at 12.5% incremental borrowing rate. ROU asset capitalized and depreciated straight-line over 60 months.',
        keyMetrics: {
          'ROU Asset Carrying Value': `${org.currency} 142,500,000`,
          'Lease Liability (Current)': `${org.currency} 28,400,000`,
          'Lease Liability (Non-Current)': `${org.currency} 98,600,000`,
          'Discount Rate Applied': '12.50% p.a.',
        },
      },
      {
        id: 'wp-ifrs-9',
        standard: 'IFRS 9',
        title: 'Financial Instruments & Expected Credit Loss (ECL) Model',
        description: 'Simplified provision matrix for trade receivables aging and macroeconomic forward-looking default loss rates.',
        status: 'signed_off',
        preparedBy: 'Financial Risk Analyst',
        reviewedBy: 'Engagement Partner (FCCA)',
        signOffDate: '2026-09-05',
        notes: 'Receivables over 90 days provisioned at 8.2% ECL rate. Mobile money float and commercial bank balances held with Tier 1 institutions rated investment grade locally.',
        keyMetrics: {
          'Gross Trade Receivables': `${org.currency} 24,150,000`,
          'ECL Provision Allowance': `${org.currency} 1,200,000`,
          'Coverage Ratio': '4.97%',
          'Default Probability': 'Low',
        },
      },
      {
        id: 'wp-ias-12',
        standard: 'IAS 12',
        title: 'Income Taxes & Deferred Tax Movement Schedule',
        description: 'Computation of taxable temporary differences between accounting depreciation and statutory capital allowances (URA / KRA tax rates).',
        status: 'signed_off',
        preparedBy: 'Tax Senior (ACCA / CTA)',
        reviewedBy: 'Tax Partner (ACCA)',
        signOffDate: '2026-09-07',
        notes: 'Corporate income tax rate 30.0%. Accelerated wear and tear allowance on cold storage compressors produces taxable temporary difference of UGX 18.2M.',
        keyMetrics: {
          'Current Tax Expense': `${org.currency} 5,420,000`,
          'Deferred Tax Liability': `${org.currency} 5,460,000`,
          'Effective Tax Rate': '28.4%',
          'Statutory Tax Rate': '30.0%',
        },
      },
      {
        id: 'wp-ias-24',
        standard: 'IAS 24',
        title: 'Related Party Disclosures & Director Loan Accounts',
        description: 'Identification of key management personnel compensation, director current accounts, and commercial arm-length transactions with affiliated entities.',
        status: 'signed_off',
        preparedBy: 'Audit Senior',
        reviewedBy: 'Engagement Partner (FCCA)',
        signOffDate: '2026-09-06',
        notes: 'All director transactions benchmarked against market commercial rates. Intercompany produce transport priced at standard freight tariff.',
        keyMetrics: {
          'Key Management Compensation': `${org.currency} 14,800,000`,
          'Director Loan Balances': `${org.currency} 0 (NIL)`,
          'Affiliate Trading Volume': `${org.currency} 8,200,000`,
          'Transfer Pricing Compliance': 'Compliant',
        },
      },
      {
        id: 'wp-ias-10',
        standard: 'IAS 10',
        title: 'Events After the Reporting Period (Post-Balance Sheet Review)',
        description: 'Inquiry with management and legal counsel regarding adjusting vs non-adjusting events up to date of audit report authorization.',
        status: 'in_review',
        preparedBy: 'Audit Manager',
        reviewedBy: 'Engagement Partner (FCCA)',
        signOffDate: undefined,
        notes: 'No material litigations, insolvencies, or foreign exchange devaluations exceeding performance materiality observed subsequent to period close.',
        keyMetrics: {
          'Adjusting Events Identified': 0,
          'Non-Adjusting Disclosures': 0,
          'Legal Claims Exposure': `${org.currency} 0`,
        },
      },
      {
        id: 'wp-ias-41',
        standard: 'IAS 41',
        title: 'Agriculture & Biological Assets Fair Valuation',
        description: 'Fair value measurement less costs to sell for agricultural fresh produce and coffee inventory at point of harvest.',
        status: 'signed_off',
        preparedBy: 'Valuation Specialist',
        reviewedBy: 'Engagement Partner (FCCA)',
        signOffDate: '2026-09-04',
        notes: 'Fresh export avocados and Arabica coffee lots measured at market quote at Kampala central terminal less transport costs to Mombasa.',
        keyMetrics: {
          'Biological Asset Valuation': `${org.currency} 18,400,000`,
          'Level 2 Market Inputs': 'Kampala Coffee Exchange Quote',
          'Fair Value Adjustment Gain': `${org.currency} 1,450,000`,
        },
      },
    ];
  }

  /**
   * Calculates ISA 320 Audit Materiality benchmarks
   */
  public static calculateMateriality(
    revenue: number,
    profitBeforeTax: number,
    totalAssets: number,
    benchmarkType: 'revenue' | 'profit_before_tax' | 'total_assets' | 'net_assets' = 'revenue'
  ): AccaMateriality {
    let benchmarkAmount = revenue;
    let overallPercentage = 1.0; // 1% of revenue is standard ISA 320 benchmark

    if (benchmarkType === 'profit_before_tax') {
      benchmarkAmount = Math.max(1000000, profitBeforeTax);
      overallPercentage = 5.0; // 5% of PBT
    } else if (benchmarkType === 'total_assets') {
      benchmarkAmount = totalAssets;
      overallPercentage = 1.0; // 1% of total assets
    }

    const overallMateriality = (benchmarkAmount * overallPercentage) / 100;
    const performancePercentage = 75; // 75% for low-risk audited entities
    const performanceMateriality = (overallMateriality * performancePercentage) / 100;
    const trivialThresholdPercentage = 5; // 5% is ISA clearly trivial threshold
    const trivialThreshold = (overallMateriality * trivialThresholdPercentage) / 100;

    return {
      benchmarkType,
      benchmarkAmount,
      overallPercentage,
      overallMateriality,
      performancePercentage,
      performanceMateriality,
      trivialThresholdPercentage,
      trivialThreshold,
      rationale: `Materiality established under ISA 320 based on ${overallPercentage}% of ${benchmarkType.replace(/_/g, ' ')}. Performance materiality set at 75% due to effective internal controls and low historic audit misstatements. Misstatements below 5% (clearly trivial) are not accumulated.`,
    };
  }

  /**
   * Generates ISA 315 / 330 Audit Risk & Financial Statement Assertions Matrix
   */
  public static getDefaultAuditRisks(): AccaAuditRiskItem[] {
    return [
      {
        id: 'risk-01',
        area: 'Revenue Recognition (Wholesale Produce)',
        assertion: 'Cut-Off',
        inherentRisk: 'High',
        controlRisk: 'Medium',
        auditResponse: 'Sample 100% of dispatch notes and EFRIS fiscal receipts 5 days before and after period end to verify proper period cut-off under IFRS 15.',
        testedBy: 'Audit Senior',
        status: 'concluded',
      },
      {
        id: 'risk-02',
        area: 'Inventory & Biological Produce Valuation',
        assertion: 'Valuation & Allocation',
        inherentRisk: 'Medium',
        controlRisk: 'Low',
        auditResponse: 'Attended physical inventory count at Entebbe cold warehouse. Verified net realizable value (NRV) test against post-year-end sales prices.',
        testedBy: 'Audit Senior',
        status: 'concluded',
      },
      {
        id: 'risk-03',
        area: 'Mobile Money & Crypto Treasury Balances',
        assertion: 'Existence',
        inherentRisk: 'Medium',
        controlRisk: 'Low',
        auditResponse: 'Direct independent confirmation with MTN MoMo, Airtel Money, and on-chain blockchain explorer signature verification for crypto wallets.',
        testedBy: 'Tech Audit Lead',
        status: 'concluded',
      },
      {
        id: 'risk-04',
        area: 'Trade Receivables Recoverability',
        assertion: 'Valuation & Allocation',
        inherentRisk: 'Medium',
        controlRisk: 'Medium',
        auditResponse: 'Reviewed circularization replies and evaluated IFRS 9 simplified ECL matrix against historical default loss rates.',
        testedBy: 'Audit Senior',
        status: 'concluded',
      },
      {
        id: 'risk-05',
        area: 'URA EFRIS e-Invoicing & VAT Returns',
        assertion: 'Completeness',
        inherentRisk: 'Significant',
        controlRisk: 'Low',
        auditResponse: 'Reconciled 100% of general ledger sales entries with URA EFRIS fiscalized QR invoice server logs. Verified no unrecorded tax liabilities.',
        testedBy: 'Engagement Partner',
        status: 'concluded',
      },
    ];
  }

  /**
   * Default Chartered Adjusting Journal Entries (AJEs)
   */
  public static getDefaultAdjustingJournals(org: Organization): AccaAdjustingJournal[] {
    return [
      {
        id: 'aje-01',
        reference: 'AJE-2026-01',
        date: '2026-08-31',
        standard: 'IFRS 16',
        description: 'Year-end ROU Asset Depreciation & Lease Liability Interest Amortization',
        status: 'posted',
        approvedBy: 'FCCA #28419 (Engagement Partner)',
        lines: [
          {
            accountId: '5030',
            accountName: 'ROU Asset Depreciation Expense',
            debit: 2375000,
            credit: 0,
            explanation: 'Straight-line monthly amortization of warehouse right-of-use asset',
          },
          {
            accountId: '1510',
            accountName: 'Accumulated Depreciation - ROU Assets',
            debit: 0,
            credit: 2375000,
            explanation: 'Credit accumulated depreciation balance sheet account',
          },
        ],
      },
      {
        id: 'aje-02',
        reference: 'AJE-2026-02',
        date: '2026-08-31',
        standard: 'IFRS 9',
        description: 'Expected Credit Loss (ECL) Provision on Trade Receivables Aging Bucket',
        status: 'posted',
        approvedBy: 'FCCA #28419 (Engagement Partner)',
        lines: [
          {
            accountId: '5040',
            accountName: 'Bad & Doubtful Debts Expense (ECL)',
            debit: 450000,
            credit: 0,
            explanation: 'Additional ECL impairment on overdue wholesale accounts',
          },
          {
            accountId: '1210',
            accountName: 'Allowance for Expected Credit Losses',
            debit: 0,
            credit: 450000,
            explanation: 'Contra-asset allowance account adjustment',
          },
        ],
      },
      {
        id: 'aje-03',
        reference: 'AJE-2026-03',
        date: '2026-08-31',
        standard: 'IAS 21',
        description: 'Foreign Currency Treasury Revaluation (USDT & USD Float to UGX)',
        status: 'posted',
        approvedBy: 'FCCA #28419 (Engagement Partner)',
        lines: [
          {
            accountId: '1060',
            accountName: 'Web3 Crypto Treasury & Stablecoin Reserves',
            debit: 1240000,
            credit: 0,
            explanation: 'Unrealized foreign exchange gain from USDT/USD rate revaluation',
          },
          {
            accountId: '4080',
            accountName: 'Unrealized Foreign Exchange Gain / (Loss)',
            debit: 0,
            credit: 1240000,
            explanation: 'Recognized in profit or loss under IAS 21',
          },
        ],
      },
    ];
  }

  /**
   * Generates formal ISA 700 / ACCA Statutory Audit Report
   */
  public static generateAuditReport(
    org: Organization,
    revenue: number,
    pbt: number,
    assets: number
  ): AccaAuditReport {
    return {
      id: `audit-rep-${org.id}-2026`,
      organizationId: org.id,
      fiscalYear: 'FY 2026 (Annual Statutory Audit)',
      opinionType: 'unmodified',
      keyAuditMatters: [
        {
          title: 'Revenue Recognition under IFRS 15 across Cross-Border Wholesale Export Contracts',
          standard: 'IFRS 15',
          issue: 'Due to the multi-jurisdictional nature of East African agricultural produce shipments, assessing the exact transfer of control (FOB vs CIF port terms) represents a significant audit focus area.',
          auditorResponse: 'We evaluated accounting policies against IFRS 15, tested design and operational effectiveness of automated EFRIS invoicing controls, and independently confirmed 85% of trade export shipments against customs bills of lading.',
        },
        {
          title: 'Valuation of Cold Chain Biological Produce & Agricultural Inventory under IAS 41 / IAS 2',
          standard: 'IAS 41 & IAS 2',
          issue: 'Fresh produce inventory is subject to perishable shelf life and seasonal market pricing volatility.',
          auditorResponse: 'We attended physical stock counts at central distribution cold storage facilities, tested post-balance-sheet real-time sales realizations, and verified net realizable value provisions.',
        },
        {
          title: 'Verification of Non-Custodial Multi-Chain Crypto Treasury Reserves (USDT/USDC)',
          standard: 'IAS 1 & IFRS 9',
          issue: 'Treasury holding of digital assets and mobile money floats requires cryptographic proof of reserve and validation of client-side encryption keys.',
          auditorResponse: 'We performed cryptographic public key address verification on blockchain explorer nodes (Solscan, TRONScan, Etherscan) and matched all on-chain settlements into the double-entry general ledger.',
        },
      ],
      goingConcernEvaluation: {
        status: 'Satisfactory',
        details: 'Management 12-month cash runway forecast demonstrates robust positive operating cash flows with a healthy working capital buffer. Altman Z-Score indicates safe zone financial stability.',
        zScore: 3.84, // Safe zone is > 2.99
        currentRatio: 2.41,
      },
      auditorName: 'Kato & Associates Certified Public Accountants & Chartered Auditors',
      auditorDesignation: 'FCCA',
      accaMemberNumber: 'ACCA Fellow #2841902 / ICPAU Practicing #P0812',
      firmName: 'Kato & Associates (Chartered Certified Accountants)',
      signedDate: '2026-09-08',
      digitalSignatureHash: '0x88f912c9a1024b810928a49102840192840192840192840192840192840192a8',
    };
  }
}
