const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'inventory.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

function readData() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) return reject(err);
      try {
        const json = JSON.parse(data || '[]');
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  });
}

function writeData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

app.get('/api/books', async (req, res) => {
  try {
    const books = await readData();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Unable to read data' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const books = await readData();
    const book = books.find(b => b.id === id);
    if (!book) return res.status(404).json({ error: 'Not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Unable to read data' });
  }
});

// Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const books = await readData();
    const book = req.body;
    if (!book || !book.title || !book.author) return res.status(400).json({ error: 'Invalid book' });
    const nextId = books.reduce((m, b) => Math.max(m, b.id || 0), 0) + 1;
    book.id = nextId;
    books.push(book);
    await writeData(books);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Unable to write data' });
  }
});

// Partial update
app.patch('/api/books/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const books = await readData();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const updated = Object.assign({}, books[idx], req.body);
    books[idx] = updated;
    await writeData(books);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update data' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    let books = await readData();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const removed = books.splice(idx, 1)[0];
    await writeData(books);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
