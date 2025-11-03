import React, { useState } from 'react';
import Header from '../src/components/Header';
import AddExpenseForm from '../src/components/AddExpenseForm';
import CategoryFilter from '../src/components/CategoryFilter';
import ExpenseStats from '../src/components/ExpenseStats';
import ExpenseList from '../src/components/ExpenseList';
import '../src/components/ExpenseTracker.css';


function App () {

const [expenses, setExpenses] = useState([
    { id: 1, description: 'Lunch at Mama Put', amount: 1500, category: "Food", date: "2025-01-15"
     },
     { id: 2, description: 'Detergent At the Ace Supermarket', amount: 2500, category: "Soap", date: "2025-05-15"
     },
     { id: 3, description: 'Tea and Milk at the market', amount: 10500, category: "Provision", date: "2025-10-15"
     }
]);

//  const [filter, setFilter] = useState('all')
   const [filter, setFilter] = useState('All');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({});

  const filteredExpenses = filter === 'All'
  ? expenses
  : expenses.filter(expense => expense.category === filter);
  

  // Add new expenses

   const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || amount <= 0) {
      alert("Description cannot be empty and amount must be greater than zero.");
      return;
    }
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().slice(0, 10),
    };
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
    setCategory('Food');
  };
// Delete task
  function handleDeleteExpense (id) {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  function handleEditClick (expense) {
    setIsEditing(true);
    setCurrentExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount);
    setCategory(expense.category);
  };

  function handleUpdateExpense (e)  {
    e.preventDefault();
    setExpenses(expenses.map(expense =>
      expense.id === currentExpense.id
        ? { ...expense, description, amount: parseFloat(amount), category }
        : expense
    ));
    setIsEditing(false);
    setCurrentExpense({});
    setDescription('');
    setAmount('');
    setCategory('Food');
  };

  function handleFilter (category) {
    setFilter(category);
  };


  return (
  <div className="app">
    {/* Header at the top */}
    <Header />

    {/* Stats summary below header */}
    <ExpenseStats expenses={expenses} />

    {/* Add Expense Form */}
    <form className="add-expense-form" onSubmit={isEditing ? handleUpdateExpense : handleAddExpense}>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (N)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select className="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Others">Others</option>
      </select>
      <button type="submit">{isEditing ? 'Update Expense' : 'Add Expense'}</button>
    </form>

    {/* Filter Buttons */}
    <div className="category-filter">
      <button onClick={() => handleFilter('All')}>All</button>
      <button onClick={() => handleFilter('Food')}>Food</button>
      <button onClick={() => handleFilter('Transport')}>Transport</button>
      <button onClick={() => handleFilter('Bills')}>Bills</button>
      <button onClick={() => handleFilter('Entertainment')}>Entertainment</button>
      <button onClick={() => handleFilter('Others')}>Others</button>
    </div>

    {/* Expense List */}
    <ul className="expense-list">
      {filteredExpenses.map((expense) => (
        <li key={expense.id} className={`expense-item ${expense.category.toLowerCase()}`}>
          <div className="expense-details">
            <p className="expense-description">{expense.description}</p>
            <p className="expense-amount">N{expense.amount.toFixed(2)}</p>
            <p className="expense-meta">{expense.category}</p>
            <p className="expense-meta">{expense.date}</p>
          </div>
          <div className="expense-actions">
            <button className="edit-btn" onClick={() => handleEditClick(expense)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => handleDeleteExpense(expense.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

  }

export default App