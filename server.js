const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const RESUME_FILE = path.join(DATA_DIR, 'resume.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json');

// Helper to safely read JSON
function readJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// Helper to safely write JSON (graceful fallback on Vercel read-only FS)
function writeJson(filePath, data) {
  try {
    if (process.env.VERCEL) {
      // Vercel has read-only filesystem; writes go to in-memory store
      memoryStore[filePath] = data;
      return true;
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    memoryStore[filePath] = data; // fallback to memory
    return true;
  }
}

// In-memory fallback store for serverless environments
const memoryStore = {};

let visitorCount = 42;

// API Routes
app.get('/api/resume', (req, res) => {
  const resume = readJson(RESUME_FILE, {});
  res.json(resume);
});

app.get('/api/messages', (req, res) => {
  const messages = readJson(MESSAGES_FILE, []);
  res.json(messages);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message, company } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const messages = readJson(MESSAGES_FILE, []);
  const newMsg = {
    id: `msg-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    company: company ? company.trim() : 'Recruiter / Visitor',
    message: message.trim(),
    timestamp: new Date().toISOString()
  };

  messages.unshift(newMsg);
  writeJson(MESSAGES_FILE, messages);

  res.status(201).json({
    success: true,
    message: 'Message received and stored in Kushal\'s quest inbox! Thank you.',
    data: newMsg
  });
});

app.get('/api/guestbook', (req, res) => {
  const entries = readJson(GUESTBOOK_FILE, []);
  res.json(entries);
});

app.post('/api/guestbook', (req, res) => {
  const { name, score, comment } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Player name is required.' });
  }

  const entries = readJson(GUESTBOOK_FILE, []);
  const newEntry = {
    id: `entry-${Date.now()}`,
    name: name.trim().slice(0, 24),
    score: Number(score) || 0,
    comment: (comment || 'Visited the game portfolio!').trim().slice(0, 140),
    date: new Date().toISOString().split('T')[0]
  };

  entries.push(newEntry);
  entries.sort((a, b) => b.score - a.score);
  writeJson(GUESTBOOK_FILE, entries);

  res.status(201).json({ success: true, data: newEntry });
});

app.get('/api/stats', (req, res) => {
  visitorCount++;
  const messages = readJson(MESSAGES_FILE, []);
  const guestbook = readJson(GUESTBOOK_FILE, []);
  res.json({
    visitors: visitorCount,
    messagesCount: messages.length,
    guestbookEntries: guestbook.length,
    topScore: guestbook.length > 0 ? Math.max(...guestbook.map(e => e.score || 0)) : 1420,
    status: 'Ready for full-time & internship opportunities',
    location: 'NIT Manipur & Dausa, Rajasthan'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🎮 Kushal Tiwari's Game Portfolio is Live!`);
    console.log(`👉 Open in your browser: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(PORT) + 1;
      console.log(`\n⚠️ Port ${PORT} is currently in use.`);
      console.log(`🔄 Automatically switching to Port ${nextPort}...\n`);
      app.listen(nextPort, () => {
        console.log(`======================================================`);
        console.log(`🎮 Kushal Tiwari's Game Portfolio is Live!`);
        console.log(`👉 Open in your browser: http://localhost:${nextPort}`);
        console.log(`======================================================\n`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
