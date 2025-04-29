const express    = require('express');
const sqlite3    = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors       = require('cors');
const path       = require('path');

const DB_FILE = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_FILE);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize DB if not exists (or run `npm run init-db`)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY,
      date TEXT, type TEXT, timing TEXT, emoji TEXT
    )`);
  db.run(`
    CREATE TABLE IF NOT EXISTS birthdays (
      id INTEGER PRIMARY KEY,
      date TEXT, name TEXT
    )`);
});

// Get all shifts for a given month: /api/shifts?year=2025&month=4
app.get('/api/shifts', (req, res) => {
  const { year, month } = req.query;
  const prefix = `${year}-${month}-`;
  db.all(
    `SELECT date, type, timing, emoji FROM shifts WHERE date LIKE ?`,
    [prefix + '%'],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const out = {};
      rows.forEach(r => { out[r.date] = r; });
      res.json(out);
    }
  );
});

// Upsert a shift
app.post('/api/shifts', (req, res) => {
  const { date, type, timing, emoji } = req.body;
  db.run(
    `INSERT INTO shifts(date,type,timing,emoji) 
     VALUES(?,?,?,?)
     ON CONFLICT(date) DO UPDATE SET
       type=excluded.type, timing=excluded.timing, emoji=excluded.emoji`,
    [date, type, timing, emoji],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Delete a shift
app.delete('/api/shifts', (req, res) => {
  const { date } = req.body;
  db.run(`DELETE FROM shifts WHERE date = ?`, [date], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Birthdays endpoints
app.get('/api/birthdays', (req, res) => {
  const { year, month } = req.query;
  const prefix = `${year}-${month}-`;
  db.all(
    `SELECT date, name FROM birthdays WHERE date LIKE ?`,
    [prefix + '%'],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const out = {};
      rows.forEach(r => { out[r.date] = r.name; });
      res.json(out);
    }
  );
});

app.post('/api/birthdays', (req, res) => {
  const { date, name } = req.body;
  db.run(
    `INSERT INTO birthdays(date,name)
     VALUES(?,?)
     ON CONFLICT(date) DO UPDATE SET name=excluded.name`,
    [date, name],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/birthdays', (req, res) => {
  const { date } = req.body;
  db.run(`DELETE FROM birthdays WHERE date = ?`, [date], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
