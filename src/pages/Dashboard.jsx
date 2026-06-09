import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
Tooltip
} from "recharts";

import {
FaArrowUp,
FaArrowDown,
FaWallet,
FaChartLine
} from "react-icons/fa";

import "../styles/Dashboard.css";

function Dashboard() {
const [dashboard, setDashboard] = useState({});
const [health, setHealth] = useState({});
const [monthlyTrend, setMonthlyTrend] = useState([]);
const [categories, setCategories] = useState([]);
const [transactions, setTransactions] = useState([]);
const [showMenu, setShowMenu] = useState(false);
const navigate = useNavigate();
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};

useEffect(() => {
loadData();
}, []);

const loadData = async () => {
try {
const dashboardRes =
await api.get("/dashboard");

  const healthRes =
    await api.get("/financial-health");

  const trendRes =
    await api.get("/monthly-trend");

  const categoryRes =
    await api.get("/category-breakdown");

  const transactionRes =
    await api.get("/transactions/list");

  setDashboard(dashboardRes.data);
  setHealth(healthRes.data);
  setMonthlyTrend(trendRes.data);
  setCategories(categoryRes.data);
  setTransactions(transactionRes.data);

} catch (error) {
  console.error(error);
}

};

const COLORS = [
"#6C63FF",
"#00C49F",
"#FF8042",
"#FFBB28",
"#0088FE"
];

return ( <div className="dashboard">

  <div className="topbar">
    <h1>Fin Analyzer</h1>
    <Link
        to="/add-transaction"
        className="add-btn"
      >
        + Add Transaction
      </Link>
    <div className="profile-wrapper">
      <FaUserCircle
        className="profile-icon"
        onClick={() => setShowMenu(!showMenu)}
      />
      {showMenu && (
        <div className="profile-menu">
          <button onClick={handleLogout}>
            Logout
          </button>
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
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
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
          </tr>
        </thead>

        <tbody>

          {transactions.map((t) => (
            <tr key={t.transactionId}>
              <td>{t.transactionDate}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>₹ {t.amount}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

    <div className="panel">

      <h3>Financial Health</h3>

      <div className="health-circle">
        {health.score}
      </div>

      <p>
        Status:
        <strong>
          {" "}
          {health.status}
        </strong>
      </p>

      <p>
        Savings Rate:
        <strong>
          {" "}
          {health.savingsRate}%
        </strong>
      </p>

      <p>
        Top Expense:
        <strong>
          {" "}
          {dashboard.topExpenseCategory}
        </strong>
      </p>

    </div>

  </div>

</div>

);
}

export default Dashboard;
