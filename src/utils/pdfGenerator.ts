import { Transaction, UserProfile } from '../types';
import { formatCurrency, formatDate } from './formatters';

interface StatementOptions {
  monthName?: string;
  transactions: Transaction[];
  userProfile?: UserProfile | null;
  currency?: string;
  currencySymbol?: string;
}

export const generateMonthlyPDFStatement = ({
  monthName = 'Current Month',
  transactions,
  userProfile,
  currency = 'INR',
  currencySymbol = '₹'
}: StatementOptions) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate and view the PDF Financial Statement.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SpendWise Financial Statement - ${monthName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            margin: 0;
            padding: 32px;
            font-size: 13px;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #14240b;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .logo-box {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-badge {
            background-color: #14240b;
            color: #bce842;
            font-weight: 800;
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 18px;
            letter-spacing: -0.5px;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 800;
            color: #14240b;
            margin: 0;
          }
          .brand-sub {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }
          .doc-title {
            text-align: right;
          }
          .doc-title h2 {
            margin: 0;
            font-size: 18px;
            color: #14240b;
            font-weight: 800;
          }
          .doc-title p {
            margin: 4px 0 0 0;
            color: #64748b;
            font-size: 12px;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 28px;
          }
          .meta-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 14px;
            border-radius: 12px;
          }
          .meta-card .label {
            font-size: 11px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .meta-card .val {
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
          }
          .meta-card.income .val { color: #16a34a; }
          .meta-card.expense .val { color: #dc2626; }
          .meta-card.savings .val { color: #14240b; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th {
            background-color: #14240b;
            color: #ffffff;
            text-align: left;
            padding: 10px 14px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          th:first-child { border-top-left-radius: 8px; }
          th:last-child { border-top-right-radius: 8px; text-align: right; }
          td {
            padding: 10px 14px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
          }
          tr:nth-child(even) { background-color: #f8fafc; }
          .amt-income { color: #16a34a; font-weight: 700; text-align: right; }
          .amt-expense { color: #dc2626; font-weight: 700; text-align: right; }
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #94a3b8;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-box">
            <div class="logo-badge">SW</div>
            <div>
              <h1 class="brand-title">SpendWise</h1>
              <div class="brand-sub">Financial SaaS • Account Statement</div>
            </div>
          </div>
          <div class="doc-title">
            <h2>MONTHLY FINANCIAL STATEMENT</h2>
            <p>Period: <strong>${monthName}</strong> | Generated: ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-card">
            <div class="label">Total Records</div>
            <div class="val">${transactions.length} Txns</div>
          </div>
          <div class="meta-card income">
            <div class="label">Total Income</div>
            <div class="val">${formatCurrency(totalIncome, currency, currencySymbol)}</div>
          </div>
          <div class="meta-card expense">
            <div class="label">Total Expenses</div>
            <div class="val">${formatCurrency(totalExpense, currency, currencySymbol)}</div>
          </div>
          <div class="meta-card savings">
            <div class="label">Net Cashflow</div>
            <div class="val">${formatCurrency(netSavings, currency, currencySymbol)}</div>
          </div>
        </div>

        <h3>Transaction Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Method</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactions
              .map(
                t => `
              <tr>
                <td style="font-family: monospace; color: #64748b;">#${t.id}</td>
                <td>${formatDate(t.date)}</td>
                <td><strong>${t.description}</strong> ${t.notes ? `<br><small style="color:#64748b;">${t.notes}</small>` : ''}</td>
                <td>${t.category}</td>
                <td>${t.paymentMethod}</td>
                <td class="${t.type === 'income' ? 'amt-income' : 'amt-expense'}">
                  ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount, currency, currencySymbol)}
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <div>Report account holder: <strong>${userProfile?.name || 'Sanjay Kumar'}</strong> (${userProfile?.email || 'demo@spendwise.com'})</div>
          <div>Page 1 of 1 • SpendWise Financial Intelligence</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
