const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  board_room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  booked_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'bookings',
});

module.exports = Booking;
