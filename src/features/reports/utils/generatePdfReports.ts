import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { formatMonthName } from "./formatMonth";
import type { FinancialReportItem } from "../types/types";

type Props = {
    month: string;
    financialData: FinancialReportItem[];
    activeMembers: number;
    monthlyVisitors: number;
};

export async function generatePdfReport({
    month,
    financialData,
    activeMembers,
    monthlyVisitors,
}: Props) {
    const monthLabel = formatMonthName(month);

    const totalIncome = financialData.reduce((a, i) => a + i.income, 0);
    const totalExpense = financialData.reduce((a, i) => a + i.expense, 0);
    const totalBalance = totalIncome - totalExpense;

    const rows = financialData
        .map(
            (i) => `
        <tr>
            <td>${i.category}</td>
            <td>R$ ${i.income.toFixed(2)}</td>
            <td>R$ ${i.expense.toFixed(2)}</td>
            <td>R$ ${i.balance.toFixed(2)}</td>
        </tr>
    `
        )
        .join("");

    const html = `
    <html>
      <body style="font-family: Arial; padding: 24px;">
        <h1>Relatório - Ministério360</h1>
        <p><strong>Período:</strong> ${monthLabel}</p>

        <h2>Relatório Financeiro</h2>
        <table border="1" cellpadding="8" cellspacing="0" width="100%">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Entrada</th>
              <th>Saída</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>R$ ${totalIncome.toFixed(2)}</strong></td>
              <td><strong>R$ ${totalExpense.toFixed(2)}</strong></td>
              <td><strong>R$ ${totalBalance.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <h2 style="margin-top:24px">Relatório de Membros</h2>
        <p>Membros ativos: <strong>${activeMembers}</strong></p>
        <p>Visitantes no mês: <strong>${monthlyVisitors}</strong></p>

        <p style="margin-top:32px;font-size:12px">
          Gerado em ${new Date().toLocaleDateString("pt-BR")}
        </p>
      </body>
    </html>
  `;

    const { uri } = await Print.printToFileAsync({
        html,
    });

    await Sharing.shareAsync(uri);
}
