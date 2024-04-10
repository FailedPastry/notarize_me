const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize'); // Update the path to correctly require the sequelize instance

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
  timestamps: true, // If you want timestamps (createdAt and updatedAt) managed by Sequelize
});

module.exports = User;
