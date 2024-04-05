const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // The path to your sequelize.js file

const User = sequelize.define('User', {
  // Define attributes
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  // Model options
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
