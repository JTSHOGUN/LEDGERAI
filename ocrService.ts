import { OcrExtractedData, PaymentMethod, CurrencyCode } from '../types';

export class OcrService {
  public static simulateOcrScan(
    file: File | { name: string; size: number },
    organizationId: string
  ): Promise<OcrExtractedData> {
    return new Promise((resolve) => {
      // Simulate 1.2s realistic neural OCR extraction pipeline
      setTimeout(() => {
        const fileNameLower = file.name.toLowerCase();

        if (fileNameLower.includes('fuel') || fileNameLower.includes('total') || fileNameLower.includes('shell') || fileNameLower.includes('petrol')) {
          resolve({
            id: `ocr-${Date.now()}`,
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024 || 1.2).toFixed(1)} MB`,
            fileType: 'receipt',
            merchantName: 'TotalEnergies Uganda Ltd (Mukwano Branch)',
            merchantTin: '1000029481',
            date: new Date().toISOString().split('T')[0],
            referenceNumber: `RCPT-TOT-${Math.floor(100000 + Math.random() * 900000)}`,
            lineItems: [
              { description: 'Excellium Diesel 50ppm (60 Litres)', quantity: 60, unitPrice: 5500, total: 330000 },
              { description: 'Lubricant Oil Top-up (Quartz 7000 1L)', quantity: 1, unitPrice: 45000, total: 45000 },
            ],
            subtotal: 317796,
            taxAmount: 57204,
            taxRate: 18,
            totalAmount: 375000,
            currency: 'UGX',
            paymentMethod: 'bank_transfer',
            suggestedCategory: 'Transport & Fleet Fuel Expense',
            confidenceScore: 98,
            isDuplicate: false,
            organizationId,
          });
        } else if (fileNameLower.includes('umeme') || fileNameLower.includes('power') || fileNameLower.includes('electric')) {
          resolve({
            id: `ocr-${Date.now()}`,
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024 || 0.8).toFixed(1)} MB`,
            fileType: 'bill',
            merchantName: 'Umeme Limited',
            merchantTin: '1000010041',
            date: new Date().toISOString().split('T')[0],
            referenceNumber: `UM-EFRIS-${Math.floor(100000 + Math.random() * 900000)}`,
            lineItems: [
              { description: 'Commercial Electricity Tariff (3 Phase) - 1,280 kWh', quantity: 1280, unitPrice: 703.125, total: 900000 },
            ],
            subtotal: 900000,
            taxAmount: 162000,
            taxRate: 18,
            totalAmount: 1062000,
            currency: 'UGX',
            paymentMethod: 'mobile_money_mtn',
            suggestedCategory: 'Warehouse Rent & Electricity (Umeme)',
            confidenceScore: 99,
            isDuplicate: false,
            organizationId,
          });
        } else if (fileNameLower.includes('airtel') || fileNameLower.includes('mtn') || fileNameLower.includes('internet') || fileNameLower.includes('telecom')) {
          resolve({
            id: `ocr-${Date.now()}`,
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024 || 0.5).toFixed(1)} MB`,
            fileType: 'receipt',
            merchantName: 'Airtel Uganda Business Services',
            merchantTin: '1000049182',
            date: new Date().toISOString().split('T')[0],
            referenceNumber: `AM-TAX-${Math.floor(100000 + Math.random() * 900000)}`,
            lineItems: [
              { description: 'Dedicated Fiber Internet (50 Mbps Unlimited)', quantity: 1, unitPrice: 250000, total: 250000 },
            ],
            subtotal: 211864,
            taxAmount: 38136,
            taxRate: 18,
            totalAmount: 250000,
            currency: 'UGX',
            paymentMethod: 'mobile_money_airtel',
            suggestedCategory: 'Internet & Telecom Data Bundles',
            confidenceScore: 97,
            isDuplicate: false,
            organizationId,
          });
        } else {
          // General wholesale / supplier invoice extraction
          resolve({
            id: `ocr-${Date.now()}`,
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024 || 1.5).toFixed(1)} MB`,
            fileType: 'receipt',
            merchantName: 'Kampala Wholesale Supplies Ltd',
            merchantTin: '1003891024',
            date: new Date().toISOString().split('T')[0],
            referenceNumber: `KW-${Math.floor(1000 + Math.random() * 9000)}`,
            lineItems: [
              { description: 'Reinforced Packaging Materials & Liners (100 pcs)', quantity: 100, unitPrice: 3500, total: 350000 },
              { description: 'High-Tensile Strapping Tape (10 rolls)', quantity: 10, unitPrice: 18100, total: 181000 },
            ],
            subtotal: 450000,
            taxAmount: 81000,
            taxRate: 18,
            totalAmount: 531000,
            currency: 'UGX',
            paymentMethod: 'mobile_money_mtn',
            suggestedCategory: 'Packaging Bags & Wooden Crates',
            confidenceScore: 96,
            isDuplicate: false,
            organizationId,
          });
        }
      }, 1200);
    });
  }
}
