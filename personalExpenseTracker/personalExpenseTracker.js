document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseTableBody = document.querySelector('#expense-table tbody');
    const totalSpentSpan = document.getElementById('total-spent');
    const filterCategorySelect = document.getElementById('filter-category');
    const budgetLimitInput = document.getElementById('budget-limit');
    const budgetAlertDiv = document.getElementById('budget-alert');

    let expenses = [];
    let budgetLimit = 0;

    // Load data from local storage
    if (localStorage.getItem('expenses')) {
        expenses = JSON.parse(localStorage.getItem('expenses'));
    }
    if (localStorage.getItem('budgetLimit')) {
        budgetLimit = parseFloat(localStorage.getItem('budgetLimit'));
        budgetLimitInput.value = budgetLimit;
    }

    function renderExpenses(filteredExpenses = expenses) {
        expenseTableBody.innerHTML = '';
        let total = 0;

        filteredExpenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount}</td>
                <td class="category-${expense.category}">${expense.category}</td>
                <td>${expense.date}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            `;
            expenseTableBody.appendChild(row);
            total += expense.amount;
        });

        totalSpentSpan.textContent = total;
        updateBudgetAlert(total);
    }

    function updateBudgetAlert(total) {
        if (budgetLimit > 0 && total > budgetLimit * 0.8) {
            budgetAlertDiv.textContent = `Warning: You have spent ${total}₦, which is over 80% of your budget limit of ${budgetLimit}₦!`;
            budgetAlertDiv.classList.remove('hidden');
        } else {
            budgetAlertDiv.classList.add('hidden');
        }
    }

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const expense = {
            name: document.getElementById('expense-name').value,
            amount: parseFloat(document.getElementById('expense-amount').value),
            category: document.getElementById('expense-category').value,
            date: document.getElementById('expense-date').value
        };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        expenseForm.reset();
    });

    expenseTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
        }
    });

    filterCategorySelect.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === 'All') {
            renderExpenses();
        } else {
            const filtered = expenses.filter(expense => expense.category === selectedCategory);
            renderExpenses(filtered);
        }
    });

    budgetLimitInput.addEventListener('change', (e) => {
        budgetLimit = parseFloat(e.target.value) || 0;
        localStorage.setItem('budgetLimit', budgetLimit);
        renderExpenses();
    });

    renderExpenses();
});