import React from 'react';

function ExpenseItem({ expense, onDelete, onEdit }) {
  const categoryColors = {
    Food: 'red',
    Transport: 'blue',
    Bills: 'green',
    Entertainment: 'purple',
    Others: 'gray',
  };

  const itemStyle = {
    backgroundColor: categoryColors[expense.category],
  };

  return (
    <li style={itemStyle}>
      <span>{expense.description}</span>
      <span>N{expense.amount.toFixed(2)}</span>
      <span>{expense.category}</span>
      <span>{expense.date}</span>
      <button onClick={() => onDelete(expense.id)}>Delete</button>
      <button onClick={() => onEdit(expense.id)}>Edit</button>
    </li>
  );
}

export default ExpenseItem;