const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  startup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  billing_month: {
    // Format: "2026-05" (YYYY-MM)
    type: DataTypes.STRING(7),
    allowNull: false,
  },
  seat_charges: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  additional_charges: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  additional_charges_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  payment_mode: {
    type: DataTypes.ENUM('Cash', 'Bank Transfer', 'Cheque', 'UPI'),
    allowNull: true,
  },
  reference_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Partial', 'Paid'),
    defaultValue: 'Pending',
  },
}, {
  tableName: 'payments',
});

module.exports = Payment;
