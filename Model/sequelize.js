const { Sequelize } = require('sequelize');

// Replace 'database', 'username', and 'password' with your MySQL details
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
