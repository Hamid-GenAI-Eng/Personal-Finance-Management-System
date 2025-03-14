import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvestmentTracker() {
  const [investments, setInvestments] = useState([]);
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [returns, setReturns] = useState("");

  // 📌 Function to add a new investment
  const addInvestment = () => {
    if (!company || !type || !amount || !returns) return alert("Please fill all fields!");

    const newInvestment = {
      id: Date.now(),
      company,
      type,
      amount: Number(amount),
      returns: Number(returns),
      date: new Date().toLocaleDateString(), // 📅 Auto-generate date
    };

    setInvestments([...investments, newInvestment]);
    setCompany("");
    setType("");
    setAmount("");
    setReturns("");
  };

  // 📌 Function to download PDF of investments
  const downloadInvestmentPDF = () => {
    const input = document.getElementById("investment-report");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Investment_Report.pdf");
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">📈 Investment Tracker</h1>

      {/* Input Fields for Adding Investments */}
      <div className="p-4 bg-white border rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Add New Investment</h2>
        <input 
          type="text"
          placeholder="Company Name (e.g., Tesla)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Investment Type</option>
          <option value="Stocks">📊 Stocks</option>
          <option value="Crypto">💰 Crypto</option>
          <option value="Real Estate">🏡 Real Estate</option>
          <option value="Bonds">💵 Bonds</option>
          <option value="Mutual Funds">📈 Mutual Funds</option>
        </select>
        <input 
          type="number"
          placeholder="Investment Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input 
          type="number"
          placeholder="Expected Returns (%)"
          value={returns}
          onChange={(e) => setReturns(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button 
          onClick={addInvestment}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
        >
          ➕ Add Investment
        </button>
      </div>

      {/* PDF Download Button */}
      <button 
        onClick={downloadInvestmentPDF} 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
      >
        📄 Download Investment Report
      </button>

      {/* Investments Summary */}
      <div id="investment-report" className="bg-white border rounded-lg shadow p-6 space-y-6 mt-4">
        <h2 className="text-xl font-semibold">Your Investments</h2>

        {investments.length === 0 ? (
          <p className="text-gray-500">No investments added yet.</p>
        ) : (
          investments.map((inv) => (
            <div key={inv.id} className="p-4 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{inv.company} - {inv.type}</h3>
              <p>💰 Investment: <span className="font-bold">${inv.amount}</span></p>
              <p>📈 Returns: <span className="font-bold">{inv.returns}%</span></p>
              <p>📅 Date: <span className="font-bold">{inv.date}</span></p>
              <p className={`text-sm font-bold ${inv.returns >= 0 ? "text-green-600" : "text-red-600"}`}>
                {inv.returns >= 0 ? "Profit Expected" : "Potential Loss"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
