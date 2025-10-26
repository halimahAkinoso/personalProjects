import React from 'react';
import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  return (
    <ul className="expense-list">
      {expenses.map(expense => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDeleteExpense} onEdit={onEditExpense} />
      ))}
    </ul>
  );
}

export default ExpenseList;