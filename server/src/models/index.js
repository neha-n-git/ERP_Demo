const sequelize = require('../config/database');
const Admin = require('./Admin');
const Startup = require('./Startup');
const Member = require('./Member');
const Attendance = require('./Attendance');
const Seat = require('./Seat');
const BoardRoom = require('./BoardRoom');
const Booking = require('./Booking');
const Payment = require('./Payment');
const SupportTicket = require('./SupportTicket');
const Setting = require('./Setting');

// ── Associations ──

// Startup has many Members
Startup.hasMany(Member, { foreignKey: 'startup_id', as: 'members' });
Member.belongsTo(Startup, { foreignKey: 'startup_id', as: 'startup' });

// Member has many Attendance records
Member.hasMany(Attendance, { foreignKey: 'member_id', as: 'attendanceRecords' });
Attendance.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });

// Startup has many Payments
Startup.hasMany(Payment, { foreignKey: 'startup_id', as: 'payments' });
Payment.belongsTo(Startup, { foreignKey: 'startup_id', as: 'startup' });

// Startup has many Bookings
Startup.hasMany(Booking, { foreignKey: 'startup_id', as: 'bookings' });
Booking.belongsTo(Startup, { foreignKey: 'startup_id', as: 'startup' });

// BoardRoom has many Bookings
BoardRoom.hasMany(Booking, { foreignKey: 'board_room_id', as: 'bookings' });
Booking.belongsTo(BoardRoom, { foreignKey: 'board_room_id', as: 'boardRoom' });

// Startup has many SupportTickets
Startup.hasMany(SupportTicket, { foreignKey: 'startup_id', as: 'supportTickets' });
SupportTicket.belongsTo(Startup, { foreignKey: 'startup_id', as: 'startup' });

// Seat belongs to Startup (optional)
Seat.belongsTo(Startup, { foreignKey: 'startup_id', as: 'startup' });
Startup.hasMany(Seat, { foreignKey: 'startup_id', as: 'seats' });

module.exports = {
  sequelize,
  Admin,
  Startup,
  Member,
  Attendance,
  Seat,
  BoardRoom,
  Booking,
  Payment,
  SupportTicket,
  Setting,
};
