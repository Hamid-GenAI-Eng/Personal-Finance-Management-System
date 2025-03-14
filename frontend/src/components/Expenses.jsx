import { useState, useReducer } from "react";
import { Pencil, Trash } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./Expenses.css"; // Importing the CSS file

const expenseReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [{ id: Date.now(), name: action.name, amount: parseFloat(action.amount) }, ...state];
    case "EDIT":
      return state.map((expense) =>
        expense.id === action.id ? { ...expense, name: action.name, amount: parseFloat(action.amount) } : expense
      );
    case "DELETE":
      return state.filter((expense) => expense.id !== action.id);
    default:
      return state;
  }
};

export default function ExpenseManager() {
  const [expenses, dispatch] = useReducer(expenseReducer, []);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = () => {
    if (editingId) {
      dispatch({ type: "EDIT", id: editingId, name, amount });
      setEditingId(null);
    } else {
      const newExpense = { id: Date.now(), name, amount };
      dispatch({ type: "ADD", ...newExpense });
      setHistory((prev) => [newExpense, ...prev]);
    }
    setName("");
    setAmount("");
  };

  const handleEdit = (expense) => {
    setName(expense.name);
    setAmount(expense.amount);
    setEditingId(expense.id);
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(search.toLowerCase())
  );

  // Prepare data for the line chart (group by date)
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
      {/* Navbar */}
      <nav className="navbar">
      <div className="company-container">
      <img src="Finovalogo.png" alt="Logo" className="logo" />
      <div className="company-text">
        <div className="company-name">Finova</div>
        <div className="slogan">Secure your wealth, Elevate your life</div>
      </div>
    </div>
        <h1 className="navbar-title">Expense Manager</h1>
        <input
          className="search-bar"
          type="text"
          placeholder="Search Expenses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      {/* Main Content with Sidebar Chart */}
      <div className="main-content">
        {/* Chart Section */} 
        <div className="chart-container">
          <h2 className="chart-title">Expense Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="amount" stroke="#ff4500" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Management Section */}
        <div className="expense-section">
          <div className="input-container">
            <input
              className="input-field"
              placeholder="Expense Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="btn" onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </button>
          </div>

          <ul className="expense-list">
          <h2 className="history-title">History</h2>
            {filteredExpenses.map((expense) => (
              <li key={expense.id} className="expense-item">
                <div>
                  <span className="expense-name">{expense.name}</span> - ${expense.amount} -  (Added at {new Date(expense.id).toLocaleTimeString()})
                </div>
                <div className="btn-group">
                  <button onClick={() => handleEdit(expense)} className="edit-btn">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => dispatch({ type: "DELETE", id: expense.id })} className="delete-btn">
                    <Trash size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
