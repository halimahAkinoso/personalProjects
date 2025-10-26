import React from 'react';

function ExpenseStats({ expenses }) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const numExpenses = expenses.length;
  const highestExpense = Math.max(...expenses.map(exp => exp.amount), 0);

  return (
    <div className="expense-stats">
      <p>Total Amount Spent: N{totalAmount.toFixed(2)}</p>
      <p>Number of Expenses: {numExpenses}</p>
      <p>Highest Single Expense: N{highestExpense.toFixed(2)}</p>
    </div>
  );
}

export default ExpenseStats;