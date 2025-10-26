document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filters = document.getElementById('filters');
    // Loads 'tasks' from localStorage, or uses an empty array if nothing is saved

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
// The 'filter' parameter tells  what to show
    const renderTasks = (filter = 'all') => {
     // Clear the old list
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });
        // loop through and display ONLY the tasks in the 'filteredTasks' array

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-details">
                    <strong>${task.name}</strong> - Due: ${task.dueDate} (Priority: ${task.priority})
                </div>
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="complete-task">
                    <button class="delete-task">Delete</button>
                </div>
            `;
    // ... update task.completed ...

            li.querySelector('.complete-task').addEventListener('change', () => {
    // Directly changes a property of a task object within the 'tasks' state
                task.completed = !task.completed;
     // Call the helper function to save
                saveTasks();
                renderTasks(filters.querySelector('.active')?.dataset.filter);
            });
            li.querySelector('.delete-task').addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks(filters.querySelector('.active')?.dataset.filter);
            });
            taskList.appendChild(li);
        });
    };

    const saveTasks = () => {
// Convert the 'tasks' array to a JSON string and save it

        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    // ... later, inside event listeners ...

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Create a new task object
        const newTask = {
            id: Date.now(),
            name: document.getElementById('task-name').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-due-date').value,
            completed: false
        };
        // Add the new task to our 'tasks' array (the state)
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        form.reset();
    });

    filters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            document.querySelectorAll('#filters button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderTasks(e.target.dataset.filter);
        }
    });

    renderTasks();
});