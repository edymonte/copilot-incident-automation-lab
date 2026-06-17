const express = require('express');

const app = express();
app.use(express.json());

// Valid ticket statuses
const VALID_STATUSES = ['open', 'in-progress', 'resolved', 'closed'];

// Store tickets in memory for the demo
const tickets = new Map();

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /tickets — create a new ticket
app.post('/tickets', (req, res) => {
  const { title, status, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  // BUG (Phase 1): status validation is missing — any status is accepted
  // The fix should validate: if (!VALID_STATUSES.includes(status)) return 400
  const ticket = {
    id: Date.now().toString(),
    title,
    status: status || 'open',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
  };

  tickets.set(ticket.id, ticket);
  res.status(201).json(ticket);
});

// GET /tickets/:id — retrieve a ticket
app.get('/tickets/:id', (req, res) => {
  const ticket = tickets.get(req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  res.json(ticket);
});

// PATCH /tickets/:id — update ticket status
app.patch('/tickets/:id', (req, res) => {
  const ticket = tickets.get(req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const { status } = req.body;

  // BUG (Phase 1): same missing validation here
  if (status) {
    ticket.status = status;
  }

  res.json(ticket);
});

// GET /tickets — list all tickets
app.get('/tickets', (req, res) => {
  res.json(Array.from(tickets.values()));
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Ticket API running on port ${PORT}`);
  });
}

module.exports = { app, VALID_STATUSES };
