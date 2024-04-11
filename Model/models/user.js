// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
// Define the User model
const User = sequelize.define('User', {
 
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
}, {
  // Other model options
});

// Sync the model with the database
// This will create the User table if it doesn't exist
// You may want to remove this if you're using migrations
// sequelize.sync();

// Export the User model
module.exports = User;
