const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  startup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_of_joining: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  date_of_exit: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Exited'),
    defaultValue: 'Active',
  },
  // HR Fields
  id_card_issued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  access_card_issued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  access_card_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // IT Fields
  system_assigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  system_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wifi_access_granted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wifi_username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'members',
});

module.exports = Member;
