require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ==================== PostgreSQL ====================

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
    updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
  )
`).then(() => console.log('PostgreSQL table ready'));

app.post('/api/pg/users', async (req, res) => {
  const { first_name, last_name, age } = req.body;
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, age)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [first_name, last_name, age]
  );
  res.status(201).json(result.rows[0]);
});

app.get('/api/pg/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users ORDER BY id');
  res.json(result.rows);
});

app.get('/api/pg/users/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
  res.json(result.rows[0]);
});

app.patch('/api/pg/users/:id', async (req, res) => {
  const { first_name, last_name, age } = req.body;
  const now = Math.floor(Date.now() / 1000);
  const result = await pool.query(
    `UPDATE users
     SET first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         age        = COALESCE($3, age),
         updated_at = $4
     WHERE id = $5
     RETURNING *`,
    [first_name, last_name, age, now, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
  res.json(result.rows[0]);
});

app.delete('/api/pg/users/:id', async (req, res) => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

// ==================== MongoDB ====================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  age:        { type: Number, required: true },
  created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  updated_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

const MongoUser = mongoose.model('User', userSchema);

app.post('/api/mongo/users', async (req, res) => {
  const user = new MongoUser(req.body);
  await user.save();
  res.status(201).json(user);
});

app.get('/api/mongo/users', async (req, res) => {
  const users = await MongoUser.find();
  res.json(users);
});

app.get('/api/mongo/users/:id', async (req, res) => {
  const user = await MongoUser.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.patch('/api/mongo/users/:id', async (req, res) => {
  const updates = { ...req.body, updated_at: Math.floor(Date.now() / 1000) };
  const user = await MongoUser.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.delete('/api/mongo/users/:id', async (req, res) => {
  const user = await MongoUser.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

// ==================== Start ====================

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
