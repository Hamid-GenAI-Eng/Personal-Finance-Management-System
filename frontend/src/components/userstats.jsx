import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./userstats.css"; // Import external CSS

export default function SummaryAnalysis({ budgets, expenses }) {
  const [income, setIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [avgExpense, setAvgExpense] = useState(0);
  const [maxExpense, setMaxExpense] = useState(null);
  const [minExpense, setMinExpense] = useState(null);
  const [savingsRate, setSavingsRate] = useState(0);

  useEffect(() => {
    const totalIncome = budgets.reduce((acc, budget) => acc + Number(budget.amount), 0);
    const totalExp = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);

    setIncome(totalIncome);
    setTotalExpenses(totalExp);

    if (expenses.length > 0) {
      setAvgExpense((totalExp / expenses.length).toFixed(2));
      const sortedExpenses = [...expenses].sort((a, b) => Number(a.amount) - Number(b.amount));
      setMinExpense(sortedExpenses[0]);
      setMaxExpense(sortedExpenses[sortedExpenses.length - 1]);
    } else {
      setAvgExpense(0);
      setMinExpense(null);
      setMaxExpense(null);
    }

    if (totalIncome > 0) {
      setSavingsRate(((totalIncome - totalExp) / totalIncome * 100).toFixed(2));
    } else {
      setSavingsRate(0);
    }
  }, [budgets, expenses]);

  const downloadPDF = () => {
    const input = document.getElementById("summary-report");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Financial_Summary.pdf");
    });
  };

  return (
    <div className="summary-container">
      <h1 className="summary-title">Financial Summary & Analysis</h1>
      <button onClick={downloadPDF} className="pdf-button">📄 Download PDF Report</button>
      <div id="summary-report" className="summary-card">
        <h2 className="section-title">Overview</h2>
        <p className="summary-item">📌 Total Income: <span>${income}</span></p>
        <p className="summary-item">💸 Total Expenses: <span>${totalExpenses}</span></p>
        <p className={`summary-item ${income - totalExpenses >= 0 ? "positive" : "negative"}`}>
          {income - totalExpenses >= 0 ? "📈 Net Savings" : "📉 Net Deficit"}: <span>${Math.abs(income - totalExpenses)}</span>
        </p>
        <p className="summary-item">📊 Savings Rate: <span>{savingsRate}%</span></p>

        <h2 className="section-title">Expense Analysis</h2>
        <p className="summary-item">📅 Average Daily Expense: <span>${avgExpense}</span></p>
        {maxExpense && <p className="summary-item">🔺 Highest Expense: <span>${maxExpense.amount}</span> on {maxExpense.name}</p>}
        {minExpense && <p className="summary-item">🔻 Lowest Expense: <span>${minExpense.amount}</span> on {minExpense.name}</p>}

        <h2 className="section-title">Financial Insights</h2>
        <ul className="insights-list">
          {income - totalExpenses >= 0 ? (
            <li className="positive">✅ Great! You are saving money. Consider investing your savings.</li>
          ) : (
            <li className="negative">⚠️ Your expenses exceed your income. Try budgeting better.</li>
          )}
          {savingsRate > 20 && <li>🚀 Your savings rate is excellent! Keep up the habit.</li>}
          {savingsRate < 10 && savingsRate > 0 && <li>📉 Consider reducing unnecessary expenses.</li>}
          {totalExpenses > income * 0.7 && <li>⚠️ Your expenses are more than 70% of your income. Try cutting back.</li>}
        </ul>
      </div>
    </div>
  );
}
