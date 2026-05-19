const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BoardRoom = sequelize.define('BoardRoom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'board_rooms',
});

module.exports = BoardRoom;
