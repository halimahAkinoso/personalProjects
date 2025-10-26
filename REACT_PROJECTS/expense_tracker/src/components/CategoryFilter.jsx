import React from 'react';

function CategoryFilter({ onFilterChange }) {
  const categories = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Others'];
  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button key={cat} onClick={() => onFilterChange(cat)}>{cat}</button>
      ))}
    </div>
  );
}

export default CategoryFilter;