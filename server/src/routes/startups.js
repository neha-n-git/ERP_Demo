const express = require('express');
const { Op } = require('sequelize');
const { Startup, Member, Payment, Seat } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/startups — List all startups with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, industry } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { contact_name: { [Op.like]: `%${search}%` } },
        { contact_email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;
    if (industry) where.industry = industry;

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const { count, rows } = await Startup.findAndCountAll({
      where, offset, limit: parseInt(limit, 10),
      order: [['created_at', 'DESC']],
      include: [{ model: Member, as: 'members', attributes: ['id', 'full_name', 'status'] }],
    });

    res.json({ startups: rows, total: count, page: parseInt(page, 10), totalPages: Math.ceil(count / parseInt(limit, 10)) });
  } catch (error) {
    console.error('Get startups error:', error);
    res.status(500).json({ error: 'Failed to fetch startups.' });
  }
});

// GET /api/startups/stats — Dashboard summary statistics
router.get('/stats', async (req, res) => {
  try {
    const totalActive = await Startup.count({ where: { status: 'Active' } });
    const pendingApplications = await Startup.count({ where: { status: 'Pending Review' } });
    const totalSeats = await Seat.count();
    const occupiedSeats = await Seat.count({ where: { status: 'Occupied' } });

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const paymentsDue = await Payment.sum('total_amount', { where: { billing_month: currentMonth, status: { [Op.ne]: 'Paid' } } }) || 0;

    res.json({ totalActive, pendingApplications, totalSeats, occupiedSeats, paymentsDue, currentMonth });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// GET /api/startups/:id — Single startup detail
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findByPk(req.params.id, {
      include: [
        { model: Member, as: 'members' },
        { model: Payment, as: 'payments', order: [['billing_month', 'DESC']] },
        { model: Seat, as: 'seats' },
      ],
    });
    if (!startup) return res.status(404).json({ error: 'Startup not found.' });
    res.json({ startup });
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({ error: 'Failed to fetch startup.' });
  }
});

// POST /api/startups — Admin manually adds a startup
router.post('/', async (req, res) => {
  try {
    const startup = await Startup.create({ ...req.body, status: req.body.status || 'Active' });
    res.status(201).json({ startup });
  } catch (error) {
    console.error('Create startup error:', error);
    res.status(500).json({ error: 'Failed to create startup.' });
  }
});

// PUT /api/startups/:id — Update startup
router.put('/:id', async (req, res) => {
  try {
    const startup = await Startup.findByPk(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found.' });
    await startup.update(req.body);
    res.json({ startup });
  } catch (error) {
    console.error('Update startup error:', error);
    res.status(500).json({ error: 'Failed to update startup.' });
  }
});

// DELETE /api/startups/:id — Delete startup
router.delete('/:id', async (req, res) => {
  try {
    const startup = await Startup.findByPk(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found.' });
    await startup.destroy();
    res.json({ message: 'Startup deleted successfully.' });
  } catch (error) {
    console.error('Delete startup error:', error);
    res.status(500).json({ error: 'Failed to delete startup.' });
  }
});

module.exports = router;
