const express = require('express');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const { Member, Startup, Attendance } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Photo upload config
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/photos')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`),
});
const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WebP images allowed.'), false);
  },
});

// GET /api/members — List all members with filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, startup_id, status, hr_pending, it_pending } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (startup_id) where.startup_id = startup_id;
    if (status) where.status = status;
    if (hr_pending === 'true') where[Op.or] = [{ id_card_issued: false }, { access_card_issued: false }];
    if (it_pending === 'true') where[Op.or] = [{ system_assigned: false }, { wifi_access_granted: false }];

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const { count, rows } = await Member.findAndCountAll({
      where, offset, limit: parseInt(limit, 10),
      order: [['full_name', 'ASC']],
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name'] }],
    });
    res.json({ members: rows, total: count, page: parseInt(page, 10), totalPages: Math.ceil(count / parseInt(limit, 10)) });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to fetch members.' });
  }
});

// GET /api/members/export — CSV export
router.get('/export', async (req, res) => {
  try {
    const { startup_id, status } = req.query;
    const where = {};
    if (startup_id) where.startup_id = startup_id;
    if (status) where.status = status;

    const members = await Member.findAll({
      where,
      include: [{ model: Startup, as: 'startup', attributes: ['name'] }],
      order: [['full_name', 'ASC']],
    });

    const headers = 'Full Name,Startup,Role,Email,Phone,Status,ID Card,Access Card,Access Card #,System Assigned,System ID,WiFi,WiFi Username,Joined,Exited\n';
    const csv = members.map(m => [
      m.full_name, m.startup?.name || '', m.role || '', m.email || '', m.phone || '', m.status,
      m.id_card_issued ? 'Yes' : 'No', m.access_card_issued ? 'Yes' : 'No', m.access_card_number || '',
      m.system_assigned ? 'Yes' : 'No', m.system_id || '', m.wifi_access_granted ? 'Yes' : 'No', m.wifi_username || '',
      m.date_of_joining || '', m.date_of_exit || '',
    ].map(v => `"${v}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=members_export.csv');
    res.send(headers + csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export members.' });
  }
});

// GET /api/members/:id
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [
        { model: Startup, as: 'startup', attributes: ['id', 'name'] },
        { model: Attendance, as: 'attendanceRecords', order: [['date', 'DESC']], limit: 30 },
      ],
    });
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    res.json({ member });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Failed to fetch member.' });
  }
});

// POST /api/members
router.post('/', uploadPhoto.single('photo'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo_path = req.file.filename;
    const member = await Member.create(data);
    res.status(201).json({ member });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ error: 'Failed to create member.' });
  }
});

// PUT /api/members/:id
router.put('/:id', uploadPhoto.single('photo'), async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    const data = { ...req.body };
    if (req.file) data.photo_path = req.file.filename;
    await member.update(data);
    res.json({ member });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member.' });
  }
});

// DELETE /api/members/:id
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found.' });
    await member.destroy();
    res.json({ message: 'Member deleted.' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Failed to delete member.' });
  }
});

// ── Attendance ──

// GET /api/members/:id/attendance
router.get('/:id/attendance', async (req, res) => {
  try {
    const { from, to } = req.query;
    const where = { member_id: req.params.id };
    if (from && to) where.date = { [Op.between]: [from, to] };
    const records = await Attendance.findAll({ where, order: [['date', 'DESC']] });
    res.json({ attendance: records });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance.' });
  }
});

// POST /api/members/:id/attendance
router.post('/:id/attendance', async (req, res) => {
  try {
    const record = await Attendance.create({ member_id: req.params.id, ...req.body });
    res.status(201).json({ attendance: record });
  } catch (error) {
    console.error('Log attendance error:', error);
    res.status(500).json({ error: 'Failed to log attendance.' });
  }
});

module.exports = router;
