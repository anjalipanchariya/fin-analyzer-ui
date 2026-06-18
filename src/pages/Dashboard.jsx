import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaTrash,
  FaUserCircle,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaChartLine,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import "../styles/Dashboard.css";

const COLORS = ["#6C63FF", "#00C49F", "#FF8042", "#FFBB28", "#0088FE"];
const CATEGORIES = [
  "FOOD",
  "PETROL",
  "ENTERTAINMENT",
  "SHOPPING",
  "SALARY",
  "OTHER",
  "RECHARGE",
  "UTILITIES",
  "INVESTMENT",
  "TRANSPORT",
];

function Dashboard() {
  const [dashboard, setDashboard] = useState({});
  const [health, setHealth] = useState({});
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        dashboardRes,
        healthRes,
        trendRes,
        categoryRes,
        transactionRes,
        aiRes,
      ] = await Promise.all([
        api.get("/dashboard"),
        api.get("/financial-health"),
        api.get("/monthly-trend"),
        api.get("/category-breakdown"),
        api.get("/transactions/list"),
      ]);

      setDashboard(dashboardRes.data);
      setHealth(healthRes.data);
      setMonthlyTrend(trendRes.data);
      setCategories(categoryRes.data);
      setTransactions(transactionRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(
        `/transactions/${selectedTransaction.transactionId}`,
        selectedTransaction
      );
      setShowEditModal(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (transactionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/transactions/${transactionId}`);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <h1>Fin Analyzer</h1>
        <Link to="/add-transaction" className="add-btn">
          + Add Transaction
        </Link>
        <div className="profile-wrapper">
          <FaUserCircle
            className="profile-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="profile-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card income">
          <FaArrowUp />
          <h3>Total Income</h3>
          <h2>₹ {dashboard.totalIncome}</h2>
        </div>

        <div className="stat-card expense">
          <FaArrowDown />
          <h3>Total Expense</h3>
          <h2>₹ {dashboard.totalExpense}</h2>
        </div>

        <div className="stat-card savings">
          <FaWallet />
          <h3>Savings</h3>
          <h2>₹ {dashboard.savings}</h2>
        </div>

        <div className="stat-card score">
          <FaChartLine />
          <h3>Health Score</h3>
          <h2>{health.score}/100</h2>
        </div>
      </div>

      <div className="content-grid">
        <div className="panel">
          <h3>Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#6C63FF"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="amount"
                nameKey="category"
                outerRadius={100}
              >
                {categories.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel transaction-panel">
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.transactionId}>
                  <td>{t.transactionDate}</td>
                  <td>{t.description}</td>
                  <td>{t.category}</td>
                  <td>₹ {t.amount}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(t)}>
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(t.transactionId)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Financial Health</h3>
          <div className="health-circle">{health.score}</div>
          <p>
            Status: <strong> {health.status}</strong>
          </p>
          <p>
            Savings Rate: <strong> {health.savingsRate}%</strong>
          </p>
          <p>
            Top Expense: <strong> {dashboard.topExpenseCategory}</strong>
          </p>
        </div>
      </div>

      <button className="ai-chat-btn"
              onClick={async () => {
                  try {
                    setLoadingAi(true);
                    setShowAiChat(true);
                    const res = await api.get("/ai-insights");
                    setAiInsights(res.data.insights);
                  } catch (error) {
                    console.error(error);
                  } finally {
                         setLoadingAi(false);
                  }
                }}
      >
        🤖 AI Insights
      </button>
      {showEditModal && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Transaction</h3>
            <input
              type="text"
              value={selectedTransaction.description}
              onChange={(e) =>
                setSelectedTransaction({
                  ...selectedTransaction,
                  description: e.target.value,
                })
              }
            />
            <select
              value={selectedTransaction.category}
              onChange={(e) =>
                setSelectedTransaction({
                  ...selectedTransaction,
                  category: e.target.value,
                })
              }
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedTransaction.transactionType}
              onChange={(e) =>
                setSelectedTransaction({
                  ...selectedTransaction,
                  transactionType: e.target.value,
                })
              }
            >
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>

            <input
              type="number"
              value={selectedTransaction.amount}
              onChange={(e) =>
                setSelectedTransaction({
                  ...selectedTransaction,
                  amount: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
        {showAiChat && (
          <div className="ai-modal-overlay">

            <div className="ai-modal">

              <div className="ai-header">

                <h2>🤖 AI Financial Coach</h2>

                <button
                  className="ai-close"
                  onClick={() => setShowAiChat(false)}
                >
                  ✕
                </button>

              </div>

               <div className="ai-body">
                 {loadingAi ? (
                   <div className="loader-container">
                     <div className="loader"></div>
                     <p>🤖 Analyzing your finances...</p>
                   </div>

                 ) : (

                   <div
                     className="ai-message"
                     style={{ whiteSpace: "pre-line" }}
                   >
                     {aiInsights}
                   </div>
                 )}
               </div>

            </div>

          </div>
        )}
    </div>
  );
}

export default Dashboard;
