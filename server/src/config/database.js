const { Sequelize } = require('sequelize');
require('dotenv').config();

const options = {
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  define: { timestamps: true, underscored: true },
  dialectOptions: process.env.DB_URL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
};

const sequelize = process.env.DB_URL 
  ? new Sequelize(process.env.DB_URL, options)
  : new Sequelize(
      process.env.DB_NAME || 'sjhif_erp',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || '',
      {
        ...options,
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
      }
    );

module.exports = sequelize;
