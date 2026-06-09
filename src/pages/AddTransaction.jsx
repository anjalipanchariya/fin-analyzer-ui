import { useState } from "react";
import api from "../services/api";
import "../styles/AddTransaction.css";

function AddTransaction() {

const [amount, setAmount] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("FOOD");
const [transactionType, setTransactionType] = useState("EXPENSE");

const handleSubmit = async (e) => {
e.preventDefault();

try {

  await api.post("/transactions/saveTransaction", {
    amount,
    description,
    category,
    transactionType,
    userId: 1
  });

  alert("Transaction Added Successfully");

  setAmount("");
  setDescription("");
  setCategory("");
  setTransactionType("");

} catch (error) {
  console.error(error);
  alert("Failed to add transaction");
}

};

return ( <div className="transaction-page">

  <div className="transaction-card">

    <h1>Add Transaction</h1>

    <form onSubmit={handleSubmit}>

      <div className="form-group">
        <label>Amount</label>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>

        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          required
        />
      </div>

      <div className="form-group">

        <label>Category</label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="FOOD">
            FOOD
          </option>

          <option value="PETROL">
            PETROL
          </option>

          <option value="ENTERTAINMENT">
            ENTERTAINMENT
          </option>

          <option value="SHOPPING">
            SHOPPING
          </option>

          <option value="SALARY">
            SALARY
          </option>

          <option value="RECHARGE">
            RECHARGE
          </option>

          <option value="UTILITIES">
            UTILITIES
          </option>

          <option value="INVESTMENT">
            INVESTMENT
          </option>

          <option value="OTHER">
            OTHER
          </option>

        </select>

      </div>

      <div className="form-group">

        <label>Type</label>

        <select
          value={transactionType}
          onChange={(e) =>
            setTransactionType(e.target.value)
          }
        >

          <option value="EXPENSE">
            EXPENSE
          </option>

          <option value="INCOME">
            INCOME
          </option>

        </select>

      </div>

      <button
        type="submit"
        className="submit-btn"
      >
        Add Transaction
      </button>

    </form>

  </div>

</div>

);
}

export default AddTransaction;
