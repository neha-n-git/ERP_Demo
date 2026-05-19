const express = require('express');
const { SupportTicket, Startup } = require('../models');
const { sendMentoringRequest } = require('../services/email');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// ═══ SUPPORT TICKETS ═══

// GET /api/support/tickets
router.get('/tickets', async (req, res) => {
  try {
    const { status, type, startup_id } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (startup_id) where.startup_id = startup_id;

    const tickets = await SupportTicket.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name'] }],
    });
    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets.' });
  }
});

// POST /api/support/tickets
router.post('/tickets', async (req, res) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    const full = await SupportTicket.findByPk(ticket.id, {
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name'] }],
    });
    res.status(201).json({ ticket: full });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket.' });
  }
});

// PUT /api/support/tickets/:id
router.put('/tickets/:id', async (req, res) => {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    await ticket.update(req.body);
    res.json({ ticket });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Failed to update ticket.' });
  }
});

// ═══ MENTORING REQUEST ═══

// POST /api/support/mentoring
router.post('/mentoring', async (req, res) => {
  try {
    const { startup_name, contact_person, description, preferred_dates } = req.body;
    if (!startup_name || !contact_person || !description) {
      return res.status(400).json({ error: 'Startup name, contact person, and description are required.' });
    }
    const result = await sendMentoringRequest(startup_name, contact_person, description, preferred_dates || 'Flexible');
    res.json({ message: 'Mentoring request sent successfully.', result });
  } catch (error) {
    console.error('Mentoring request error:', error);
    res.status(500).json({ error: 'Failed to send mentoring request.' });
  }
});

module.exports = router;
