const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Database setup
const db = new sqlite3.Database('investments.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS investments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            investment TEXT NOT NULL,
            accountNumber TEXT NOT NULL,
            name TEXT NOT NULL,
            investmentDate TEXT NOT NULL,
            maturityDate TEXT NOT NULL,
            investedAmount REAL NOT NULL,
            interestRate REAL NOT NULL,
            maturedAmount REAL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Investments table verified/created successfully');
            }
        });
    }
});

// API Endpoints

// Get all investments
app.get('/api/investments', (req, res) => {
    db.all('SELECT * FROM investments ORDER BY createdAt DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Search investments by name
app.get('/api/investments/search/:name', (req, res) => {
    const searchName = req.params.name;
    db.all('SELECT * FROM investments WHERE name = ? ORDER BY createdAt DESC', [searchName], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get investment by ID
app.get('/api/investments/:id', (req, res) => {
    db.get('SELECT * FROM investments WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// Add new investment
app.post('/api/investments', (req, res) => {
    const {
        type,
        investment,
        accountNumber,
        name,
        investmentDate,
        maturityDate,
        investedAmount,
        interestRate,
        maturedAmount
    } = req.body;

    const sql = `INSERT INTO investments (
        type, investment, accountNumber, name, 
        investmentDate, maturityDate, investedAmount, 
        interestRate, maturedAmount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        type, investment, accountNumber, name,
        investmentDate, maturityDate, investedAmount,
        interestRate, maturedAmount
    ], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            id: this.lastID,
            message: 'Investment added successfully'
        });
    });
});

// Update investment
app.put('/api/investments/:id', (req, res) => {
    const {
        type,
        investment,
        accountNumber,
        name,
        investmentDate,
        maturityDate,
        investedAmount,
        interestRate,
        maturedAmount
    } = req.body;

    const sql = `UPDATE investments SET 
        type = ?, 
        investment = ?, 
        accountNumber = ?, 
        name = ?, 
        investmentDate = ?, 
        maturityDate = ?, 
        investedAmount = ?, 
        interestRate = ?, 
        maturedAmount = ?
        WHERE id = ?`;

    db.run(sql, [
        type, investment, accountNumber, name,
        investmentDate, maturityDate, investedAmount,
        interestRate, maturedAmount, req.params.id
    ], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Investment updated successfully',
            changes: this.changes
        });
    });
});

// Delete investment
app.delete('/api/investments/:id', (req, res) => {
    db.run('DELETE FROM investments WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Investment deleted successfully',
            changes: this.changes
        });
    });
});

const port = 3004;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 