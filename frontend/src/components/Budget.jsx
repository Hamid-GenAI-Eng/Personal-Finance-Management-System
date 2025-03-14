import { useState, useReducer } from "react";
import { Pencil, Trash } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./Budget.css"; 

const budgetReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [{ id: Date.now(), name: action.name, amount: parseFloat(action.amount) }, ...state];
    case "EDIT":
      return state.map((budget) =>
        budget.id === action.id ? { ...budget, name: action.name, amount: parseFloat(action.amount) } : budget
      );
    case "DELETE":
      return state.filter((budget) => budget.id !== action.id);
    default:
      return state;
  }
};

export default function BudgetManager() {
  const [budgets, dispatch] = useReducer(budgetReducer, []);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = () => {
    if (!name.trim() || !amount.trim()) return; 
    if (editingId) {
      dispatch({ type: "EDIT", id: editingId, name, amount });
      setEditingId(null); 
    } else {
      const newBudget = { id: Date.now(), name, amount };
      dispatch({ type: "ADD", ...newBudget });
      setHistory((prev) => [newBudget, ...prev]);
    }
    setName("");
    setAmount("");
  };

  const handleEdit = (budget) => {
    setName(budget.name);
    setAmount(budget.amount);
    setEditingId(budget.id);
  };

  const filteredBudgets = budgets.filter((budget) =>
    budget.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const chartData = history.reduce((acc, item) => {
    const date = new Date(item.id).toLocaleDateString();
    const existing = acc.find((data) => data.date === date);
    if (existing) {
      existing.amount += parseFloat(item.amount);
    } else {
      acc.push({ date, amount: parseFloat(item.amount) });
    }
    return acc;
  }, []);

  return ( 
    <div className="container">
      <nav className="navbar">
        <div className="company-container">
          <img src="Finovalogo.png" alt="Logo" className="logo" />
          <div className="company-text">
            <div className="company-name">Finova</div>
            <div className="slogan">Secure your wealth, Elevate your life</div>
          </div>
        </div>
        <h1 className="navbar-title">Budget Manager</h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search Budget"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>
      <div className="main-content">
        <div className="chart-container">
          <h2 className="chart-title">Budget Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="amount" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="budget-section">
          <div className="input-container">
            <input className="input-field" placeholder="Budget Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input-field" placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button className="btn" onClick={handleSubmit}>{editingId ? "Update" : "Add"}</button>
          </div>
          <ul className="budget-list">
          <h2 className="history-title">History</h2>
            {filteredBudgets.map((budget) => (
              <li key={budget.id} className="budget-item">
                <div>
                  <span className="budget-name">{budget.name}</span> - PKR{budget.amount}     (Added at {new Date(budget.id).toLocaleTimeString()})
                </div>
                <div className="btn-group">
                  <button onClick={() => handleEdit(budget)} className="edit-btn"><Pencil size={18} /></button>
                  <button onClick={() => dispatch({ type: "DELETE", id: budget.id })} className="delete-btn"><Trash size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
