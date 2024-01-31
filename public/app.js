document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const taskList = document.getElementById('taskList');

    const fetchTasks = async () => {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();

        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.description;

            // Add Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTask(task.id, task.description));
            li.appendChild(editButton);

            // Add Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    };

    todoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const taskInput = document.getElementById('task');
        const description = taskInput.value;

        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
        });

        fetchTasks();

        taskInput.value = '';
    });

    // Function to handle editing a task
    const editTask = async (taskId, currentDescription) => {
        const newDescription = prompt('Edit task:', currentDescription);

        if (newDescription !== null) {
            await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: newDescription }),
            });

            fetchTasks();
        }
    };

    // Function to handle deleting a task
    const deleteTask = async (taskId) => {
        const confirmDelete = confirm('Are you sure you want to delete this task?');

        if (confirmDelete) {
            await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'DELETE',
            });

            fetchTasks();
        }
    };

    fetchTasks();
});
