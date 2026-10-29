import { jsPDF } from 'jspdf';
import { Invoice, Organization } from '../types';
import { ProfitAndLossReport, BalanceSheetReport, TaxReportData } from './accountingEngine';

export class PdfExportService {
  public static exportInvoicePdf(invoice: Invoice, org: Organization): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Header Background
    doc.setFillColor(11, 18, 32); // #0B1220 Deep Navy
    doc.rect(0, 0, 210, 38, 'F');

    // Title & Logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('TAX INVOICE', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 210, 225);
    doc.text(`Invoice Ref: ${invoice.invoiceNumber} | URA EFRIS Compliant`, 14, 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(org.name, 196, 20, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 195, 215);
    doc.text(`TIN: ${org.tin} | ${org.city}, Uganda`, 196, 27, { align: 'right' });

    // Customer & Metadata Section
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('BILLED TO:', 14, 50);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(invoice.customerName, 14, 56);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    if (invoice.customerTin) doc.text(`TIN: ${invoice.customerTin}`, 14, 62);
    if (invoice.customerEmail) doc.text(`Email: ${invoice.customerEmail}`, 14, 67);
    if (invoice.customerPhone) doc.text(`Phone: ${invoice.customerPhone}`, 14, 72);
    if (invoice.customerAddress) doc.text(`Address: ${invoice.customerAddress}`, 14, 77);

    // Invoice Meta (Dates & Status)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text('INVOICE DETAILS', 140, 50);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Issue Date:', 140, 57);
    doc.text('Due Date:', 140, 63);
    doc.text('Payment Status:', 140, 69);
    doc.text('Currency:', 140, 75);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(invoice.issueDate, 196, 57, { align: 'right' });
    doc.text(invoice.dueDate, 196, 63, { align: 'right' });

    const statusText = invoice.status.toUpperCase().replace('_', ' ');
    doc.text(statusText, 196, 69, { align: 'right' });
    doc.text(invoice.currency, 196, 75, { align: 'right' });

    // Table Header
    const tableTop = 88;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, tableTop, 182, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text('Item & Description', 18, tableTop + 5.5);
    doc.text('Qty', 115, tableTop + 5.5, { align: 'right' });
    doc.text('Unit Price', 148, tableTop + 5.5, { align: 'right' });
    doc.text('Tax', 168, tableTop + 5.5, { align: 'right' });
    doc.text('Total', 192, tableTop + 5.5, { align: 'right' });

    // Table Rows
    let currentY = tableTop + 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);

    invoice.items.forEach((item) => {
      doc.text(item.description, 18, currentY);
      doc.text(item.quantity.toString(), 115, currentY, { align: 'right' });
      doc.text(`${invoice.currency} ${item.unitPrice.toLocaleString()}`, 148, currentY, { align: 'right' });
      doc.text(`${item.taxRate}%`, 168, currentY, { align: 'right' });
      doc.text(`${invoice.currency} ${item.amount.toLocaleString()}`, 192, currentY, { align: 'right' });

      // Subtle divider line
      doc.setDrawColor(226, 232, 240);
      doc.line(14, currentY + 3, 196, currentY + 3);
      currentY += 8;
    });

    // Totals Box
    const totalsY = currentY + 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Subtotal:', 140, totalsY);
    doc.text('VAT (18%):', 140, totalsY + 6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Total Invoice Amount:', 140, totalsY + 13);
    doc.setTextColor(16, 185, 129);
    doc.text('Amount Paid:', 140, totalsY + 19);
    doc.setTextColor(239, 68, 68);
    doc.text('Balance Due:', 140, totalsY + 25);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39);
    doc.text(`${invoice.currency} ${invoice.subtotal.toLocaleString()}`, 192, totalsY, { align: 'right' });
    doc.text(`${invoice.currency} ${invoice.taxTotal.toLocaleString()}`, 192, totalsY + 6, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`${invoice.currency} ${invoice.total.toLocaleString()}`, 192, totalsY + 13, { align: 'right' });
    doc.setTextColor(16, 185, 129);
    doc.text(`${invoice.currency} ${invoice.amountPaid.toLocaleString()}`, 192, totalsY + 19, { align: 'right' });
    doc.setTextColor(239, 68, 68);
    doc.text(`${invoice.currency} ${invoice.balanceDue.toLocaleString()}`, 192, totalsY + 25, { align: 'right' });

    // Payment Instructions & Notes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text('PAYMENT INSTRUCTIONS', 14, totalsY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    if (invoice.mobileMoneyPaymentNumber) {
      doc.text(`Mobile Money: ${invoice.mobileMoneyPaymentNumber}`, 14, totalsY + 6);
    }
    if (invoice.bankAccountDetails) {
      doc.text(`Bank Transfer: ${invoice.bankAccountDetails}`, 14, totalsY + 12);
    }
    if (invoice.notes) {
      doc.text(`Note: ${invoice.notes}`, 14, totalsY + 18);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated via LedgerAI Africa - Secure Cloud Accounting', 14, 285);
    doc.text(`Page 1 of 1 | Verified e-Invoice`, 196, 285, { align: 'right' });

    // Download PDF
    doc.save(`${invoice.invoiceNumber}-${invoice.customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  }

  public static exportProfitLossPdf(pnl: ProfitAndLossReport, org: Organization, period: string): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    doc.setFillColor(11, 18, 32);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('PROFIT & LOSS STATEMENT', 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 210, 225);
    doc.text(`${org.name} | Period: ${period} | Currency: ${org.currency}`, 14, 25);

    let y = 46;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text('REVENUE', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    pnl.revenueItems.forEach((item: { name: string; amount: number }) => {
      doc.text(item.name, 18, y);
      doc.text(`${org.currency} ${item.amount.toLocaleString()}`, 196, y, { align: 'right' });
      y += 6;
    });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Total Revenue', 18, y);
    doc.text(`${org.currency} ${pnl.totalRevenue.toLocaleString()}`, 196, y, { align: 'right' });
    y += 10;

    doc.text('COST OF GOODS SOLD (COGS)', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    pnl.cogsItems.forEach((item: { name: string; amount: number }) => {
      doc.text(item.name, 18, y);
      doc.text(`${org.currency} ${item.amount.toLocaleString()}`, 196, y, { align: 'right' });
      y += 6;
    });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Gross Profit', 18, y);
    doc.text(`${org.currency} ${pnl.grossProfit.toLocaleString()} (${pnl.grossMarginPercent.toFixed(1)}%)`, 196, y, { align: 'right' });
    y += 10;

    doc.text('OPERATING EXPENSES', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    pnl.expenseItems.forEach((item: { name: string; amount: number }) => {
      doc.text(item.name, 18, y);
      doc.text(`${org.currency} ${item.amount.toLocaleString()}`, 196, y, { align: 'right' });
      y += 6;
    });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Total Operating Expenses', 18, y);
    doc.text(`${org.currency} ${pnl.totalExpenses.toLocaleString()}`, 196, y, { align: 'right' });
    y += 10;

    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 4, 182, 14, 'F');
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129);
    doc.text('NET OPERATING PROFIT', 18, y + 4);
    doc.text(`${org.currency} ${pnl.netProfit.toLocaleString()}`, 192, y + 4, { align: 'right' });

    doc.save(`Profit_Loss_${org.name.replace(/\s+/g, '_')}_${period}.pdf`);
  }
}
