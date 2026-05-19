const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Startup = sequelize.define('Startup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.ENUM('Health Tech', 'Medical Devices', 'Biotech', 'Digital Health', 'Nutrition', 'Other'),
    allowNull: false,
  },
  stage: {
    type: DataTypes.ENUM('Ideation', 'MVP', 'Early Revenue', 'Growth'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { len: [0, 500] },
  },
  year_founded: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Founder / Primary Contact
  contact_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  team_members_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  resources_needed: {
    // Stored as JSON array: ["Office Space", "Board Room", ...]
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  referral_source: {
    type: DataTypes.ENUM('Referral', 'Website', 'Social Media', 'Event', 'Direct Call', 'Other'),
    allowNull: true,
  },
  pitch_deck_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Admin-managed fields
  status: {
    type: DataTypes.ENUM('Pending Review', 'Active', 'On Hold', 'Graduated', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending Review',
  },
  onboarding_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  assigned_seat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Postal address tracking
  postal_address_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  postal_address_since: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'startups',
});

module.exports = Startup;
