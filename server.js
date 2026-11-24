const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const FILE = './attendees.json';
const read = () => JSON.parse(fs.readFileSync(FILE, 'utf8'));
const write = (d) => fs.writeFileSync(FILE, JSON.stringify(d, null, 2));

app.get('/attendees', (req, res) => res.json(read()));

app.post('/attendees', (req, res) => {
  const { name, event, ticketType, price } = req.body;
  if (!name || !event || !ticketType || price === undefined || price === '')
    return res.status(400).json({ error: 'All fields required' });
  const attendee = { id: Date.now(), name, event, ticketType, price: Number(price) };
  const list = [...read(), attendee];
  write(list);
  res.status(201).json(attendee);
});

app.delete('/attendees/:id', (req, res) => {
  const list = read().filter(a => a.id !== Number(req.params.id));
  write(list);
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
