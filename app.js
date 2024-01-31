const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'ryshu',
    host: 'todoapp.postgres.database.azure.com',
    database: 'todoapp',
    password: 'hello@WORLD1',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Use only during development. Remove for production.
    },
});

app.use(express.static('public'));
app.use(express.json());

// Retrieve all tasks
app.get('/tasks', async (req, res) => {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tasks');
    const tasks = result.rows;
    client.release();
    res.json(tasks);
});

// Add a new task
app.post('/tasks', async (req, res) => {
    const { description } = req.body;

    const client = await pool.connect();
    const result = await client.query('INSERT INTO tasks (description) VALUES ($1) RETURNING *', [description]);
    const newTask = result.rows[0];
    client.release();
    res.json(newTask);
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const { description } = req.body;

    const client = await pool.connect();
    const result = await client.query('UPDATE tasks SET description = $1 WHERE id = $2 RETURNING *', [description, taskId]);
    const updatedTask = result.rows[0];
    client.release();
    res.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;

    const client = await pool.connect();
    await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    client.release();
    res.json({ message: 'Task deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
