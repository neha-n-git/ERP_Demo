const express = require('express');
const { Op } = require('sequelize');
const { Seat, BoardRoom, Booking, Startup } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// ═══ SEATS ═══

// GET /api/resources/seats
router.get('/seats', async (req, res) => {
  try {
    const seats = await Seat.findAll({
      order: [['zone', 'ASC'], ['label', 'ASC']],
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name'] }],
    });
    res.json({ seats });
  } catch (error) {
    console.error('Get seats error:', error);
    res.status(500).json({ error: 'Failed to fetch seats.' });
  }
});

// PUT /api/resources/seats/:id — Assign or vacate a seat
router.put('/seats/:id', async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);
    if (!seat) return res.status(404).json({ error: 'Seat not found.' });
    await seat.update(req.body);
    const updated = await Seat.findByPk(req.params.id, {
      include: [{ model: Startup, as: 'startup', attributes: ['id', 'name'] }],
    });
    res.json({ seat: updated });
  } catch (error) {
    console.error('Update seat error:', error);
    res.status(500).json({ error: 'Failed to update seat.' });
  }
});

// ═══ BOARD ROOMS ═══

// GET /api/resources/boardrooms
router.get('/boardrooms', async (req, res) => {
  try {
    const rooms = await BoardRoom.findAll({ order: [['name', 'ASC']] });
    res.json({ boardRooms: rooms });
  } catch (error) {
    console.error('Get board rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch board rooms.' });
  }
});

// ═══ BOOKINGS ═══

// GET /api/resources/bookings
router.get('/bookings', async (req, res) => {
  try {
    const { date, board_room_id, startup_id } = req.query;
    const where = {};
    if (date) where.date = date;
    if (board_room_id) where.board_room_id = board_room_id;
    if (startup_id) where.startup_id = startup_id;

    const bookings = await Booking.findAll({
      where,
      order: [['date', 'ASC'], ['start_time', 'ASC']],
      include: [
        { model: BoardRoom, as: 'boardRoom', attributes: ['id', 'name', 'capacity'] },
        { model: Startup, as: 'startup', attributes: ['id', 'name'] },
      ],
    });
    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// GET /api/resources/bookings/today — Today's bookings count for dashboard
router.get('/bookings/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const count = await Booking.count({ where: { date: today } });
    res.json({ count, date: today });
  } catch (error) {
    console.error('Today bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch today bookings.' });
  }
});

// POST /api/resources/bookings — Create booking with conflict check
router.post('/bookings', async (req, res) => {
  try {
    const { board_room_id, startup_id, date, start_time, end_time, purpose, booked_by } = req.body;

    if (!board_room_id || !startup_id || !date || !start_time || !end_time) {
      return res.status(400).json({ error: 'All booking fields are required.' });
    }

    // Check for conflicts — overlapping time slots on same room and date
    const conflict = await Booking.findOne({
      where: {
        board_room_id,
        date,
        [Op.or]: [
          { start_time: { [Op.lt]: end_time }, end_time: { [Op.gt]: start_time } },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({
        error: 'Time slot conflict. This room is already booked during the selected time.',
        conflictingBooking: conflict,
      });
    }

    const booking = await Booking.create({ board_room_id, startup_id, date, start_time, end_time, purpose, booked_by });
    const full = await Booking.findByPk(booking.id, {
      include: [
        { model: BoardRoom, as: 'boardRoom', attributes: ['id', 'name'] },
        { model: Startup, as: 'startup', attributes: ['id', 'name'] },
      ],
    });
    res.status(201).json({ booking: full });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking.' });
  }
});

// DELETE /api/resources/bookings/:id
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    await booking.destroy();
    res.json({ message: 'Booking cancelled.' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
});

module.exports = router;
