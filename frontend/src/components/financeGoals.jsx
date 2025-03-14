import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function FinanceGoals({ income, totalExpenses }) {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const savings = income - totalExpenses; // Remaining savings

  // 📌 Function to add a new financial goal
  const addGoal = () => {
    if (!goalName || !goalAmount || !goalDeadline) return alert("Please enter all fields!");
    
    const newGoal = {
      id: Date.now(),
      name: goalName,
      amount: Number(goalAmount),
      deadline: goalDeadline,
      progress: Math.min((savings / Number(goalAmount)) * 100, 100) // Percentage of goal achieved
    };

    setGoals([...goals, newGoal]);
    setGoalName("");
    setGoalAmount("");
    setGoalDeadline("");
  };

  // 📌 Function to download PDF of goals
  const downloadPDF = () => {
    const input = document.getElementById("goals-report");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Finance_Goals_Report.pdf");
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">🎯 Financial Goals Tracker</h1>

      {/* Input Fields for Adding Goals */}
      <div className="p-4 bg-white border rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Set a New Goal</h2>
        <input 
          type="text"
          placeholder="Goal Name (e.g., Buy a Car)"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input 
          type="number"
          placeholder="Target Amount ($)"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input 
          type="date"
          value={goalDeadline}
          onChange={(e) => setGoalDeadline(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={addGoal}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
        >
          ➕ Add Goal
        </button>
      </div>

      {/* PDF Download Button */}
      <button 
        onClick={downloadPDF} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
      >
        📄 Download Goals Report
      </button>

      {/* Goals Summary */}
      <div id="goals-report" className="bg-white border rounded-lg shadow p-6 space-y-6 mt-4">
        <h2 className="text-xl font-semibold">Your Financial Goals</h2>

        {goals.length === 0 ? (
          <p className="text-gray-500">You have not set any goals yet.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="p-4 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{goal.name}</h3>
              <p>🎯 Target: <span className="font-bold">${goal.amount}</span></p>
              <p>📅 Deadline: <span className="font-bold">{goal.deadline}</span></p>
              <p>💰 Current Savings: <span className="font-bold">${savings}</span></p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div 
                  className={`h-4 rounded-full transition-all ${goal.progress >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Progress: <span className={`font-bold ${goal.progress >= 100 ? "text-green-600" : "text-blue-600"}`}>
                  {goal.progress.toFixed(2)}%
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
