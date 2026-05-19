const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Vacant', 'Occupied'),
    defaultValue: 'Vacant',
  },
  startup_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  assigned_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'seats',
});

module.exports = Seat;
