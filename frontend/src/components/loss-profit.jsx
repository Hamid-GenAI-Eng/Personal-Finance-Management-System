import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import './loss-profit.css'

export default function LossProfit({ budgets, expenses }) {
  const [income, setIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    setIncome(budgets.reduce((acc, budget) => acc + Number(budget.amount), 0));
    setTotalExpenses(expenses.reduce((acc, expense) => acc + Number(expense.amount), 0));
  }, [budgets, expenses]);

  const profitLoss = income - totalExpenses;

  const pieData = {
    labels: expenses.map((exp) => exp.name),
    datasets: [
      {
        data: expenses.map((exp) => Number(exp.amount)),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#8E44AD"],
      },
    ],
  };

  const lineData = {
    labels: expenses.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Daily Expenses",
        data: expenses.map((exp) => Number(exp.amount)),
        fill: false,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="">
      {/* Navbar */}
      <nav className="navbar">
        <img src="Finovalogo.png" alt="Company Logo" className="logo" />
        <h1 className="navbar-title">Profit & Loss Summary</h1>
      </nav>
      
      <div className="container">
        <div className="summary-box">
          <p className="text-lg font-semibold">Income: ${income}</p>
          <p className="text-lg font-semibold">Expenses: ${totalExpenses}</p>
          <p className={`text-lg font-semibold ${profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
            {profitLoss >= 0 ? "Profit" : "Loss"}: ${Math.abs(profitLoss)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Expenses Breakdown</h2>
            <div className="w-full h-64">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Daily Expenses Trend</h2>
            <div className="w-full h-64">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
