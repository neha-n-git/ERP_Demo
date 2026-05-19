const express = require('express');
const { Op } = require('sequelize');
const { Payment, Startup, Member, Setting } = require('../models');
const { sendPaymentReminder } = require('../services/email');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// GET /api/payments — List payments with filters
router.get('/', async (req, res) => {
  try {
    const { startup_id, billing_month, status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (startup_id) where.startup_id = startup_id;
    if (billing_month) where.billing_month = billing_month;
    if (status) where.status = status;

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const { count, rows } = await Payment.findAndCountAll({
      where, offset, limit: parseInt(limit, 10),
      order: [['billing_month', 'DESC'], ['created_at', 'DESC']],
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name', 'contact_email'] }],
    });
    res.json({ payments: rows, total: count, page: parseInt(page, 10), totalPages: Math.ceil(count / parseInt(limit, 10)) });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
});

// GET /api/payments/summary — Monthly summary
router.get('/summary', async (req, res) => {
  try {
    const { month } = req.query;
    const currentMonth = month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    const payments = await Payment.findAll({
      where: { billing_month: currentMonth },
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name'] }],
    });

    const totalBilled = payments.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0);
    const totalCollected = payments.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
    const totalOutstanding = totalBilled - totalCollected;

    res.json({ month: currentMonth, totalBilled, totalCollected, totalOutstanding, payments });
  } catch (error) {
    console.error('Payment summary error:', error);
    res.status(500).json({ error: 'Failed to fetch summary.' });
  }
});

// GET /api/payments/rate — Get current seat rate
router.get('/rate', async (req, res) => {
  try {
    const setting = await Setting.findOne({ where: { key: 'monthly_seat_rate' } });
    res.json({ rate: setting ? parseFloat(setting.value) : 5000 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rate.' });
  }
});

// PUT /api/payments/rate — Update seat rate
router.put('/rate', async (req, res) => {
  try {
    const { rate } = req.body;
    await Setting.upsert({ key: 'monthly_seat_rate', value: String(rate), description: 'Monthly rate per seat in INR' });
    res.json({ rate: parseFloat(rate) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rate.' });
  }
});

// POST /api/payments — Create a payment record
router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    const full = await Payment.findByPk(payment.id, {
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name'] }],
    });
    res.status(201).json({ payment: full });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment.' });
  }
});

// PUT /api/payments/:id — Update / mark payment as received
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found.' });
    await payment.update(req.body);
    res.json({ payment });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment.' });
  }
});

// POST /api/payments/:id/remind — Send payment reminder email
router.post('/:id/remind', async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Startup, as: 'startup' }],
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found.' });

    const result = await sendPaymentReminder(payment.startup, payment);
    res.json({ message: 'Reminder sent successfully.', result });
  } catch (error) {
    console.error('Reminder error:', error);
    res.status(500).json({ error: 'Failed to send reminder.' });
  }
});

// POST /api/payments/generate — Auto-generate monthly invoices for active startups
router.post('/generate', async (req, res) => {
  try {
    const { billing_month } = req.body;
    if (!billing_month) return res.status(400).json({ error: 'billing_month is required (YYYY-MM).' });

    const setting = await Setting.findOne({ where: { key: 'monthly_seat_rate' } });
    const rate = setting ? parseFloat(setting.value) : 5000;

    const activeStartups = await Startup.findAll({
      where: { status: 'Active' },
      include: [{ model: Member, as: 'members', where: { status: 'Active' }, required: false }],
    });

    const created = [];
    for (const startup of activeStartups) {
      const existing = await Payment.findOne({ where: { startup_id: startup.id, billing_month } });
      if (existing) continue;

      const memberCount = startup.members ? startup.members.length : 0;
      const seatCharges = rate * memberCount;

      const payment = await Payment.create({
        startup_id: startup.id,
        billing_month,
        seat_charges: seatCharges,
        additional_charges: 0,
        total_amount: seatCharges,
        status: 'Pending',
      });
      created.push(payment);
    }

    res.status(201).json({ message: `Generated ${created.length} invoices for ${billing_month}.`, payments: created });
  } catch (error) {
    console.error('Generate invoices error:', error);
    res.status(500).json({ error: 'Failed to generate invoices.' });
  }
});

module.exports = router;
