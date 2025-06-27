const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Serve static files BEFORE other routes
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


// ✅ Default route should go LAST or REMOVE this entirely
// If you keep it, do NOT let it override static
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/learn', (req, res) => {
  res.sendFile(__dirname + '/public/learn.html');
});


// ✅ Start server
app.listen(PORT, () => {
  console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get('/api/contents', async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM contents WHERE visible = 1 ORDER BY created_at DESC");
    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch contents" });
  }
});

app.get('/api/contents/:id', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contents WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

