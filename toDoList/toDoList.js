document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filters = document.getElementById('filters');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });

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
            li.querySelector('.complete-task').addEventListener('change', () => {
                task.completed = !task.completed;
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
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            id: Date.now(),
            name: document.getElementById('task-name').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-due-date').value,
            completed: false
        };
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